package services

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type Credentials struct {
	Username string `json:"user_name"`
	Password string `json:"password"`
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

// func GenerateJWT()
