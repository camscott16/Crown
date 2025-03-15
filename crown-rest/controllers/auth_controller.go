package controllers

import (
	"fmt"
	"net/http"

	"crown.com/rest-api/config"
	"crown.com/rest-api/models"
	"crown.com/rest-api/services"
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

func SignupUser(c *gin.Context) {

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashed_password, err := services.HashPassword(user.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		user.Password = hashed_password
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create hair profile"})
		return
	}

	response := gin.H{
		"message": fmt.Sprintf("User %d successfully registered!", user.ID),
	}
	c.JSON(http.StatusOK, response)
}

func LoginUser(c *gin.Context) {

	var credentials services.Credentials
	var user models.User

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(credentials)

	result := config.DB.Where("username = ?", credentials.Username).First(&user)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve User"})
		}
		return
	}

	if err := services.ValidatePassword(user.Password, credentials.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Incorrect username/password"})
		return
	}

	jwt_token, err := services.GenerateJWT(user)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error generating JWT token"})
		return
	}

	response := gin.H{
		"message":   "User successfully logged in!",
		"jwt_token": jwt_token,
	}

	c.JSON(http.StatusOK, response)
}
func LogoutUser(c *gin.Context) {
	response := gin.H{
		"message": "User successfully logged out",
	}
	c.JSON(http.StatusOK, response)
}
func ForgotPassword(c *gin.Context) {
	response := gin.H{
		"message":     "Valid email",
		"reset_token": "(generated token)",
	}
	c.JSON(http.StatusOK, response)
}
func ResetPassword(c *gin.Context) {
	response := gin.H{
		"message": "User password successfully reset!",
	}
	c.JSON(http.StatusOK, response)
}
func VerifyUser(c *gin.Context) {
	response := gin.H{
		"message": "User successfully verified!",
	}
	c.JSON(http.StatusOK, response)
}
