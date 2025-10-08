# BlueSky Store Locator & Management System

A comprehensive web application for managing malls and stores in Doha, Qatar, featuring role-based authentication, interactive maps, and CRUD operations based on user permissions.

## 🚀 Project Overview

This is a take-home technical assessment project that demonstrates modern web development skills including React, TypeScript, map integration, and role-based access control.

## ⚡ Quick Start

```bash
# Clone and install
git clone https://github.com/fahdi/store-locator.git
cd store-locator
npm run install:all

# Start unified server (http://localhost:5001)
npm run start:server

# For development with hot reload
npm run dev:server
```

### Key Features
- **Interactive Map**: Full-screen map centered on Doha with mall and store markers
- **Role-Based Authentication**: Three user roles with different permissions
- **Real-time Updates**: Immediate UI updates for status changes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Sleek 2030-era design with smooth animations

## 👥 User Roles & Permissions

| Role | Username | Password | Capabilities |
|------|----------|----------|--------------|
| **Admin** | `admin` | `a` | Toggle entire malls open/close (affects all stores) |
| **Manager** | `manager` | `m` | Toggle individual stores open/close |
| **Store User** | `store` | `s` | Edit store details (name, hours, description) |

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Tailwind CSS
- **Map Library**: Leaflet + React-Leaflet ✅
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Validation**: React Hook Form
- **Notifications**: react-hot-toast

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **Data Storage**: In-memory (malls.json file)

### Development Tools
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest + React Testing Library
- **Version Control**: Git

## 📁 Project Structure

```
store-locator/
├── client/                 # React frontend application (planned)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript interfaces
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Unified Express backend
│   ├── index.js           # Main unified API server
│   ├── authServer.js      # Legacy auth server (reference)
│   ├── data/              # JSON data files
│   │   └── malls.json     # Mall and store data
│   ├── utils/             # Server utilities
│   │   ├── validate-data.js    # Data validation
│   │   ├── spatial-utils.ts    # Geographic calculations
│   │   └── spatial-utils.test.ts # Spatial tests
│   ├── package.json       # Server dependencies
│   └── tsconfig.json      # TypeScript configuration
├── docs/                  # Documentation
│   ├── PRD.md            # Product Requirements Document
│   └── initial-requirements.md
├── CHANGELOG.md          # Project change history
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fahdi/store-locator.git
   cd store-locator
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the unified server**
   ```bash
   # Production mode
   npm run start:server
   
   # Development mode (with hot reload)
   npm run dev:server
   ```

4. **Access the API**
   - **Server**: http://localhost:5001
   - **Health Check**: http://localhost:5001/api/health
   - **API Documentation**: See endpoints section below

### Available Scripts

```bash
# Server management
npm run start:server          # Start unified server
npm run dev:server           # Development mode with hot reload

# Data management  
npm run validate-data        # Validate mall and store data

