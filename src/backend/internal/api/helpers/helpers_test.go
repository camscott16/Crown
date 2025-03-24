package helpers

import (
	"testing"

	"crown.com/rest-api/internal/assert"
)

func TestSanityCheck(t *testing.T) {
	const (
		validUser     = "test_user"
		validEmail    = "testuser@gmail.com"
		validPassword = "password"
	)
	tests := []struct {
		name        string
		credentials Credentials
		expected    bool
	}{
		{
			name: "Valid signup info",
			credentials: Credentials{
				Username: validUser,
				Email:    validEmail,
				Password: validPassword,
			},
			expected: true,
		},
		{
			name: "Incorrect username format",
			credentials: Credentials{
				Username: "te",
				Email:    validEmail,
				Password: validPassword,
			},
			expected: false,
		},
		{
			name: "Incorrect email format",
			credentials: Credentials{
				Username: validUser,
				Email:    "testuser",
				Password: validPassword,
			},
			expected: false,
		},
		{
			name: "Short password",
			credentials: Credentials{
				Username: validUser,
				Email:    validEmail,
				Password: "test",
			},
			expected: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual := true
			if err := SanityCheckCred(tt.credentials); err != nil {
				actual = false
			}
			assert.Equal(t, actual, tt.expected)
		})
	}
}
