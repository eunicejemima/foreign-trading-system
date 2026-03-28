# Foreign Trading System

A Spring Boot based foreign trading management application with JWT authentication, admin dashboard, and CRUD operations for users, trades, and currencies.

## Overview

This project provides a simple end-to-end trading admin workflow:
- Secure login with JWT token authentication
- Admin management of users
- Trade creation and maintenance
- Currency management
- Dashboard summary view
- Web UI served from Spring Boot static resources

## Key Features

- JWT based authentication and authorization
- Role protected admin APIs
- User management (list, update, activate/deactivate, delete)
- Trade management (list, create, update, delete)
- Currency management (list, create, update, delete)
- Summary endpoint for dashboard metrics
- Seed data initialization for admin, currencies, and sample trades
- Strategy pattern used for trade result calculation

## Tech Stack

- Java 17
- Spring Boot 4.0.4
- Spring Security
- Spring Data JPA (Hibernate)
- MySQL (configured primary database)
- Maven Wrapper
- HTML, CSS, JavaScript (static frontend)
- OpenAPI/Swagger UI

## Project Structure

- src/main/java/com/example/foreign_trading_system
  - config: Security and data initialization
  - controller: REST controllers
  - dto: request and response payloads
  - exception: custom exceptions
  - model: JPA entities
  - repository: Spring Data repositories
  - security: JWT utilities and filter
  - service: business logic and strategy classes
- src/main/resources
  - application.properties
  - static: frontend files

## Prerequisites

- Java 17 or later
- MySQL Server
- Maven (optional, wrapper included)

## Configuration

Update database settings in src/main/resources/application.properties if needed:

- spring.datasource.url
- spring.datasource.username
- spring.datasource.password
- server.port

Default configured server port: 8081

## Run the Project

Windows:

- .\mvnw spring-boot:run

macOS/Linux:

- ./mvnw spring-boot:run

Application URLs:

- UI: http://localhost:8081/
- Swagger UI: http://localhost:8081/swagger-ui/index.html

## Default Admin Login

The data initializer creates or updates an admin user on startup:

- Username: admin
- Password: admin123

## API Summary

Authentication:
- POST /api/auth/login
- POST /api/auth/users (admin only)

Admin:
- GET /api/admin/users
- PUT /api/admin/users/{id}
- PUT /api/admin/users/{id}/toggle
- DELETE /api/admin/users/{id}
- GET /api/admin/trades
- POST /api/admin/trades
- PUT /api/admin/trades/{id}
- DELETE /api/admin/trades/{id}
- GET /api/admin/currencies
- POST /api/admin/currencies
- PUT /api/admin/currencies/{id}
- DELETE /api/admin/currencies/{id}
- GET /api/admin/summary

## Build and Test

Build:

- .\mvnw clean compile

Run tests:

- .\mvnw test

## Notes

- Static frontend is available directly at the root path.
- JWT token is stored in browser local storage by the frontend script.
- Initial seed data includes sample currencies and trades for quick verification.

## Troubleshooting

- Port already in use: change server.port in application.properties.
- Database connection failed: verify MySQL is running and credentials are correct.
- 401/403 from admin APIs: login first and use an admin token.

## License

This project is for educational and learning purposes.
