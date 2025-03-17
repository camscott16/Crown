package services

import (
	"fmt"
	"os"
	"time"

	"crown.com/rest-api/config"
	"crown.com/rest-api/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var TEST_KEY string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJuYmYiOjE0NDQ0Nzg0MDB9.u1riaD1rW97opCoAuRCTy4w58Br-Zk-bh7vLiRIsrpU"

type Credentials struct {
	Username string `json:"user_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func getEnvWithDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return "", fmt.Errorf("failed to generate hash: %w", err)
	}

	return string(hash), nil
}

func ValidatePassword(password1 string, password2 string) error {
	hash := []byte(password1)
	password := []byte(password2)
	return bcrypt.CompareHashAndPassword(hash, password)
}

func GenerateJWT(user models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	secret := getEnvWithDefault("JWT_KEY", TEST_KEY)
	tokenString, err := token.SignedString([]byte(secret))

	if err != nil {
		return "", fmt.Errorf("failed to generate token: %w", err)
	}

	return tokenString, nil
}

func ValidateJWT(token_string string) (models.User, error) {

	var user models.User
	token, err := jwt.Parse(token_string, func(token *jwt.Token) (interface{}, error) {

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		secret := getEnvWithDefault("JWT_KEY", TEST_KEY)

		return []byte(secret), nil
	})
	if err != nil {
		return user, fmt.Errorf("token parse failed: %w", err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		// Check the expiration
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			return user, fmt.Errorf("token expired: %w", err)
		}
		result := config.DB.Where("id = ?", claims["sub"]).First(&user)

		if result.Error != nil {
			return user, fmt.Errorf("token doesn't exist for user: %w", err)
		}

	} else {
		return user, fmt.Errorf("token doesn't exist")
	}

	return user, nil

}
