# Changelog

All notable changes to the BlueSky Store Locator & Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### In Progress
- Phase 3: Interactive map integration using Leaflet
- Mall and store markers with geographic positioning
- Responsive map design for mobile devices

### Planned
- Phase 4: Data display components with modal interactions
- Phase 5: Role-based CRUD operations 
- Phase 6: UI/UX polish and responsive design enhancements
- Phase 7: Final testing and deployment preparation

---

## [0.4.0] - 2025-10-08

### Added - Phase 2: Authentication System Complete
- **Complete Authentication Flow**: Login page with React Hook Form + Zod validation
- **AuthContext**: Centralized authentication state management with localStorage persistence
- **Protected Routes**: Role-based access control with automatic redirects
- **JWT Token Management**: Secure storage, API injection, and expiration handling
- **Role-Based Dashboard**: Admin/Manager/Store specific UI with capabilities overview
- **Test-Driven Development**: Comprehensive TDD methodology and test suite
  - useAuth hook tests with authentication state management
  - LoginPage component tests with user interactions and API integration
  - ProtectedRoute tests with access control and role restrictions
  - DashboardPage tests with role-specific rendering
  - API service tests with proper mocking and error handling
- **Quality Assurance**: Zero ESLint warnings, TypeScript strict mode compliance
- **User Experience**: Toast notifications, loading states, responsive design
- **Documentation**: TDD requirements established in CLAUDE.md

### Changed
- App.tsx: Complete routing implementation with React Router v6
- API service: Updated with proper TypeScript types and error handling
- Project status: Phase 2 marked complete, ready for Phase 3

### Technical Details
- **Dependencies Added**: react-router-dom, react-hook-form, zod, react-hot-toast, @testing-library/*, vitest coverage
- **Test Coverage**: 48 tests across 5 test suites covering authentication system
- **Code Quality**: ESLint clean, TypeScript strict mode, comprehensive error handling
- **Authentication Roles**: Admin (mall toggle), Manager (store toggle), Store (store edit)

---

## [0.3.0] - 2025-10-08

### Added
- Comprehensive project documentation
- Updated README with current project state and API documentation
- CHANGELOG.md for tracking project changes
- Enhanced API endpoint documentation with examples

### Changed
- Updated development status to reflect backend completion
- Improved quick start instructions
- Enhanced project structure documentation

---

## [0.2.0] - 2025-10-08

### Added
- Unified server architecture combining authentication and mock server functionality
- Complete server consolidation into `/server` directory
- Data validation utilities for mall and store data
- Spatial calculation utilities for geographic operations
- TypeScript configuration for server development
- Health check endpoint (`/api/health`)
- Comprehensive server utilities in `/server/utils/`

### Changed
- **BREAKING**: Moved all server-related code to `/server` directory
- **BREAKING**: Unified API now runs on single port (5001) instead of multiple ports
- Consolidated data storage to `/server/data/malls.json`
- Updated all package.json scripts to use consolidated structure
- Server now provides complete API with auth, mall management, and testing endpoints

### Removed
- `/api` directory (functionality moved to unified server)
- `/src` directory (moved to `/server`)
- `/scripts` directory (moved to `/server/utils`)
- Separate mock server on port 4001
- Duplicate data files and scattered utilities

### Fixed
- Server port conflicts (moved from 5000 to 5001 to avoid macOS AirPlay)
- Data path issues in validation and server scripts
- TypeScript execution issues for validation utilities

---

## [0.1.0] - 2025-10-08

### Added
- Initial project setup with monorepo structure
- Package.json files for root, client, and server workspaces
- Express.js server with JWT authentication
- Role-based access control (Admin, Manager, Store User)
- Mall and store data management API
- Basic authentication endpoints
- Mock server for testing purposes
- GitHub project setup with issues and milestones
- Comprehensive Product Requirements Document (PRD)
- Initial documentation and project structure

### Technical Stack
- **Backend**: Node.js + Express.js + JWT
- **Frontend**: React 18+ + TypeScript + Vite (planned)
- **Database**: In-memory JSON storage
- **Development**: ESLint, Prettier, Jest, Nodemon

### API Endpoints
- `POST /api/login` - User authentication
- `GET /api/malls` - Get all malls and stores
- `PATCH /api/malls/:id/toggle` - Toggle mall status (Admin only)
- `PATCH /api/malls/:mallId/stores/:storeId/toggle` - Toggle store status (Manager only)
- `PUT /api/malls/:mallId/stores/:storeId` - Update store details (Store only)

---

## Project Information

### User Roles & Credentials
- **Admin**: `admin` / `a` - Toggle entire malls (cascades to all stores)
- **Manager**: `manager` / `m` - Toggle individual stores
- **Store User**: `store` / `s` - Edit store details

### Repository
- **GitHub**: https://github.com/fahdi/store-locator
- **Issues**: https://github.com/fahdi/store-locator/issues
- **Project Board**: https://github.com/users/fahdi/projects/15

### Development Status
- **Backend**: ✅ Complete (Authentication, API, Data Management)
- **Frontend**: 🚧 Ready for implementation
- **Documentation**: ✅ Complete
- **Testing**: 🚧 In progress

---

## Notes

This project is a technical assessment demonstrating modern web development practices, role-based security, and geographic data management for a store locator system in Doha, Qatar.

For detailed technical specifications, see [docs/PRD.md](./docs/PRD.md).