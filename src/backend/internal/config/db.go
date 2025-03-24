package config

import (
	"fmt"
	"log"
	"os"

	"crown.com/rest-api/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func getEnvWithDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func ConnectDB() {

	host := getEnvWithDefault("DB_HOST", "localhost")
	port := getEnvWithDefault("DB_PORT", "5432")
	user := getEnvWithDefault("DB_USER", "postgres")
	dbname := getEnvWithDefault("DB_NAME", "crown")
	password := getEnvWithDefault("DB_PASSWORD", "lego")
	sslmode := getEnvWithDefault("DB_SSLMODE", "disable")

	dsn := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s", host, port, user, dbname, password, sslmode)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to crown db:", err)
	}

	fmt.Println("Connected to crown db!")

	err = DB.AutoMigrate(&models.User{}, &models.HairProfile{}, &models.Product{}, &models.ProductRecommendation{})

	if err != nil {
		log.Fatal("Error migrating models to crown db", err)
	}
}
