package models

import (
	"gorm.io/gorm"
)

type HairProfile struct {
	gorm.Model
	UserId   uint  `json:"user_id"`
	CurlType uint8 `json:"curl_type"`
	Porosity uint8 `json:"porosity"`
	Volume   uint8 `json:"volume"`
}
