# Quickest setup

## Option A — PostgreSQL with Docker (recommended)

1. Install Docker Desktop.
2. From this folder run:

```bash
docker compose up -d
```

3. Backend:

```bash
cd backend
mvn spring-boot:run
```

4. Frontend, in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Option B — Local PostgreSQL

Create a database named `bloodbank`, set your credentials in
`backend/src/main/resources/application.properties`, then run the backend and frontend as above.
