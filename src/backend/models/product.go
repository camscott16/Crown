package models

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name        string   `json:"name"`
	Description string   `json:"description"`
	CurlType    uint8    `json:"curl_type"`
	Porosity    uint8    `json:"porosity"`
	Volume      uint8    `json:"volume"`
	Ingredients []string `json:"ingredients"`
	Benefits    []string `json:"benefits"`
}
