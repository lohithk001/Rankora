# ==============================================================================
# Multi-Stage Production Dockerfile for Rankora Go Backend
# ==============================================================================

# -----------------------------
# Stage 1: Build
# -----------------------------
FROM golang:1.24-alpine AS builder

WORKDIR /src

# Install required build tools and CA certificates
RUN apk add --no-cache git ca-certificates tzdata

# Leverage Docker layer caching for dependencies
COPY go.mod go.sum ./
RUN go mod download && go mod verify

# Copy application source
COPY . .

# Build statically-linked stripped production binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -trimpath \
    -ldflags="-s -w -extldflags '-static'" \
    -o /bin/rankora-api ./cmd/api

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -trimpath \
    -ldflags="-s -w -extldflags '-static'" \
    -o /bin/rankora-migrate ./cmd/migrate

# -----------------------------
# Stage 2: Minimal Runtime
# -----------------------------
FROM alpine:3.20 AS runner

# Create dedicated non-root service user
RUN addgroup -g 10001 -S rankora && \
    adduser -u 10001 -S rankora -G rankora

# Install CA certificates and tzdata for TLS and timestamps
RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

# Copy compiled binaries and database migrations
COPY --from=builder /bin/rankora-api /app/api
COPY --from=builder /bin/rankora-migrate /app/migrate
COPY --from=builder /src/migrations /app/migrations

# Set proper ownership
RUN chown -R rankora:rankora /app

USER rankora:rankora

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/health/live || exit 1

ENTRYPOINT ["/app/api"]
