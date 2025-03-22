package services

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"crown.com/rest-api/models"

	"github.com/invopop/jsonschema"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

var serverMsg string = `You are a professional hair care expert for black clients with type 4 hair. 
Given a hair profile, recommend up to 3 products per category (conditioner, shampoo, and leave-in conditioner). 
Return the response in structured JSON format.`

type ProductRecommendation struct {
	Conditioners        []string `json:"conditioners" jsonschema_description:"list of recommended conditioners"`
	Shampoos            []string `json:"shampoos" jsonschema_description:"list of recommended shampoos"`
	LeaveInConditioners []string `json:"leave_in_conditioners" jsonschema_description:"list of recommended leave-in conditioners"`
}

func GenerateSchema[T any]() any {
	// Structured Outputs uses a subset of JSON schema
	// These flags are necessary to comply with the subset
	reflector := jsonschema.Reflector{
		AllowAdditionalProperties: false,
		DoNotReference:            true,
	}
	var v T
	schema := reflector.Reflect(v)
	return schema
}

var ProductRecommendationResponseSchema = GenerateSchema[ProductRecommendation]()

func FindProducts(profile models.HairProfile) (models.ProductRecommendation, error) {

	var recommendation models.ProductRecommendation

	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return recommendation, fmt.Errorf("OPENAI_API_KEY not set")
	}

	client := openai.NewClient(
		option.WithAPIKey(apiKey),
	)
	ctx := context.Background()

	schemaParam := openai.ResponseFormatJSONSchemaJSONSchemaParam{
		Name:        "product_recommendations",
		Description: openai.String("Conditioners, shampoos, and leave-in conditioners that are recommended for the user's hair profile"),
		Schema:      ProductRecommendationResponseSchema,
		Strict:      openai.Bool(true),
	}

	chat, err := client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(serverMsg),
			openai.UserMessage(
				fmt.Sprintf(
					"Hair Profile:\nHair Type: %s\nPorosity: %s\nVolume: %s\nDesired Outcome: %s\n\nRecommend hair care products.",
					profile.CurlType, profile.Porosity, profile.Volume, profile.DesiredOutcome,
				),
			),
		},
		ResponseFormat: openai.ChatCompletionNewParamsResponseFormatUnion{
			OfJSONSchema: &openai.ResponseFormatJSONSchemaParam{JSONSchema: schemaParam},
		},
		Seed:  openai.Int(1),
		Model: openai.ChatModelGPT4oMini2024_07_18,
	})
	if err != nil {
		return recommendation, fmt.Errorf("could not initiate chat with ai: %w", err)
	}

	var productRecommendation ProductRecommendation

	err = json.Unmarshal([]byte(chat.Choices[0].Message.Content), &productRecommendation)
	if err != nil {
		return recommendation, fmt.Errorf("could not parse ai response: %w", err)
	}

	recommendation.Conditioners = productRecommendation.Conditioners
	recommendation.Shampoos = productRecommendation.Shampoos
	recommendation.LeaveInConditioners = productRecommendation.LeaveInConditioners

	return recommendation, nil
}
