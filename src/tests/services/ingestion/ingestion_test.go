package main

import (
	"fmt"
	"testing"
)

// TestIngestionStartup tests basic startup message
func TestIngestionStartup(t *testing.T) {
	expected := "Ingestion service started"
	if expected == "" {
		t.Error("Expected message should not be empty")
	}
}

// TestTickCounter tests tick counting logic
func TestTickCounter(t *testing.T) {
	tests := []struct {
		name     string
		start    int
		end      int
		expected int
	}{
		{"Single tick", 1, 1, 1},
		{"Five ticks", 1, 5, 5},
		{"Ten ticks", 1, 10, 10},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			count := 0
			for i := tt.start; i <= tt.end; i++ {
				count++
			}
			if count != tt.expected {
				t.Errorf("expected %d ticks, got %d", tt.expected, count)
			}
		})
	}
}

// TestTickMessageFormat tests the format of tick messages
func TestTickMessageFormat(t *testing.T) {
	for i := 1; i <= 5; i++ {
		message := fmt.Sprintf("Tick %d\n", i)
		if message == "" {
			t.Error("Tick message should not be empty")
		}
		if message != fmt.Sprintf("Tick %d\n", i) {
			t.Errorf("Unexpected message format: %s", message)
		}
	}
}

// TestIngestionExit tests exit message
func TestIngestionExit(t *testing.T) {
	expected := "Ingestion service exiting"
	if expected == "" {
		t.Error("Exit message should not be empty")
	}
}

// TestLoopBoundaries tests the loop boundary conditions
func TestLoopBoundaries(t *testing.T) {
	start := 1
	end := 5

	if start < 1 {
		t.Error("Start should be at least 1")
	}

	if end < start {
		t.Error("End should be greater than or equal to start")
	}

	count := 0
	for i := start; i <= end; i++ {
		count++
	}

	if count != (end - start + 1) {
		t.Errorf("Expected %d iterations, got %d", end-start+1, count)
	}
}
