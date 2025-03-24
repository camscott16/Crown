package main

import (
	"crown.com/rest-api/internal/api"
	"crown.com/rest-api/internal/config"
	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDB()

	r := gin.Default()
	api.SetupRoutes(r)

	r.Run(":8080")

}
