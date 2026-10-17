package auth

import (
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"net/http"
	"strings"
	"sync"
	"time"

	"rankora/server/internal/config"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type JWK struct {
	Kty string `json:"kty"`
	Use string `json:"use"`
	Kid string `json:"kid"`
	N   string `json:"n"`
	E   string `json:"e"`
}

type JWKSResponse struct {
	Keys []JWK `json:"keys"`
}

type JWKSCache struct {
	mu        sync.RWMutex
	jwksURL   string
	keys      map[string]*rsa.PublicKey
	fetchedAt time.Time
	ttl       time.Duration
}

var (
	cache     *JWKSCache
	cacheOnce sync.Once
)

func getJWKSCache(jwksURL string) *JWKSCache {
	cacheOnce.Do(func() {
		cache = &JWKSCache{
			jwksURL: jwksURL,
			keys:    make(map[string]*rsa.PublicKey),
			ttl:     1 * time.Hour,
		}
	})
	return cache
}

func (c *JWKSCache) getKey(kid string) (*rsa.PublicKey, error) {
	c.mu.RLock()
	if time.Since(c.fetchedAt) < c.ttl {
		if key, ok := c.keys[kid]; ok {
			c.mu.RUnlock()
			return key, nil
		}
	}
	c.mu.RUnlock()

	// Refresh cache on missing key or expired TTL
	c.mu.Lock()
	defer c.mu.Unlock()

	// Double check
	if time.Since(c.fetchedAt) < c.ttl {
		if key, ok := c.keys[kid]; ok {
			return key, nil
		}
	}

	if c.jwksURL == "" {
		return nil, errors.New("no JWKS URL configured")
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(c.jwksURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch JWKS from %s: %w", c.jwksURL, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("JWKS endpoint returned status %d", resp.StatusCode)
	}

	var jwks JWKSResponse
	if err := json.NewDecoder(resp.Body).Decode(&jwks); err != nil {
		return nil, fmt.Errorf("failed to decode JWKS: %w", err)
	}

	newKeys := make(map[string]*rsa.PublicKey)
	for _, k := range jwks.Keys {
		if k.Kty == "RSA" && k.N != "" && k.E != "" {
			pubKey, err := parseRSAPublicKey(k.N, k.E)
			if err == nil {
				newKeys[k.Kid] = pubKey
			}
		}
	}

	c.keys = newKeys
	c.fetchedAt = time.Now()

	if key, ok := c.keys[kid]; ok {
		return key, nil
	}

	return nil, fmt.Errorf("public key with kid %s not found in JWKS", kid)
}

func parseRSAPublicKey(nStr, eStr string) (*rsa.PublicKey, error) {
	nBytes, err := base64.RawURLEncoding.DecodeString(nStr)
	if err != nil {
		return nil, err
	}
	eBytes, err := base64.RawURLEncoding.DecodeString(eStr)
	if err != nil {
		return nil, err
	}

	var eInt int
	for _, b := range eBytes {
		eInt = (eInt << 8) | int(b)
	}

	n := new(big.Int).SetBytes(nBytes)
	return &rsa.PublicKey{
		N: n,
		E: eInt,
	}, nil
}

// ClerkClaims represents standard Clerk JWT claims
type ClerkClaims struct {
	jwt.RegisteredClaims
	AuthorizedParties []string `json:"azp,omitempty"`
}

// RequireClerkAuth verifies Clerk Bearer token and sets the verified clerk_user_id in Gin context
func RequireClerkAuth(cfg *config.Config) gin.HandlerFunc {
	jwks := getJWKSCache(cfg.ClerkJWKSURL)

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Authentication required. Missing Authorization header.",
			})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid Authorization header format. Expected 'Bearer <token>'.",
			})
			return
		}

		tokenString := parts[1]

		// Development fallback: in local development mode without JWKS configured, allow verified dev tokens
		// formatted as 'mock_<clerk_user_id>' or 'user_<id>' only if explicitly in development environment
		if cfg.Environment == "development" && (strings.HasPrefix(tokenString, "mock_") || strings.HasPrefix(tokenString, "user_")) {
			clerkSubject := tokenString
			c.Set("clerk_user_id", clerkSubject)
			c.Next()
			return
		}

		// Parse token and dynamically resolve RSA public key from Clerk JWKS or PEM
		parsedToken, err := jwt.ParseWithClaims(tokenString, &ClerkClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			// If static PEM configured, try parsing it
			if cfg.ClerkPEMPublicKey != "" {
				return jwt.ParseRSAPublicKeyFromPEM([]byte(cfg.ClerkPEMPublicKey))
			}

			kid, _ := token.Header["kid"].(string)
			return jwks.getKey(kid)
		})

		if err != nil || !parsedToken.Valid {
			// In development mode, check if token can be inspected for claims when JWKS is not reachable
			if cfg.Environment == "development" {
				unverifiedClaims := jwt.MapClaims{}
				parser := jwt.NewParser()
				if _, _, unverifiedErr := parser.ParseUnverified(tokenString, unverifiedClaims); unverifiedErr == nil {
					if sub, ok := unverifiedClaims["sub"].(string); ok && sub != "" {
						c.Set("clerk_user_id", sub)
						c.Next()
						return
					}
				}
			}

			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error":   "Invalid or expired Clerk token.",
				"details": err.Error(),
			})
			return
		}

		claims, ok := parsedToken.Claims.(*ClerkClaims)
		if !ok || claims.Subject == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Clerk token does not contain a valid subject claim.",
			})
			return
		}

		// Bind verified Clerk subject to context. Handlers MUST use this subject.
		c.Set("clerk_user_id", claims.Subject)
		c.Next()
	}
}

// OptionalClerkAuth extracts clerk_user_id if valid Bearer token provided, but doesn't reject if missing
func OptionalClerkAuth(cfg *config.Config) gin.HandlerFunc {
	requireAuth := RequireClerkAuth(cfg)

	return func(c *gin.Context) {
		if c.GetHeader("Authorization") != "" {
			requireAuth(c)
		} else {
			c.Next()
		}
	}
}

// GetClerkUserID retrieves the authenticated subject from Gin context
func GetClerkUserID(c *gin.Context) string {
	val, exists := c.Get("clerk_user_id")
	if !exists {
		return ""
	}
	if str, ok := val.(string); ok {
		return str
	}
	return ""
}
