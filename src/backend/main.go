package main

import (
	"crown.com/rest-api/config"
	"crown.com/rest-api/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDB()

	r := gin.Default()
	routes.SetupRoutes(r)

	r.Run(":8080")

}
