# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BlueSky Store Locator & Management System - A React/Express web application for managing malls and stores in Doha, Qatar with role-based authentication and interactive mapping.

## Development Environment

### Essential Commands

```bash
# Project setup
npm run install:all           # Install dependencies across all workspaces
npm run dev                   # Start both client (5173) and server (5000) concurrently
npm run dev:client            # Start only React/Vite dev server
npm run dev:server            # Start only Express server with nodemon

# Build and testing
npm run build                 # Build client for production
npm run test                  # Run all tests (client and server)
npm run test:client           # Run Vitest tests
npm run validate-data         # Run TypeScript data validation utility
npm run lint                  # Run ESLint on client code

# Utility commands
npm run clean                 # Remove all node_modules and build artifacts
npm run setup                 # Alias for install:all
```

## Architecture Overview

### Monorepo Structure

**Workspace Organization:**
- `/client/` - React frontend (Vite + TypeScript + Tailwind)
- `/server/` - Express backend (JWT auth + file-based storage)
- `/src/data/` - Shared data files (malls.json)
- `/src/utils/` - Shared utilities (spatial calculations, validation)
- `/scripts/` - Development utilities
- `/docs/` - Project documentation (PRD, requirements)

### Backend Architecture

**Authentication System:**
- JWT-based with 3 roles: `admin`, `manager`, `store`
- Simple credentials: admin/a, manager/m, store/s
- 2-hour token expiration
- Role-based middleware for API protection

**API Endpoints & Permissions:**
- `POST /api/login` - Authentication (any)
- `GET /api/malls` - Fetch data (authenticated)
- `PATCH /api/malls/:id/toggle` - Mall status (admin only)
- `PATCH /api/malls/:mallId/stores/:storeId/toggle` - Store status (manager only)
- `PUT /api/malls/:mallId/stores/:storeId` - Store details (store only)

**Data Storage:**
- In-memory with file persistence (`server/data/malls.json`)
- Changes written synchronously with `fs.writeFileSync`
- Cascading operations: Mall closure affects all nested stores

### Frontend Architecture

**Tech Stack:**
- React 18 + TypeScript (strict mode)
- Vite for build tooling
- Tailwind CSS for styling
- Leaflet for interactive maps
- React Hook Form + Zod for validation
- Axios for HTTP client
- React Context for state management

**Key Patterns:**
- Role-based UI rendering (hide/disable features by user role)
- Optimistic updates with rollback on API failure
- Map-centered design (full-screen with overlays)

## Geographic Data Management

**Coordinate System:**
- Qatar-specific validation (lat: 24.5-26.0, lon: 50.5-52.0)
- Doha center: 25.2854° N, 51.5310° E
- Haversine formula for distance calculations in `spatial-utils.ts`

**Data Validation:**
- Required fields: name, coordinates, opening_hours
- Duplicate ID detection
- Swapped lat/lng detection
- Run `npm run validate-data` before data changes

## Role-Based Access Control (RBAC)

**Permission Matrix:**
- **Admin**: Toggle entire malls (cascades to all stores)
- **Manager**: Toggle individual stores (cannot open if mall closed)
- **Store**: Edit store details (name, hours, description)

**Implementation:**
- Backend: JWT middleware validates role for each endpoint
- Frontend: Conditional rendering based on user.role
- Cascading logic: Mall status overrides store status

## Development Workflow

**Client Development:**
- Uses Vite for hot module replacement
- TypeScript strict mode enabled
- Tailwind JIT compilation
- Map integration with react-leaflet

**Server Development:**
- Nodemon for auto-restart
- ES modules throughout
- CORS enabled for cross-origin requests
- JWT secret: "demo-secret-key" (development only)

**Testing:**
- Vitest for unit tests
- Focus on spatial utilities and data validation
- Geographic test cases for Doha coordinates

## Data Models

**Core Entities:**
```typescript
interface Mall {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  stores: Store[];
}

interface Store {
  id: number;
  name: string;
  type: string;
  isOpen: boolean;
  opening_hours: string;
}
```

**Authentication:**
```typescript
interface User {
  username: string;
  role: 'admin' | 'manager' | 'store';
}
```

## Important Implementation Notes

- **Map Library**: Leaflet chosen over Cesium for simplicity and faster implementation
- **State Management**: React Context preferred over Redux for this scope
- **Styling**: Tailwind CSS for rapid "2030-era" modern design
- **Authentication**: Simple mock system suitable for demo/assessment
- **Data Persistence**: File-based for development; easily replaceable with database
- **Error Handling**: Toast notifications for user feedback
- **Responsive Design**: Mobile-first with touch-friendly controls

## Project Context

This is a technical assessment project with a focus on demonstrating modern web development skills, role-based security, and geographic data visualization. The implementation prioritizes clean architecture, type safety, and user experience over complex enterprise features.