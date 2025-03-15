package routes

import (
	"crown.com/rest-api/controllers"
	"crown.com/rest-api/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {

	authGroup := router.Group("/auth")
	{
		authGroup.POST("/signup", controllers.SignupUser)
		authGroup.POST("/login", controllers.LoginUser)
		authGroup.POST("/logout", controllers.LogoutUser)
		authGroup.POST("/forgot-password", controllers.ForgotPassword)
		authGroup.POST("/reset-password", controllers.ResetPassword)
		authGroup.POST("/verify", controllers.VerifyUser)
	}

	userGroup := router.Group("/users")
	{
		userGroup.GET("/", controllers.GetUsers)
		userGroup.POST("/", controllers.CreateUser)
		userGroup.GET("/:id", controllers.GetUserByID)
		userGroup.PATCH("/:id", controllers.UpdateUser)
		userGroup.DELETE("/:id", controllers.DeleteUser)
		userGroup.POST("/:id/hair-profile", controllers.CreateHairProfile)
		userGroup.GET("/:id/recommendation", controllers.GetRecommendation)
	}

	validateRoute := router.Group("/validate")
	validateRoute.Use(middleware.RequireAuth)

	validateRoute.GET("/", func(c *gin.Context) {
		// Retrieve user ID from context
		userID, _ := c.Get("user")
		c.JSON(200, gin.H{
			"message": "You are authorized",
			"user":    userID,
		})
	})
}
