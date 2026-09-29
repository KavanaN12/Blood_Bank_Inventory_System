# Hemora — Hospital Blood Bank Inventory Management System

A full-stack real-world CRUD application built for the Spring Boot assessment.

## Architecture

React + Vite frontend
        ↓ REST/JSON
Spring Boot REST API
        ↓ Spring Data JPA
PostgreSQL

## Features

- Dashboard with total available units and batch counts
- Blood-group availability overview
- Create inventory batch
- View all batches
- View batch by ID
- Edit batch
- Delete batch
- Filter by blood group
- Filter by inventory status
- Search by batch number or storage location
- Automatic expired-status refresh
- Date validation
- Request validation
- REST exception handling
- Seed data for first startup

## Environment

- Java 17+
- Maven 3.9+
- Node.js 20+
- npm
- PostgreSQL 15+ (or current supported version)

## 1. Create database

Using psql:

```sql
CREATE DATABASE bloodbank;
```

Default backend configuration expects:

```text
host: localhost
port: 5432
database: bloodbank
username: postgres
password: postgres
```

If your PostgreSQL credentials differ, edit:
`backend/src/main/resources/application.properties`

## 2. Start backend

```bash
cd backend
mvn spring-boot:run
```

API:
`http://localhost:8080`

## 3. Start frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:
`http://localhost:5173`

## Main API endpoints

POST `/api/inventory`
GET `/api/inventory`
GET `/api/inventory/{id}`
PUT `/api/inventory/{id}`
DELETE `/api/inventory/{id}`
GET `/api/inventory/group/{bloodGroup}`
GET `/api/inventory/status/{status}`
GET `/api/inventory/dashboard`

## Sample POST

```json
{
  "batchNumber": "BB-2026-007",
  "bloodGroup": "O_NEGATIVE",
  "componentType": "RED_BLOOD_CELLS",
  "units": 6,
  "collectionDate": "2026-09-29",
  "expiryDate": "2026-10-24",
  "storageLocation": "Cold Room B",
  "status": "AVAILABLE"
}
```

## Notes for the assessment

The application intentionally keeps a clean Controller → Service → Repository structure so the Spring Boot questionnaire can be answered directly from the code. It also has realistic domain behavior such as expiry handling, stock aggregation, status filtering and validation.
