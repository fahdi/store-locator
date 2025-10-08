# BlueSky Store Locator & Management System

A comprehensive web application for managing malls and stores in Doha, Qatar, featuring role-based authentication, interactive maps, and CRUD operations based on user permissions.

## 🚀 Project Overview

This is a take-home technical assessment project that demonstrates modern web development skills including React, TypeScript, map integration, and role-based access control.

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
- **Map Library**: Cesium (preferred) or Leaflet
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
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript interfaces
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Express backend
│   ├── data/               # JSON data files
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── authServer.js       # Main server file
├── tests/                  # Test files
├── docs/                   # Documentation
│   ├── PRD.md             # Product Requirements Document
│   └── initial-requirements.md
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

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install express cors jsonwebtoken
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Start the development servers**
   ```bash
   # Terminal 1: Start backend server
   cd server
   node authServer.js
   # Server runs on http://localhost:5000
   
   # Terminal 2: Start frontend development server
   cd client
   npm run dev
   # Client runs on http://localhost:5173
   ```

4. **Access the application**
   - Open http://localhost:5173 in your browser
   - Use the login credentials above to test different roles

## 🔧 Development Status

### ✅ Completed
- [x] Project repository setup
- [x] Product Requirements Document (PRD)
- [x] GitHub project and issue tracking
- [x] Initial project structure planning

### 🚧 In Progress
- [ ] Project foundation setup (Phase 1)
- [ ] Authentication system (Phase 2)
- [ ] Map integration (Phase 3)
- [ ] Data display components (Phase 4)
- [ ] Role-based features (Phase 5)
- [ ] UI/UX polish (Phase 6)
- [ ] Testing & documentation (Phase 7)

## 📋 Development Phases

| Phase | Description | Status | Estimated Time |
|-------|-------------|--------|----------------|
| **Phase 1** | Foundation Setup | 🔄 In Progress | 4-6 hours |
| **Phase 2** | Authentication System | ⏳ Pending | 3-4 hours |
| **Phase 3** | Map Integration | ⏳ Pending | 4-5 hours |
| **Phase 4** | Data Display | ⏳ Pending | 3-4 hours |
| **Phase 5** | Role-Based Features | ⏳ Pending | 5-6 hours |
| **Phase 6** | UI/UX Polish | ⏳ Pending | 4-5 hours |
| **Phase 7** | Testing & Documentation | ⏳ Pending | 3-4 hours |

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

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/login` | Any | Authenticate user and return JWT |
| GET | `/api/malls` | All | Get list of malls and stores |
| PATCH | `/api/malls/:id/toggle` | Admin | Toggle mall open/close |
| PATCH | `/api/malls/:mallId/stores/:storeId/toggle` | Manager | Toggle store open/close |
| PUT | `/api/malls/:mallId/stores/:storeId` | Store | Update store details |

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

**Project Status**: 🚧 In Development  
**Last Updated**: December 2024  
**Next Milestone**: Complete Phase 1 - Foundation Setup