package models

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type ProductRecommendation struct {
	gorm.Model
	ProfileId           uint           `json:"profile_id"`
	Conditioners        pq.StringArray `json:"conditioners" gorm:"type:text[]"`
	Shampoos            pq.StringArray `json:"shampoos" gorm:"type:text[]"`
	LeaveInConditioners pq.StringArray `json:"leave_in_conditioners" gorm:"type:text[]"`
}
