package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SignupUser(c *gin.Context) {
	response := gin.H{
		"message": "User successfully registered!",
	}
	c.JSON(http.StatusOK, response)
}
func LoginUser(c *gin.Context) {
	response := gin.H{
		"message":   "User successfully logged in!",
		"jwt_token": "(generated token)",
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
