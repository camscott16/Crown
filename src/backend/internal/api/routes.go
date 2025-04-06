package api

import (
	handlers "crown.com/rest-api/internal/api/handlers"
	"crown.com/rest-api/internal/api/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {

	authGroup := router.Group("/auth")
	{
		authGroup.POST("/signup", handlers.SignupUser)
		authGroup.POST("/login", handlers.LoginUser)
		authGroup.POST("/logout", handlers.LogoutUser)
		authGroup.POST("/forgot-password", handlers.ForgotPassword)
		authGroup.POST("/reset-password", handlers.ResetPassword)
		authGroup.POST("/verify", handlers.VerifyUser)
	}

	userGroup := router.Group("/users")
	{
		userGroup.GET("/", handlers.GetUsers)
		userGroup.POST("/", handlers.CreateUser)
		userGroup.GET("/:id", handlers.GetUserByID)
		userGroup.PATCH("/:id", handlers.UpdateUser)
		userGroup.DELETE("/:id", handlers.DeleteUser)
		userGroup.POST("/:id/hair-profile", handlers.CreateHairProfile)
		userGroup.GET("/:id/recommendation", handlers.GetRecommendation)
		userGroup.GET("/:id/fetch", handlers.FetchUserData)
	}

	validateRoute := router.Group("/validate")
	validateRoute.Use(middleware.RequireAuth)

	validateRoute.GET("/", func(c *gin.Context) {
		// Retrieve user ID from context
		userID, _ := c.Get("user_id")
		userName, _ := c.Get("username")
		email, _ := c.Get("email")
		userRole, _ := c.Get("role")
		c.JSON(200, gin.H{
			"user_id":  userID,
			"username": userName,
			"email":    email,
			"role":     userRole,
		})
	})
}
