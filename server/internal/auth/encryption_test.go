package auth_test

import (
	"testing"

	"rankora/server/internal/auth"
)

func TestTokenEncryptionDecryptionRoundtrip(t *testing.T) {
	key := "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
	plaintext := "gho_sampleGithubAccessTokenSecret123456789"

	encrypted, err := auth.EncryptToken(plaintext, key)
	if err != nil {
		t.Fatalf("encryption failed: %v", err)
	}

	if encrypted == plaintext {
		t.Fatalf("ciphertext must not match plaintext")
	}

	decrypted, err := auth.DecryptToken(encrypted, key)
	if err != nil {
		t.Fatalf("decryption failed: %v", err)
	}

	if decrypted != plaintext {
		t.Fatalf("expected decrypted text %q, got %q", plaintext, decrypted)
	}
}

func TestTokenDecryptionWithWrongKeyFails(t *testing.T) {
	key1 := "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
	key2 := "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210"
	plaintext := "test_secret_payload"

	encrypted, err := auth.EncryptToken(plaintext, key1)
	if err != nil {
		t.Fatalf("encryption failed: %v", err)
	}

	_, err = auth.DecryptToken(encrypted, key2)
	if err == nil {
		t.Fatalf("expected decryption with wrong key to fail, but it succeeded")
	}
}

func TestTokenTamperResistance(t *testing.T) {
	key := "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
	plaintext := "tamper_proof_auth_token"

	encrypted, err := auth.EncryptToken(plaintext, key)
	if err != nil {
		t.Fatalf("encryption failed: %v", err)
	}

	// Tamper with the last character of hex string
	tampered := []byte(encrypted)
	if tampered[len(tampered)-1] == 'a' {
		tampered[len(tampered)-1] = 'b'
	} else {
		tampered[len(tampered)-1] = 'a'
	}

	_, err = auth.DecryptToken(string(tampered), key)
	if err == nil {
		t.Fatalf("tampered ciphertext must fail authentication and decryption")
	}
}
