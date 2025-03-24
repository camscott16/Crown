package models

import (
	"gorm.io/gorm"
)

type HairProfile struct {
	gorm.Model
	UserId         uint   `json:"user_id"`
	CurlType       string `json:"curl_type"`
	Porosity       string `json:"porosity"`
	Volume         string `json:"volume"`
	DesiredOutcome string `json:"desired_outcome"`
}
