# COMP3123 Assignment 2

Full-stack employee manager built with React, Node.js/Express, MongoDB, and Docker Compose.

## Tech Stack

- **Frontend:** React 19, Vite, Material UI, TanStack Query, Axios, React Router DOM
- **Backend:** Node.js 20, Express, Mongoose, Multer, JWT, bcrypt, express-validator
- **Database:** MongoDB 7
- **DevOps:** Docker Compose, multi-stage Dockerfiles for frontend and backend

## Directory Structure

```
101485572_comp3123_assignment2/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── server.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       └── routes/
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── .env
    └── src/
        ├── App.jsx
        ├── layouts/
        ├── pages/
        ├── components/
        ├── services/
        └── theme/
```

## Dummy Credentials

```
Email: demo@gbc.ca
Password: Password123!
```

Create this user via the signup screen or directly with `POST /api/auth/signup`, then log in to test protected features.

## How to Run

### Requirements

- Docker Desktop (or Docker Engine + Docker Compose V2)

### Start the stack

```bash
docker compose up -d --build
```

This command builds both Dockerfiles and starts four services:
- `mongodb` (MongoDB database)
- `mongo-express` (optional UI at http://localhost:8081)
- `backend` (Express API exposed on http://localhost:5001)
- `frontend` (React app served on http://localhost:3000)

To follow logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

Shut down everything:

```bash
docker compose down
```

## Access Points

- **Frontend:** http://localhost:3000
- **Backend base URL:** http://localhost:5001/api
- **Health check:** http://localhost:5001/health
- **Static uploads:** http://localhost:5001/uploads/<filename>

## Backend API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Create a new user (`name`, `email`, `password`) | No |
| POST | `/api/auth/login` | Obtain JWT (`email`, `password`) | No |
| GET | `/api/auth/me` | Current user info | Bearer |
| POST | `/api/employees` | Create employee (multipart: data + `picture`) | Bearer |
| GET | `/api/employees` | List all employees | Bearer |
| GET | `/api/employees/search` | Query by `name`, `department`, `position` | Bearer |
| GET | `/api/employees/:id` | Fetch employee by ID | Bearer |
| PUT | `/api/employees/:id` | Update employee (supports new `picture`) | Bearer |
| DELETE | `/api/employees/:id` | Remove employee | Bearer |

Every protected request must include `Authorization: Bearer <token>` using the token returned from `POST /api/auth/login`.

## Docker Notes

- The backend container receives env vars from `backend/.env`. Update `CLIENT_ORIGIN` if you expose the frontend elsewhere.
- The frontend container builds the Vite project in a multi-stage Dockerfile and serves the static bundle with `serve`.
- Uploaded photos are stored inside the backend container under `/app/uploads` and exposed via `/uploads/<filename>`.

## Postman Testing Tips

1. Create a collection with the endpoints listed above.
2. Use collection-level variables for `baseUrl = http://localhost:5001/api` and `token`.
3. After login, set `token` to the returned JWT and define `Authorization: Bearer {{token}}` as a collection header.
4. For `POST`/`PUT /api/employees`, set the body type to `form-data`, send text fields as key/value pairs, and attach a file under `picture`.

## Common Commands

```bash
# Install dependencies locally (optional)
cd backend && npm install
cd frontend && npm install

# Run backend without Docker (requires local Mongo)
cd backend && npm run dev

# Run frontend dev server
cd frontend && npm run dev   # http://localhost:5173
```

All application requirements (auth, CRUD, search, uploads, responsive UI, session handling, and Docker deployment) are implemented and test-ready.
