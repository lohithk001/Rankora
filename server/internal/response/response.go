package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type APIError struct {
	Code      string      `json:"code"`
	Message   string      `json:"message"`
	RequestID string      `json:"request_id"`
	Details   interface{} `json:"details,omitempty"`
}

type ErrorEnvelope struct {
	Error APIError `json:"error"`
}

func getOrGenerateRequestID(c *gin.Context) string {
	reqID := c.GetHeader("X-Request-ID")
	if reqID == "" {
		if val, exists := c.Get("request_id"); exists {
			if s, ok := val.(string); ok {
				return s
			}
		}
		reqID = uuid.New().String()
		c.Set("request_id", reqID)
	}
	return reqID
}

func JSONError(c *gin.Context, statusCode int, code, message string, details interface{}) {
	reqID := getOrGenerateRequestID(c)
	c.AbortWithStatusJSON(statusCode, ErrorEnvelope{
		Error: APIError{
			Code:      code,
			Message:   message,
			RequestID: reqID,
			Details:   details,
		},
	})
}

func BadRequest(c *gin.Context, message string, details ...interface{}) {
	var d interface{}
	if len(details) > 0 {
		d = details[0]
	}
	JSONError(c, http.StatusBadRequest, "VALIDATION_ERROR", message, d)
}

func Internal(c *gin.Context, message string) {
	InternalError(c, message)
}

func Unauthorized(c *gin.Context, message string) {
	if message == "" {
		message = "Authentication required. Please provide a valid session token."
	}
	JSONError(c, http.StatusUnauthorized, "UNAUTHORIZED", message, nil)
}

func Forbidden(c *gin.Context, message string) {
	if message == "" {
		message = "Access denied. You do not have permission to perform this action."
	}
	JSONError(c, http.StatusForbidden, "FORBIDDEN", message, nil)
}

func NotFound(c *gin.Context, message string) {
	if message == "" {
		message = "The requested resource was not found."
	}
	JSONError(c, http.StatusNotFound, "NOT_FOUND", message, nil)
}

func Conflict(c *gin.Context, message string) {
	JSONError(c, http.StatusConflict, "CONFLICT", message, nil)
}

func RateLimited(c *gin.Context, message string) {
	if message == "" {
		message = "Too many requests. Please slow down and try again later."
	}
	JSONError(c, http.StatusTooManyRequests, "RATE_LIMIT_EXCEEDED", message, nil)
}

func ServiceUnavailable(c *gin.Context, message string) {
	if message == "" {
		message = "The requested service is temporarily unavailable."
	}
	JSONError(c, http.StatusServiceUnavailable, "SERVICE_UNAVAILABLE", message, nil)
}

func InternalError(c *gin.Context, message string) {
	if message == "" {
		message = "An unexpected error occurred. Please try again later."
	}
	// Never expose internal error stack traces or database errors to clients
	JSONError(c, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", message, nil)
}

func Success(c *gin.Context, statusCode int, data interface{}) {
	c.JSON(statusCode, data)
}
