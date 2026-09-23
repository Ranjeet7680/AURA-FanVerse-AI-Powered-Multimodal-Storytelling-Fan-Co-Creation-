# ==============================================================================
# Multi-Stage Production Dockerfile for AURA FanVerse
# Builds React 19 Frontend + FastAPI Enterprise Backend
# Published to GitHub Container Registry (ghcr.io/ranjeet7680/aura-fanverse)
# ==============================================================================

# Stage 1: Build React 19 Client
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY prototype/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY prototype/ ./
RUN npm run build

# Stage 2: Python 3.11 Enterprise FastAPI Runtime
FROM python:3.11-slim AS runner

LABEL org.opencontainers.image.title="AURA FanVerse"
LABEL org.opencontainers.image.description="AI-Powered Multimodal Storytelling & Fan Co-Creation Platform"
LABEL org.opencontainers.image.source="https://github.com/Ranjeet7680/AURA-FanVerse-AI-Powered-Multimodal-Storytelling-Fan-Co-Creation-"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.version="5.2.0"

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY server/ ./server/

# Copy built frontend assets from stage 1
COPY --from=frontend-builder /app/frontend/dist ./server/static/

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

WORKDIR /app/server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
