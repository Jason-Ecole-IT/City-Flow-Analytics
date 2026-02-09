package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("Ingestion service started")

	// Boucle simple pour simuler un service actif
	for i := 1; i <= 5; i++ {
		fmt.Printf("Tick %d\n", i)
		time.Sleep(1 * time.Second)
	}

	fmt.Println("Ingestion service exiting")
}
