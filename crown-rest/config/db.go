package config

import (
	"fmt"
	"log"

	"crown.com/rest-api/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "host=localhost user=postgres dbname=crown password=lego sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to crown db:", err)
	}

	fmt.Println("Connected to crown db!")

	err = DB.AutoMigrate(&models.User{}, &models.HairProfile{})

	if err != nil {
		log.Fatal("Error migrating models to crown db", err)
	}
}
