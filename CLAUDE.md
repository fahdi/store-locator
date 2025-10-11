# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BlueSky Store Locator & Management System - A comprehensive web application for managing malls and stores in Doha, Qatar, featuring role-based authentication, interactive maps, and CRUD operations based on user permissions.

**Current Status**: 🌐 **LIVE IN PRODUCTION** - Deployed at https://bluesky-store-locator.up.railway.app with all features complete

## Development Environment

### Essential Commands

```bash
# Docker deployment (recommended for production)
docker-compose up --build    # Start containerized app on port 5001
docker build -t bluesky-store-locator .  # Build Docker image
docker run -p 5001:5001 bluesky-store-locator  # Run container

# Local development
PORT=5001 npm run start:server  # Start unified server (avoids port conflicts)
npm run dev:server           # Development mode with hot reload

# Project setup
npm run install:all          # Install dependencies across all workspaces
npm run clean               # Clean all node_modules

# Client build (required for unified server)
cd client && npm run build  # Build React app for production
cd client && npx vite build # Build without TypeScript checking (faster)

# Data management  
npm run validate-data       # Validate mall and store data integrity

# Development utilities
npm run dev:client          # Start React/Vite dev server (port 5173)
npm run test:client         # Run Vitest tests
npm run lint:client         # Run ESLint on client code
npm run typecheck:client    # TypeScript strict mode validation
```

## Architecture Overview

### Monorepo Structure

**Workspace Organization:**
- `/client/` - React frontend (Vite + TypeScript + Tailwind) - Complete with Docker build
- `/server/` - Unified Express backend (JWT auth + file-based storage) - Complete
  - `index.js` - Main unified API server combining auth and data endpoints
  - `data/malls.json` - Mall and store data with Doha coordinates
  - `utils/` - Server utilities (validate-data.js, spatial-utils.ts)
- `/docs/` - Project documentation (PRD.md, initial-requirements.md)
- `docs/TODOS.md` - Comprehensive task tracking for all development phases
- `CHANGELOG.md` - Project change history and version tracking
- **Docker Files (NEW):**
  - `Dockerfile` - Multi-stage build for production deployment
  - `docker-compose.yml` - Container orchestration configuration
  - `.dockerignore` - Build context optimization

## Docker Implementation (NEW)

### Container Architecture
- **Multi-stage Build**: React client build → Production server image
- **Base Image**: Node.js 18 Alpine (~200MB total)
- **Security**: Non-root user (bluesky:nodejs)
- **Health Monitoring**: Built-in health checks every 30s
- **Port Configuration**: Port 5001 (avoids macOS AirPlay conflicts on port 5000)

### Key Docker Features
- **Unified Server**: Single container serves both React frontend and Express API
- **CORS Resolution**: Same-origin architecture eliminates cross-origin issues
- **Static File Serving**: Express serves built React files from `/client/dist`
- **API Routing**: Express endpoints on `/api/*` paths
- **Catch-all Routing**: React Router handles client-side navigation

### Docker Development Workflow
```bash
# Build and run with Docker Compose
docker-compose up --build

# Manual Docker commands
docker build -t bluesky-store-locator .
docker run -p 5001:5001 bluesky-store-locator

# Health check
curl http://localhost:5001/api/health
```

### Production Optimizations
- **TypeScript Config**: `client/tsconfig.prod.json` for relaxed production builds
- **Build Process**: `npx vite build` skips strict type checking for faster deployment
- **API Base URL**: Relative paths (`''`) for same-origin requests
- **Data Persistence**: Optional volume mounting for mall data

### Backend Architecture

**Authentication System (COMPLETE):**
- JWT-based with 3 roles: `admin`, `manager`, `store`
- Demo credentials: admin/a, manager/m, store/s
- 2-hour token expiration with proper validation
- Role-based middleware protecting all API endpoints

**API Endpoints & Permissions (COMPLETE):**
- `POST /api/login` - User authentication (returns JWT)
- `GET /api/malls` - Fetch mall/store data (authenticated users)
- `PATCH /api/malls/:id/toggle` - Toggle mall open/close (admin only)
- `PATCH /api/malls/:mallId/stores/:storeId/toggle` - Toggle store status (manager only)
- `PUT /api/malls/:mallId/stores/:storeId` - Update store details (store role only)
- `GET /api/health` - Server health check and status
- `GET /api/stores` - Mock endpoint for testing purposes

**Data Storage (COMPLETE):**
- In-memory with file persistence (`server/data/malls.json`)
- Atomic writes with error handling using `fs.writeFileSync`
- Cascading operations: Mall closure/opening affects all nested stores
- Data validation utilities ensure geographic coordinate integrity

### Frontend Architecture (Foundation Ready)

**Tech Stack (COMPLETE):**
- React 18 + TypeScript (strict mode) ✅
- Vite for build tooling with HMR ✅
- Tailwind CSS for modern styling ✅
- ESLint + Prettier + strict TypeScript ✅
- Vitest for testing framework ✅
- React Router v6 for navigation ✅
- Leaflet for interactive maps ✅
- React Hook Form + form validation ✅
- Axios HTTP client with interceptors ✅
- React Context for auth state management ✅

**Planned Key Patterns (Phase 2+):**
- Role-based UI rendering (hide/disable features by user role)
- Protected routes with authentication guards
- Optimistic updates with rollback on API failure
- Map-centered design (full-screen with overlays)
- Toast notifications for user feedback
- Responsive design with mobile-first approach

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

### Current Development Status

**Phase 1: Foundation Setup (✅ COMPLETE)**
- Project structure and monorepo setup ✅
- Backend unified server architecture ✅  
- Frontend React + TypeScript + Vite setup ✅
- Development tooling (ESLint, Prettier, Vitest) ✅
- Documentation and task tracking ✅