# Development utilities
npm run install:all          # Install all dependencies
npm run clean               # Clean all node_modules
```

## 🔧 Development Status

### ✅ Completed
- **Phase 1: Project Foundation Setup** (100%)
  - Vite + React 18 + TypeScript with strict mode
  - Tailwind CSS with custom theme and animations  
  - ESLint + Prettier + Vitest testing environment
  - Complete project structure and build pipeline

- **Phase 2: Authentication System** (100%)
  - JWT auth with role-based access control (Admin/Manager/Store)
  - Login page with React Hook Form + Zod validation
  - Protected routes and AuthContext state management
  - Dashboard with role-specific capabilities display
  - Comprehensive TDD implementation with 48+ tests

- **Backend Infrastructure** (100%)
  - Unified Express server with complete REST API
  - JWT authentication with role-based access control
  - Mall and store data management with validation
  - Spatial calculation utilities and health check endpoints

### 🔄 In Progress  
- **Phase 3: Map Integration** (70% Complete)
  - ✅ Interactive Leaflet map with Doha coordinates (25.2854°N, 51.5310°E)
  - ✅ Custom mall markers with status-based colors (green=open, red=closed)  
  - ✅ Public map access - no authentication required (map-first approach)
  - ✅ Interactive popups with mall details and store information
  - ✅ Fixed dark background styling + shadcn/ui theming system
  - ✅ Public API endpoint for unauthenticated access
  - 🔄 **Currently working on**: Store markers with individual status indicators (30% remaining)

### ⏳ Coming Next
- **Phase 4**: Data Display Components (modals, cards, details)
- **Phase 5**: Role-Based CRUD Operations (toggle states, edit forms)
- **Phase 6**: UI/UX Polish & Responsive Design
- **Phase 7**: Testing & Documentation

## 📋 Development Phases

| Phase | Description | Status | Time | Progress |
|-------|-------------|--------|------|----------|
| **Phase 1** | Foundation Setup | ✅ **Complete** | 6 hours | 100% |
| **Phase 2** | Authentication System + TDD | ✅ **Complete** | 5 hours | 100% |
| **Phase 3** | Map Integration | 🔄 **Next** | 4-5 hours | 0% |
| **Phase 4** | Data Display | ⏳ Pending | 3-4 hours | 0% |
| **Phase 5** | Role-Based Features | ⏳ Pending | 5-6 hours | 0% |
| **Phase 6** | UI/UX Polish | ⏳ Pending | 4-5 hours | 0% |
| **Phase 7** | Testing & Documentation | ⏳ Pending | 3-4 hours | 0% |

### 🎯 Current Focus: Phase 3 - Map Integration
**Next Tasks**: Leaflet setup, Doha map center, mall/store markers

## 🎯 Key Features to Implement

### Map Integration
- Interactive map centered on Doha, Qatar
- Mall and store markers with hover effects
- Click interactions for detail views
- Visual indicators for open/closed status

### Role-Based Functionality
- **Admin**: Toggle entire malls (cascades to all stores)
- **Manager**: Toggle individual stores
- **Store User**: Edit store information

### Data Management
- Real-time updates on status changes
- Form validation using provided utilities
- Error handling with user-friendly messages
- Loading states and optimistic updates

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run validation tests
npm run validate-data

# Run spatial utility tests
npm test spatial.test.ts
```

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/login` | Any | Authenticate user and return JWT |

**Request Body:**
```json
{
  "username": "admin",
  "password": "a"
}
```

### Mall Management  
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/malls` | All Authenticated | Get list of malls and stores |
| PATCH | `/api/malls/:id/toggle` | Admin | Toggle mall open/close (cascades to stores) |
| PATCH | `/api/malls/:mallId/stores/:storeId/toggle` | Manager | Toggle individual store open/close |
| PUT | `/api/malls/:mallId/stores/:storeId` | Store | Update store details |

### Testing & Utilities
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/stores` | None | Get flattened stores list (mock endpoint) |
| PATCH | `/api/stores/:id` | None | Update store with simulated delays/failures |
| GET | `/api/health` | None | Server health check and status |

## 🔗 Resources

### Provided Gist Files
- [Malls Data (malls.json)](https://gist.github.com/topazahmed/ea65717dfee7d8d6725f019957cab0e7)
- [Auth Server (authServer.js)](https://gist.github.com/topazahmed/fb5e226a906b87a29a8937db6c051d72)
- [Data Validation (validateData.ts)](https://gist.github.com/topazahmed/56d2896f0ad36eb2e00b286ab894afa5)
- [Spatial Utilities (spatial.ts)](https://gist.github.com/topazahmed/084b16b58d95efa136a86c89aae567b5)
- [Spatial Tests (spatial.test.ts)](https://gist.github.com/topazahmed/0b46475d01c19fb8d8b9404f856c0959)

### Documentation
- [Product Requirements Document (PRD)](./docs/PRD.md)
- [Initial Requirements](./docs/initial-requirements.md)

## 🎨 Design Goals

- **Modern UI**: Sleek 2030-era design with glass morphism effects
- **Responsive**: Functional on all device sizes
- **Accessible**: WCAG AA compliance
- **Performance**: 60fps animations, <3s load time
- **User Experience**: Intuitive navigation and clear feedback

## 🚀 Deployment (Optional)

The application can be deployed to:
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Railway, Render, or Heroku

## 📝 Contributing

This is a technical assessment project. For development:

1. Follow the phase-based approach outlined in the PRD
2. Create feature branches for each phase
3. Write tests for new functionality
4. Update documentation as needed
5. Ensure TypeScript strict mode compliance

## 📄 License

This project is part of a technical assessment and is not intended for commercial use.

## 📞 Contact

For questions about this project, please refer to the PRD or create an issue in the repository.

---

**Project Status**: 🚧 Backend Complete - Frontend Development Ready  
**Last Updated**: October 2025  
**Next Milestone**: React Frontend Implementation  
**Current Version**: See [CHANGELOG.md](./CHANGELOG.md) for detailed changes