# Changelog

All notable changes to the BlueSky Store Locator & Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- React frontend implementation with TypeScript
- Interactive map integration using Leaflet
- Role-based UI components
- Responsive design implementation
- Testing suite completion

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