package routes

import (
	"crown.com/rest-api/controllers"

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
}
