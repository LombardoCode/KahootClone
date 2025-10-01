.PHONY: dev stop clean help

# Help
help:
	@echo "========================================="
	@echo "  KahootClone - Development Only"
	@echo "========================================="
	@echo ""
	@echo "Commands:"
	@echo "  make dev     - Start development environment"
	@echo "  make stop    - Stop development environment"
	@echo "  make clean   - Clean all (containers, volumes, images)"
	@echo ""
	@echo "Note: For production deployment, use lomoro.dev's Makefile:"
	@echo "https://github.com/LombardoCode/lomoro.dev"
	@echo ""

# Start in development mode
dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Stop
stop:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Clean everything
clean:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v --rmi all
