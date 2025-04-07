package handlers

import (
	"fmt"
	"strconv"

	"crown.com/rest-api/internal/api/helpers"
	"crown.com/rest-api/internal/config"
	"crown.com/rest-api/internal/models"
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

func FetchUserData(c *gin.Context) {
	// dto for the data this is fetching
	var hairProfiles []struct {
		Id             uint   `json:"id"`
		Name           string `json:"name"`
		CurlType       string `json:"curl_type"`
		Porosity       string `json:"porosity"`
		Volume         string `json:"volume"`
		DesiredOutcome string `json:"desired_outcome"`
	}

	id := c.Param("id")
	userIDInt, err := strconv.Atoi(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	userID := uint(userIDInt)

	// queries database to find the users hair profiles and order them in descending order!
	result := config.DB.
		Table("hair_profiles").
		Select("id", "name", "curl_type", "porosity", "volume", "desired_outcome").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Scan(&hairProfiles)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve hair profile"})
		return
	}

	if len(hairProfiles) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "User has no hair profiles", "data": []any{}})
		return
	}

	c.JSON(http.StatusOK, hairProfiles)
}

func CreateHairProfile(c *gin.Context) {
	var hairProfile models.HairProfile

	var hairProfileDTO struct {
		Id             uint   `json:"id"`
		Name           string `json:"name"`
		CurlType       string `json:"curl_type"`
		Porosity       string `json:"porosity"`
		Volume         string `json:"volume"`
		DesiredOutcome string `json:"desired_outcome"`
	}

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

	hairProfileDTO.Id = hairProfile.ID
	hairProfileDTO.Name = hairProfile.Name
	hairProfileDTO.CurlType = hairProfile.CurlType
	hairProfileDTO.Porosity = hairProfile.Porosity
	hairProfileDTO.Volume = hairProfile.Volume
	hairProfileDTO.DesiredOutcome = hairProfile.DesiredOutcome

	c.JSON(http.StatusCreated, hairProfileDTO)

}

func GetRecommendation(c *gin.Context) {

	hpId := c.Param("hair-profile-id")
	hpIDInt, err := strconv.Atoi(hpId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid hair profile ID"})
		return
	}
	hpID := uint(hpIDInt)

	// Query database for the HairProfile associated with the users id
	var hairProfile models.HairProfile
	result := config.DB.Where("id = ?", hpID).First(&hairProfile)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Hair profile not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve hair profile"})
		}
		return
	}

	recommendation, err := helpers.FindProducts(hairProfile)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	recommendation.ProfileId = hairProfile.ID

	if err := config.DB.Create(&recommendation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recommendation could not be made at this time"})
		return
	}

	response := gin.H{
		"message":        fmt.Sprintf("Recommendation successful for %d", hpID),
		"recommendation": recommendation,
	}

	c.JSON(http.StatusOK, response)

}
