# Invoicely Project Overview

## 1) Project Summary
Invoicely is a full-stack web application for creating export-ready invoices.

Current product flow:
- Public landing page
- Authentication (register/login)
- Protected 5-step invoice workflow
- Live invoice preview
- PDF export via browser print

Primary use case in current UI/content:
- Vegetable and chili export invoicing

## 2) High-Level Architecture
- Frontend: Multi-page HTML + CSS + Vanilla JavaScript
- Backend: Node.js + Express REST API
- Database: MongoDB via Mongoose
- Auth: JWT + bcrypt password hashing

Runtime model:
- Express serves frontend static files from project root
- Same Express app also exposes API endpoints under /api/*
- Frontend calls API endpoints for auth
- Invoice form state is stored in browser localStorage

## 3) Tech Stack (Major)
### Frontend
- HTML5 pages under pages/
- Global and modular CSS under style.css and styles/
- Vanilla JavaScript under scripts/
- Google Fonts (Montserrat)

### Backend
- Node.js (CommonJS)
- Express 5
- Mongoose + MongoDB
- bcryptjs for password hashing
- jsonwebtoken for access tokens
- dotenv for environment config

### Dev Tooling
- nodemon for local development server reload

## 4) Repository Structure (Important Parts)
- index.html: Landing page
- pages/: Login/Register + invoice workflow pages
- scripts/: Frontend behavior and state handling
- styles/: Shared + page-specific styles
- assets/: Logos and static images
- src/index.js: Express app entrypoint
- src/config/db.Connect.js: MongoDB connection
- src/controllers/authController.js: register/login logic
- src/middlewares/authMiddleware.js: JWT verification
- src/middlewares/roleMiddleware.js: RBAC checks
- src/models/userModel.js: User schema
- src/routes/authRoutes.js: auth API routes
- src/routes/userRoutes.js: protected API routes

## 5) Integration Overview
### 5.1 Static Frontend + API Integration
- Express serves static files from project root:
  - app.use(express.static(path.resolve(__dirname, '..')))
- API routes are mounted:
  - /api/auth
  - /api/user

Result:
- Frontend and backend can run same-origin in local development.

### 5.2 Authentication Integration
Frontend:
- scripts/auth.js posts to:
  - POST /api/auth/register
  - POST /api/auth/login
- Stores JWT in localStorage or sessionStorage (remember me behavior)
- Redirects after login to stored target or invoice step page

Backend:
- authController.register hashes password with bcrypt
- authController.login verifies credentials and returns JWT
- JWT payload includes user id and role, expires in 1 hour

### 5.3 Route Protection Integration
Frontend:
- scripts/route-guard.js checks token presence/expiry on protected pages
- Redirects unauthenticated users to landing page
- Stores intended destination in sessionStorage for post-login redirect

Backend:
- verifyToken middleware validates Bearer token
- authorizeRoles middleware enforces role-based access

### 5.4 RBAC Integration
Protected sample routes:
- GET /api/user/admin -> admin only
- GET /api/user/user -> user and admin

### 5.5 Database Integration
- MongoDB connection via CONNECTION_STRING in db.Connect.js
- User schema includes:
  - username (unique)
  - password (hashed)
  - role (admin | user)
- toJSON strips password from user objects

### 5.6 Invoice Data Integration (Frontend State)
- scripts/state.js manages invoice form data in localStorage key: invoicely
- Data includes sender/receiver details, invoice metadata, items, tax, payment details, logo data
- Shared renderPreview() keeps right-side preview in sync across steps

Note:
- Invoice content is currently client-side state based (not persisted to backend DB).

### 5.7 Logo Integration
- Default logo is now sourced from assets/logoPM.jpeg
- Users can upload custom logo in invoice details
- Uploaded logo is stored as Data URL in localStorage and overrides default for preview

### 5.8 PDF Export Integration
- Export uses browser print flow:
  - exportPDF() => window.print()
- Print styles hide form/nav and focus on invoice preview document

## 6) API Surface (Current)
### Auth
- POST /api/auth/register
  - body: username, password, role
- POST /api/auth/login
  - body: username, password
  - response: token

### Protected User Routes
- GET /api/user/admin (requires admin role)
- GET /api/user/user (requires user or admin role)

## 7) Environment Variables
Required for backend:
- CONNECTION_STRING: MongoDB connection URI
- JWT_SECRET: secret key for token signing
- PORT: optional (default in server is 7002)

## 8) Run and Development
- Install dependencies: npm install
- Start dev server: npm run dev
- Default app server port fallback: 7002

## 9) Current Integration Notes
- scripts/auth.js has a file:// fallback API URL using port 7001.
- src/index.js default server port is 7002.

Recommendation:
- Keep both frontend and API on same Express origin (preferred), or align fallback port in scripts/auth.js to 7002 to avoid mismatch when opened directly via file://.

## 10) Next Integration Milestones (Optional)
- Persist invoice records to backend and MongoDB
- Add CRUD endpoints for invoices
- Associate invoices with authenticated users
- Add invoice list/history and filters
- Add PDF server-side generation option if needed for automation
