.PHONY: dev build start lint clean install test format prepare

# Default target
all: install build

# Install dependencies
install:
	npm install

# Run development server
dev:
	npm run dev

# Build the project
build:
	npm run build

# Start production server
start:
	npm run start

# Run linting
lint:
	npm run lint

# Run tests
test: lint
	npm run test

# Clean build artifacts and dependencies
clean:
	rm -rf .next
	rm -rf node_modules
	rm -rf coverage

# Format the project
format:
	npm run format

# Prepare the project
prepare:
	npm run prepare

# Show help
help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make dev      - Start development server"
	@echo "  make build    - Build the project"
	@echo "  make start    - Start production server"
	@echo "  make lint     - Run linting"
	@echo "  make test     - Run tests"
	@echo "  make clean    - Clean build artifacts and dependencies"
	@echo "  make format   - Format the project"
	@echo "  make prepare  - Prepare the project" 