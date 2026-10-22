package middleware

import (
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type clientBucket struct {
	timestamps []time.Time
}

type RateLimiter struct {
	mu       sync.Mutex
	window   time.Duration
	max      int
	clients  map[string]*clientBucket
	stopChan chan struct{}
}

func NewRateLimiter(window time.Duration, max int) *RateLimiter {
	rl := &RateLimiter{
		window:   window,
		max:      max,
		clients:  make(map[string]*clientBucket),
		stopChan: make(chan struct{}),
	}

	// Periodic cleanup every 5 minutes to prevent memory leak
	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				rl.cleanup()
			case <-rl.stopChan:
				return
			}
		}
	}()

	return rl
}

func (rl *RateLimiter) cleanup() {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	for ip, bucket := range rl.clients {
		var active []time.Time
		for _, t := range bucket.timestamps {
			if now.Sub(t) < rl.window {
				active = append(active, t)
			}
		}
		if len(active) == 0 {
			delete(rl.clients, ip)
		} else {
			bucket.timestamps = active
		}
	}
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		if fwd := c.GetHeader("X-Forwarded-For"); fwd != "" {
			parts := strings.Split(fwd, ",")
			if len(parts) > 0 {
				ip = strings.TrimSpace(parts[0])
			}
		}

		rl.mu.Lock()
		bucket, exists := rl.clients[ip]
		if !exists {
			bucket = &clientBucket{timestamps: make([]time.Time, 0, rl.max)}
			rl.clients[ip] = bucket
		}

		now := time.Now()
		var valid []time.Time
		for _, t := range bucket.timestamps {
			if now.Sub(t) < rl.window {
				valid = append(valid, t)
			}
		}
		bucket.timestamps = valid

		if len(bucket.timestamps) >= rl.max {
			rl.mu.Unlock()
			c.Header("Retry-After", "60")
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": gin.H{
					"code":    "RATE_LIMIT_EXCEEDED",
					"message": "Too many requests. Please throttle your API calls.",
				},
			})
			return
		}

		bucket.timestamps = append(bucket.timestamps, now)
		rl.mu.Unlock()

		c.Next()
	}
}

// RequestSizeLimit restricts max request body payload
func RequestSizeLimit(maxBytes int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)
		c.Next()
	}
}
