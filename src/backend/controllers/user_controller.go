package controllers

import (
	"fmt"
	"strconv"

	"crown.com/rest-api/config"
	"crown.com/rest-api/models"
	"crown.com/rest-api/services"
	"gorm.io/gorm"

	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateUser creates a new user
func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Create(&user)
	c.JSON(http.StatusCreated, user)
}

// GetUsers returns all users
func GetUsers(c *gin.Context) {
	var users []models.User
	config.DB.Find(&users)
	c.JSON(http.StatusOK, users)
}

// GetUserByID returns a user by ID
func GetUserByID(c *gin.Context) {
	var user models.User
	id := c.Param("id")

	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUser updates an existing user
func UpdateUser(c *gin.Context) {
	var user models.User
	id := c.Param("id")

	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&user)
	c.JSON(http.StatusOK, user)
}

// DeleteUser deletes a user
func DeleteUser(c *gin.Context) {
	var user models.User
	id := c.Param("id")

	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	config.DB.Delete(&user)
	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}

func CreateHairProfile(c *gin.Context) {
	var hairProfile models.HairProfile

	id := c.Param("id")
	userIDInt, err := strconv.Atoi(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	userID := uint(userIDInt)

	if err := c.ShouldBindJSON(&hairProfile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hairProfile.UserId = userID

	if err := config.DB.Create(&hairProfile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create hair profile"})
		return
	}

	c.JSON(http.StatusCreated, hairProfile)

}

func GetRecommendation(c *gin.Context) {

	id := c.Param("id")
	userIDInt, err := strconv.Atoi(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	userID := uint(userIDInt)

	// Query database for the HairProfile associated with the users id
	var hairProfile models.HairProfile
	result := config.DB.Where("user_id = ?", userID).First(&hairProfile)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Hair profile not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve hair profile"})
		}
		return
	}

	recommendation, err := services.FindProducts(hairProfile)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	recommendation.UserId = userID

	if err := config.DB.Create(&recommendation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recommendation could not be made at this time"})
		return
	}

	response := gin.H{
		"message":        fmt.Sprintf("Recommendation successful for %d", userID),
		"recommendation": recommendation,
	}

	c.JSON(http.StatusOK, response)

}
