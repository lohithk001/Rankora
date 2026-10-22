package auth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"io"
)

// EncryptToken encrypts a plaintext token using AES-256-GCM
func EncryptToken(token, secretKey string) (string, error) {
	if token == "" {
		return "", errors.New("cannot encrypt empty token")
	}

	keyHash := sha256.Sum256([]byte(secretKey))
	block, err := aes.NewCipher(keyHash[:])
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := gcm.Seal(nonce, nonce, []byte(token), nil)
	return hex.EncodeToString(ciphertext), nil
}

// DecryptToken decrypts an AES-256-GCM ciphertext
func DecryptToken(encryptedHex, secretKey string) (string, error) {
	data, err := hex.DecodeString(encryptedHex)
	if err != nil {
		return "", err
	}

	keyHash := sha256.Sum256([]byte(secretKey))
	block, err := aes.NewCipher(keyHash[:])
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", errors.New("invalid ciphertext: length less than nonce")
	}

	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
