# YourHealthCo

A full-stack healthcare management platform built with React (Vite) and Node.js (Express + MongoDB).

## Project Structure

```
healthcare/
├── client/          # React frontend (Vite + TailwindCSS)
├── server/          # Node.js backend (Express + Mongoose)
├── shared/          # Shared constants and utilities
└── docs/            # Documentation
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### Installation

```bash
# Install all dependencies
npm run install:all

# Or install individually
npm run install:client
npm run install:server
```

### Running the App

```bash
# Start the frontend dev server
npm run client

# Start the backend server
npm run server
```

### Environment Variables

**Client** (`client/.env.local`):
```
VITE_API_URL=http://localhost:3000
```

**Server** (`server/.env`):
```
SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri
PORT=3000
```