**Phase 2: Authentication System (✅ COMPLETE)**
- Login page UI with form validation ✅
- AuthContext for state management ✅
- Protected route components ✅
- JWT token management ✅

**Phase 3: Map Integration (✅ COMPLETE)**
- Install and configure Leaflet + React-Leaflet ✅
- Center map on Doha coordinates ✅
- Create mall and store markers ✅
- Implement marker interactions ✅
- Interactive hover effects and DetailModal ✅
- Mobile-responsive design ✅

**Phase 4: Data Display Components (✅ COMPLETE)**
- Enhanced DetailModal with advanced features ✅
- Real-time data updates and API integration ✅
- Search and filter functionality ✅
- Loading states and error handling ✅
- Mobile-responsive design ✅

**Phase 5: Dashboard Implementations (✅ COMPLETE)**
- Admin Dashboard with mall management ✅
- Manager Dashboard with store management ✅
- Activity tracking system with server persistence ✅
- Professional UI with error handling ✅
- Role-based functionality enforcement ✅

**Client Development (Foundation Ready):**
- Vite with HMR and TypeScript strict mode ✅
- Tailwind CSS with modern design system ✅
- ESLint + Prettier for code quality ✅
- Vitest testing environment ✅
- React Router for protected routes (ready)

**Server Development (COMPLETE):**
- Unified Express server on port 5001 ✅
- JWT authentication with role-based access ✅
- CORS enabled for cross-origin requests ✅
- File-based data persistence with validation ✅
- Comprehensive API endpoints for all operations ✅

**Testing Infrastructure:**
- Vitest for React component and utility testing ✅
- Spatial utilities with geographic test cases ✅
- Data validation testing for mall/store integrity ✅

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

### Technical Decisions Made
- **Port Configuration**: Server on 5001 (avoiding macOS AirPlay conflict with 5000)
- **Map Library**: Leaflet planned over Cesium for simplicity and faster implementation
- **State Management**: React Context preferred over Redux for this project scope
- **Styling**: Tailwind CSS for rapid "2030-era" modern design
- **Authentication**: JWT-based demo system suitable for assessment context
- **Data Persistence**: File-based JSON storage; easily replaceable with database
- **Error Handling**: Toast notifications planned for user feedback
- **Responsive Design**: Mobile-first approach with touch-friendly controls

### Development Standards
- **TypeScript**: Strict mode enforced across all code
- **Code Quality**: ESLint + Prettier with zero warnings policy
- **Testing**: Comprehensive test coverage for utilities and spatial calculations
- **Test-Driven Development (TDD)**: MANDATORY for all new features and components
- **Documentation**: Transparent AI-assisted development approach
- **Git Workflow**: Feature branches with descriptive commit messages

### Test-Driven Development (TDD) Requirements
**MANDATORY RULE**: All new features, components, and functionality MUST follow TDD approach:

1. **Write Tests First**: Before implementing any new feature or component:
   - Write failing tests that describe the expected behavior
   - Define test cases for happy path, edge cases, and error scenarios
   - Use Vitest for React components and utility functions
   - Create comprehensive test suites for API endpoints

2. **Implementation Cycle**:
   - 🔴 **Red**: Write a failing test
   - 🟢 **Green**: Write minimal code to make the test pass
   - 🔄 **Refactor**: Clean up code while keeping tests passing
   - Repeat for each piece of functionality

3. **Test Coverage Requirements**:
   - **Components**: Test rendering, user interactions, props, and state changes
   - **Hooks**: Test all return values, side effects, and edge cases
   - **API Services**: Test all endpoints, error handling, and response parsing
   - **Utilities**: Test all functions with various inputs and edge cases
   - **Integration**: Test authentication flows, protected routes, and role-based access

4. **Testing Tools & Patterns**:
   - **Vitest** for unit and integration tests
   - **React Testing Library** for component testing
   - **MSW (Mock Service Worker)** for API mocking
   - **User-centric testing** focusing on behavior over implementation
   - **Accessibility testing** with screen readers and keyboard navigation

5. **Test Organization**:
   - Co-locate tests with components: `Component.test.tsx`
   - Separate test utilities in `src/test/` directory
   - Mock external dependencies and API calls
   - Use descriptive test names that explain the behavior

6. **Before Any PR**:
   - All tests must pass: `npm run test:client`
   - Achieve minimum 80% code coverage
   - Include tests for new functionality in commit messages
   - Review tests as part of code review process

**Example TDD Workflow for New Feature**:
```bash
# 1. Write failing test
touch src/components/NewFeature.test.tsx
# Write test cases for expected behavior

# 2. Run tests (should fail)
npm run test:client

# 3. Implement minimal code to pass tests
touch src/components/NewFeature.tsx
# Write just enough code to make tests pass

# 4. Refactor and improve while tests stay green
# 5. Add more test cases and repeat cycle
```

This TDD approach ensures:
- **Higher code quality** with fewer bugs
- **Better design** through test-first thinking
- **Confidence in refactoring** with comprehensive test coverage
- **Documentation** through test cases that explain expected behavior
- **Faster debugging** when tests pinpoint exact failures

## Project Context & Next Steps

This is a technical assessment project demonstrating modern web development skills, role-based security, and geographic data visualization. 

**Current Status**: 🎉 **COMPLETE & PRODUCTION READY** - All features implemented including dashboards, activity tracking, and Docker deployment.

**🎉 ALL PHASES COMPLETE**: Production Ready Application
- All 5 development phases successfully completed ✅
- Complete feature set with dashboard implementations ✅
- Activity tracking system with server persistence ✅
- Production-ready Docker deployment ✅
- Comprehensive documentation and testing ✅

The implementation prioritizes clean architecture, type safety, user experience, and transparent AI collaboration in the development process.