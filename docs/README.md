# Architecture

## Client (Frontend)

- **Framework**: React 19 with Vite
- **Styling**: TailwindCSS + Custom CSS
- **Routing**: React Router DOM v7
- **Icons**: Lucide React, React Icons

### Key Directories
- `src/pages/` — Page-level components (Home, Login, PatientDashboard, AdminSignup)
- `src/components/` — Reusable components organized by feature
- `src/styles/` — All CSS stylesheets, organized by component group
- `src/data/` — Mock data and constants

## Server (Backend)

- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: validator.js

### Key Directories
- `controllers/` — Request handlers
- `routes/` — API route definitions
- `models/` — Mongoose schemas
- `middleware/` — Auth middleware (user + admin)
- `config/` — Database connection configuration
