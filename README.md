# YourHealthCo

A full-stack healthcare management platform built with React (Vite) and Node.js (Express + MongoDB).

## Project Structure

```
healthcare/
├── client/          # React frontend (Vite + TailwindCSS)
├── server/          # Node.js backend (Express + Mongoose)
├── tests/           # Integration & Unit Tests (Jest + Supertest)
└── docs/            # Documentation & Postman Collection
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Local MongoDB or MongoDB Atlas instance

### Environment Setup

1. Copy `server/.env.example` to `server/.env` and fill in values:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/yourhealthco
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_ORIGIN=http://localhost:5173
   ```

2. Copy `client/.env.example` to `client/.env.local`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

### Installation

```bash
# Install dependencies across project
npm install
npm run install:all
```

### Running the App

```bash
# Start backend server
npm run server

# Start frontend dev server
npm run client
```

### Automated Tests & Verification

```bash
# Run backend Jest unit tests
npm test

# Build frontend production bundle
cd client && npm run build
```

### API Testing
Import `YourHealthCo_Postman_Collection.json` into Postman to execute tests against all backend API endpoints.
