package middleware

import (
	"net/http"
	"strings"

	"crown.com/rest-api/services"
	"github.com/gin-gonic/gin"
)

func RequireAuth(c *gin.Context) {
	auth_header := c.GetHeader("Authorization")
	if auth_header == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
		c.Abort()
		return
	}

	split_value := strings.Split(auth_header, " ")

	if len(split_value) != 2 || strings.ToLower(split_value[0]) != "bearer" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token missing/corrupted"})
		c.Abort()
		return
	}

	token_string := split_value[1]

	userDetails, err := services.ValidateJWT(token_string)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "JWT invalid/expired"})
		c.Abort()
		return
	}

	c.Set("user_id", userDetails.ID)
	c.Set("username", userDetails.Username)
	c.Set("email", userDetails.Email)
	c.Set("role", userDetails.Role)
	c.Next()
}
