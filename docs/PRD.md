# Product Requirements Document (PRD)
## BlueSky Store Locator & Management System

**Version:** 1.0  
**Date:** October 8, 2025  
**Project Type:** Take-Home Technical Assessment  
**Submission Deadline:** Wednesday Morning (October 9, 2025)  
**Progress Update:** Sunday Evening (October 6, 2025)

---

## 1. Executive Summary

### 1.1 Project Overview
Build a real-world Store Locator and Management System for malls and stores in Doha, Qatar. The application features role-based authentication, interactive maps, and CRUD operations based on user permissions.

### 1.2 Business Objectives
- Demonstrate ability to design and build modern web applications
- Showcase proficiency with React, TypeScript, and map integrations
- Display understanding of role-based access control (RBAC)
- Prove capability to work with modern UI/UX patterns
- Show ability to write clean, maintainable, and tested code

### 1.3 Success Criteria
- All three user roles function correctly with appropriate permissions
- Interactive map displays all malls and stores accurately
- Responsive design works on desktop and mobile
- Data validation prevents invalid operations
- Application has a modern, sleek "2030-era" design
- Code is well-structured with TypeScript type safety
- Deployment is optional but impressive

---

## 2. User Personas & Roles

### 2.1 Admin User
**Username:** `admin` | **Password:** `a`

**Capabilities:**
- View all malls and stores on map
- Toggle entire malls open/close (affects all stores within)
- View mall and store details
- Cannot edit individual store details

**Use Case:**
"As an Admin, I need to close an entire mall for maintenance, which should automatically close all stores within that mall."

### 2.2 Manager User
**Username:** `manager` | **Password:** `m`

**Capabilities:**
- View all malls and stores on map
- Toggle individual stores open/close
- View mall and store details
- Cannot edit store information
- Cannot toggle entire malls

**Use Case:**
"As a Manager, I need to close a specific store that's undergoing renovations while keeping other stores in the mall open."

### 2.3 Store User
**Username:** `store` | **Password:** `s`

**Capabilities:**
- View all malls and stores on map
- Edit store details (name, opening hours, description, etc.)
- View mall and store details
- Cannot toggle store or mall open/close status

**Use Case:**
"As a Store Owner, I need to update my store's opening hours and description for the holiday season."

### 2.4 Unauthenticated User
**Capabilities:**
- Access only to login page
- No access to application features

---

## 3. Technical Requirements

### 3.1 Tech Stack (Required)

#### Frontend
- **Framework:** React 18+
- **Language:** TypeScript (preferred) or JavaScript
- **Build Tool:** Vite (recommended) or Create React App
- **UI Library:** Choose one:
  - Tailwind CSS (recommended for speed)
  - Material UI
  - Bootstrap
  - Custom SCSS
- **Map Library:** Choose one (in order of preference):
  1. Cesium (3D maps - preferred by BlueSky)
  2. Leaflet (simpler, 2D)
  3. Mapbox (feature-rich)
- **Charts Library:** Choose one:
  - AMCharts
  - Chart.js
- **State Management:** React Context API or Redux (optional)
- **Routing:** React Router v6
- **HTTP Client:** Axios or Fetch API
- **Form Validation:** React Hook Form (optional) or custom
- **Toast Notifications:** react-hot-toast, react-toastify, or custom

#### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT)
- **Middleware:** CORS, body-parser
- **Data Storage:** In-memory (malls.json file)

#### Development Tools
- **Linting:** ESLint
- **Formatting:** Prettier (optional)
- **Testing:** Jest, Vitest, or React Testing Library
- **Version Control:** Git
- **Package Manager:** npm or yarn

### 3.2 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 4. Functional Requirements

### 4.1 Authentication System

#### FR-1.1: Login Page
**Priority:** P0 (Critical)

**Requirements:**
- Display username and password input fields
- Show login button
- Display error messages for invalid credentials
- Redirect to dashboard upon successful login
- Store JWT token securely (localStorage or sessionStorage)

**Acceptance Criteria:**
- Valid credentials (admin/a, manager/m, store/s) authenticate successfully
- Invalid credentials show error message
- Token is stored and persists across page refreshes
- Login form has basic validation (required fields)

#### FR-1.2: Token Management
**Priority:** P0 (Critical)

**Requirements:**
- Generate JWT token on successful login
- Include user role in token payload
- Set token expiration (e.g., 24 hours)
- Attach token to all API requests via Authorization header
- Handle token expiration gracefully

**Acceptance Criteria:**
- All authenticated API calls include valid token
- Expired tokens redirect to login
- Token contains { username, role, iat, exp }

#### FR-1.3: Logout Functionality
**Priority:** P1 (High)

**Requirements:**
- Provide logout button in header/navigation
- Clear stored token on logout
- Redirect to login page
- Clear any cached user data

**Acceptance Criteria:**
- Logout button visible when authenticated
- Clicking logout clears session and redirects
- Accessing protected routes after logout redirects to login

#### FR-1.4: Route Protection
**Priority:** P0 (Critical)

**Requirements:**
- Protect all application routes except /login
- Redirect unauthenticated users to login
- Verify token validity on protected routes

**Acceptance Criteria:**
- Cannot access /dashboard without valid token
- Direct URL access to protected routes redirects to login
- Invalid/expired tokens redirect to login

---

### 4.2 Map Integration

#### FR-2.1: Interactive Map Display
**Priority:** P0 (Critical)

**Requirements:**
- Display full-screen interactive map
- Center map on Doha, Qatar (coordinates: 25.2854° N, 51.5310° E)
- Default zoom level appropriate for city view
- Enable pan and zoom controls
- Responsive map that adjusts to screen size

**Acceptance Criteria:**
- Map loads and displays Doha region
- Users can pan and zoom smoothly
- Map fills available viewport space
- Map is functional on mobile devices

#### FR-2.2: Mall Markers
**Priority:** P0 (Critical)

**Requirements:**
- Display marker/pin for each mall on the map
- Show mall name on marker hover
- Different marker style/color to distinguish from stores
- Clicking marker shows mall details

**Acceptance Criteria:**
- All malls from malls.json appear on map
- Markers are positioned at correct coordinates
- Hover displays mall name
- Click opens mall detail card/modal

#### FR-2.3: Store Markers
**Priority:** P0 (Critical)

**Requirements:**
- Display marker/pin for each store on the map
- Show store name on marker hover
- Different marker style/color to distinguish from malls
- Clicking marker shows store details
- Visual indication of store status (open/closed)

**Acceptance Criteria:**
- All stores appear on map at correct coordinates
- Markers show open/closed status visually
- Hover displays store name
- Click opens store detail card/modal

#### FR-2.4: Marker Interactions
**Priority:** P1 (High)

**Requirements:**
- Smooth hover effects on markers
- Click interactions open detail panels
- Optional: Marker clustering for better performance
- Optional: Animated transitions when toggling open/closed

**Acceptance Criteria:**
- Hover effects are smooth and visible
- Clicking marker shows relevant information
- No performance issues with all markers displayed

---

### 4.3 Mall Management

#### FR-3.1: View Mall Details
**Priority:** P0 (Critical)

**Requirements:**
- Display mall information card/modal
- Show: name, address, description, image, coordinates, status (open/closed)
- List all stores within the mall
- Show opening hours

**Acceptance Criteria:**
- Clicking mall marker opens detail view
- All mall information is displayed correctly
- Stores list is accurate and complete

#### FR-3.2: Toggle Mall Status (Admin Only)
**Priority:** P0 (Critical)

**Requirements:**
- Admin users see "Toggle Open/Close" button for malls
- Button shows current status (e.g., "Close Mall" if currently open)
- Toggling mall status affects all stores within
- Show confirmation dialog before toggling
- Display success/error toast notification
- Update map markers to reflect new status

**Acceptance Criteria:**
- Only admin role can see toggle button
- Toggling mall closes/opens all its stores
- Map updates immediately after toggle
- Appropriate feedback shown to user

#### FR-3.3: Mall Status Cascading
**Priority:** P0 (Critical)

**Requirements:**
- When admin closes a mall, all stores within close automatically
- When admin opens a mall, all stores within open automatically
- Prevent managers from opening stores in closed malls
- Show visual indication that stores are closed due to mall closure

**Acceptance Criteria:**
- Closing mall sets all store.isOpen = false
- Opening mall sets all store.isOpen = true
- Store toggle disabled if mall is closed (manager view)
- Clear indication of cascading status

---

### 4.4 Store Management

#### FR-4.1: View Store Details
**Priority:** P0 (Critical)

**Requirements:**
- Display store information card/modal
- Show: name, category, description, image, opening hours, status, coordinates
- Show parent mall information
- Display contact information if available

**Acceptance Criteria:**
- Clicking store marker opens detail view
- All store information displayed correctly
- Parent mall clearly identified

#### FR-4.2: Toggle Store Status (Manager Only)
**Priority:** P0 (Critical)

**Requirements:**
- Manager users see "Toggle Open/Close" button for stores
- Button shows current status
- Cannot toggle store if parent mall is closed
- Show confirmation dialog before toggling
- Display success/error toast notification
- Update map markers immediately

**Acceptance Criteria:**
- Only manager role can see toggle button
- Cannot close/open store in closed mall
- Map updates immediately after toggle
- Appropriate feedback shown

#### FR-4.3: Edit Store Details (Store User Only)
**Priority:** P0 (Critical)

**Requirements:**
- Store users see "Edit Store" button
- Editable fields:
  - Store name
  - Description
  - Opening hours
  - Category
  - Contact information
  - Image URL (optional)
- Save and cancel buttons
- Validate required fields before saving
- Show success/error toast notification
- Cannot edit: coordinates, mall assignment, isOpen status

**Acceptance Criteria:**
- Only store role can see edit button
- Form pre-populates with current values
- Validation prevents empty required fields
- Changes persist after save
- Map/details update immediately

#### FR-4.4: Store Data Validation
**Priority:** P0 (Critical)

**Requirements:**
- Use validateData.ts utility
- Validate required fields: name, opening_hours, coordinates
- Validate coordinate ranges (within Doha region)
- Validate logical consistency (store belongs to valid mall)
- Show specific error messages for validation failures

**Acceptance Criteria:**
- Cannot save store with missing required fields
- Invalid coordinates are rejected
- Clear error messages guide user
- Valid data saves successfully

---

### 4.5 Data Management

#### FR-5.1: Initial Data Loading
**Priority:** P0 (Critical)

**Requirements:**
- Load malls.json data on application start
- Parse and validate data structure
- Handle loading states
- Display error if data fails to load

**Acceptance Criteria:**
- All malls and stores load from malls.json
- Loading spinner shown while fetching
- Error message if data load fails
- Retry mechanism available

#### FR-5.2: Real-time Updates
**Priority:** P1 (High)

**Requirements:**
- Updates to mall/store data reflect immediately on map
- State management keeps UI in sync
- Optimistic updates for better UX
- Rollback on error

**Acceptance Criteria:**
- Toggling status updates map instantly
- Editing store updates details immediately
- Failed operations revert to previous state

#### FR-5.3: Data Persistence
**Priority:** P1 (High)

**Requirements:**
- Changes persist in server memory during session
- Optional: Export updated data back to malls.json
- Optional: Track change history

**Acceptance Criteria:**
- Changes survive page refresh (until server restart)
- Data remains consistent across operations

---

### 4.6 Error Handling & Feedback

#### FR-6.1: Toast Notifications
**Priority:** P0 (Critical)

**Requirements:**
- Success toasts for successful operations (green)
- Error toasts for failed operations (red)
- Warning toasts for validation issues (yellow)
- Auto-dismiss after 3-5 seconds
- Position: top-right or top-center

**Acceptance Criteria:**
- All user actions trigger appropriate feedback
- Messages are clear and actionable
- Toasts don't obstruct critical UI

#### FR-6.2: API Error Handling
**Priority:** P0 (Critical)

**Requirements:**
- Handle network errors gracefully
- Show user-friendly error messages
- Log technical errors to console
- Handle 401 (unauthorized) with redirect to login
- Handle 403 (forbidden) with permission error
- Handle 500 (server error) with generic error

**Acceptance Criteria:**
- No silent failures
- User always receives feedback
- Authentication errors redirect to login
- Permission errors show clear message

#### FR-6.3: Form Validation Errors
**Priority:** P1 (High)

**Requirements:**
- Inline validation on form fields
- Show error state on invalid fields
- Display specific error messages
- Prevent form submission if invalid
- Clear errors when corrected

**Acceptance Criteria:**
- Required field validation works
- Field-level error messages shown
- Cannot submit invalid forms
- Errors clear on correction

#### FR-6.4: Loading States
**Priority:** P1 (High)

**Requirements:**
- Show loading spinners during async operations
- Disable buttons during processing
- Show skeleton screens for data loading
- Prevent duplicate submissions

**Acceptance Criteria:**
- Clear indication when operation in progress
- No duplicate API calls
- User cannot interact with loading components

---

### 4.7 User Interface & Design

#### FR-7.1: Responsive Layout
**Priority:** P0 (Critical)

**Requirements:**
- Desktop layout (≥1024px): Sidebar + map + details panel
- Tablet layout (768px - 1023px): Collapsible sidebar, full-width map
- Mobile layout (<768px): Bottom sheet UI, full-screen map
- Touch-friendly controls on mobile
- Readable text sizes on all devices

**Acceptance Criteria:**
- Functional and attractive on all screen sizes
- No horizontal scrolling on mobile
- Touch targets ≥44px on mobile
- Text is readable without zooming

#### FR-7.2: Modern "2030-era" Design
**Priority:** P1 (High)

**Requirements:**
- Clean, minimalist interface
- Smooth animations and transitions
- Glass morphism or neumorphism effects (optional)
- Consistent color palette
- Modern typography
- Proper spacing and whitespace
- Subtle shadows and depth
- Dark mode support (bonus)

**Acceptance Criteria:**
- Visually appealing and modern
- Consistent design language throughout
- Professional polish
- Positive first impression

#### FR-7.3: Accessibility
**Priority:** P1 (High)

**Requirements:**
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- ARIA labels where needed
- Color contrast ratios meet WCAG AA
- Focus indicators visible

**Acceptance Criteria:**
- Can navigate with keyboard only
- Screen reader compatible
- Color contrast passes automated tests

#### FR-7.4: Role-Based UI
**Priority:** P0 (Critical)

**Requirements:**
- Show/hide features based on user role
- Disable actions not permitted by role
- Visual indication of disabled features
- No exposure of unauthorized actions in UI

**Acceptance Criteria:**
- Admin sees only mall toggles
- Manager sees only store toggles
- Store sees only edit buttons
- Unauthorized buttons hidden or disabled

---

### 4.8 Spatial Features

#### FR-8.1: Distance Calculations
**Priority:** P2 (Nice to Have)

**Requirements:**
- Implement spatial.ts utilities
- Calculate distance between points using Haversine formula
- Use distanceBetween(lat1, lon1, lat2, lon2) function
- Display distances in kilometers

**Acceptance Criteria:**
- Distance calculations are accurate
- Utility functions work as specified

#### FR-8.2: Proximity Search (Bonus)
**Priority:** P3 (Bonus)

**Requirements:**
- Find nearest open store to user location
- Use isNear(lat1, lon1, lat2, lon2, radiusKm) function
- Show "Nearest Open Store" feature
- Optional: Geolocation API integration

**Acceptance Criteria:**
- Correctly identifies nearest open store
- Works with manually entered coordinates

---

## 5. Non-Functional Requirements

### 5.1 Performance
**Priority:** P1 (High)

**Requirements:**
- Initial page load < 3 seconds
- Map renders within 1 second
- Smooth 60fps animations
- Efficient rendering of 50+ markers
- No memory leaks

**Acceptance Criteria:**
- Lighthouse performance score > 70
- No janky animations
- Markers load without noticeable delay

### 5.2 Security
**Priority:** P0 (Critical)

**Requirements:**
- JWT tokens for authentication
- Validate tokens on all protected endpoints
- No sensitive data in client-side code
- HTTPS for production (if deployed)
- Sanitize user inputs
- No XSS vulnerabilities

**Acceptance Criteria:**
- Cannot access API without valid token
- Expired tokens are rejected
- Role enforcement works on backend

### 5.3 Code Quality
**Priority:** P1 (High)

**Requirements:**
- TypeScript strict mode enabled
- Interfaces for all data types (Mall, Store, User, etc.)
- No `any` types (or minimal with justification)
- Consistent code formatting
- Meaningful variable/function names
- Comments for complex logic
- DRY principles followed
- Separation of concerns

**Acceptance Criteria:**
- TypeScript compiles without errors
- ESLint shows no major issues
- Code is readable and maintainable

### 5.4 Testing
**Priority:** P1 (High)

**Requirements:**
- Unit tests for utility functions (spatial.ts, validateData.ts)
- Run tests with `npm run test`
- Tests pass successfully
- Optional: Component tests for critical features

**Acceptance Criteria:**
- All provided tests pass
- Spatial.test.ts runs successfully
- Validation logic tested

### 5.5 Documentation
**Priority:** P1 (High)

**Requirements:**
- Comprehensive README.md
- Setup instructions
- Available npm scripts
- Environment variables documentation
- API endpoints documentation
- Login credentials listed
- Design choices explained
- Known issues/limitations noted

**Acceptance Criteria:**
- New developer can set up project from README
- All features documented
- Design rationale clearly explained

---

## 6. API Specification

### 6.1 Base URL
```
http://localhost:5000
```

### 6.2 Endpoints

#### POST /api/login
**Description:** Authenticate user and return JWT

**Request Body:**
```json
{
  "username": "admin",
  "password": "a"
}
```

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "username": "admin"
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

---

#### GET /api/malls
**Description:** Get all malls and their stores

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
[
  {
    "id": 1,
    "name": "City Center Mall",
    "location": "West Bay, Doha",
    "coordinates": {
      "latitude": 25.3203,
      "longitude": 51.5308
    },
    "isOpen": true,
    "image": "https://...",
    "description": "...",
    "opening_hours": "9:00 AM - 10:00 PM",
    "stores": [
      {
        "id": 101,
        "name": "Tech Haven",
        "mallId": 1,
        "category": "Electronics",
        "coordinates": {
          "latitude": 25.3204,
          "longitude": 51.5309
        },
        "opening_hours": "10:00 AM - 9:00 PM",
        "isOpen": true,
        "description": "..."
      }
    ]
  }
]
```

**Response (Error - 401):**
```json
{
  "error": "No token provided"
}
```

---

#### PATCH /api/malls/:id/toggle
**Description:** Toggle mall open/close status (Admin only)

**Role Required:** Admin

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (number): Mall ID

**Response (Success - 200):**
```json
{
  "message": "Mall status updated successfully",
  "mall": {
    "id": 1,
    "isOpen": false
  }
}
```

**Response (Error - 403):**
```json
{
  "error": "Forbidden: Admin role required"
}
```

---

#### PATCH /api/malls/:mallId/stores/:storeId/toggle
**Description:** Toggle store open/close status (Manager only)

**Role Required:** Manager

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `mallId` (number): Mall ID
- `storeId` (number): Store ID

**Response (Success - 200):**
```json
{
  "message": "Store status updated successfully",
  "store": {
    "id": 101,
    "mallId": 1,
    "isOpen": false
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Cannot open store: parent mall is closed"
}
```

---

#### PUT /api/malls/:mallId/stores/:storeId
**Description:** Update store details (Store User only)

**Role Required:** Store

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `mallId` (number): Mall ID
- `storeId` (number): Store ID

**Request Body:**
```json
{
  "name": "Tech Haven Electronics",
  "description": "Latest electronics and gadgets",
  "opening_hours": "Mon–Sun 10:00 AM – 9:00 PM",
  "category": "Electronics",
  "contact": {
    "phone": "+974 1234 5678",
    "email": "info@techhaven.com"
  }
}
```

**Response (Success - 200):**
```json
{
  "message": "Store updated successfully",
  "store": {
    "id": 101,
    "name": "Tech Haven Electronics",
    "description": "Latest electronics and gadgets",
    "opening_hours": "Mon–Sun 10:00 AM – 9:00 PM",
    "category": "Electronics",
    "mallId": 1,
    "isOpen": true,
    "coordinates": {
      "latitude": 25.3204,
      "longitude": 51.5309
    },
    "contact": {
      "phone": "+974 1234 5678",
      "email": "info@techhaven.com"
    }
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Validation failed: name is required"
}
```

---

## 7. Data Models

### 7.1 Mall Interface
```typescript
interface Mall {
  id: number;
  name: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isOpen: boolean;
  image?: string;
  description?: string;
  opening_hours?: string;
  stores: Store[];
}
```

### 7.2 Store Interface
```typescript
interface Store {
  id: number;
  name: string;
  mallId: number;
  category: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  opening_hours: string;
  isOpen: boolean;
  description?: string;
  image?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}
```

### 7.3 User Interface
```typescript
interface User {
  username: string;
  role: 'admin' | 'manager' | 'store';
  token: string;
}
```

### 7.4 AuthResponse Interface
```typescript
interface AuthResponse {
  token: string;
  role: 'admin' | 'manager' | 'store';
  username: string;
}
```

### 7.5 API Error Interface
```typescript
interface APIError {
  error: string;
  details?: string;
}
```

---

## 8. File Structure

```
bluesky-store-locator/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── map/
│   │   │   │   ├── MapContainer.tsx
│   │   │   │   ├── MapMarker.tsx
│   │   │   │   └── MapControls.tsx
│   │   │   ├── mall/
│   │   │   │   ├── MallCard.tsx
│   │   │   │   ├── MallDetailModal.tsx
│   │   │   │   └── MallToggleButton.tsx
│   │   │   ├── store/
│   │   │   │   ├── StoreCard.tsx
│   │   │   │   ├── StoreDetailModal.tsx
│   │   │   │   ├── StoreEditForm.tsx
│   │   │   │   └── StoreToggleButton.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   └── common/
│   │   │       ├── Toast.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   ├── types/
│   │   │   ├── Mall.ts
│   │   │   ├── Store.ts
│   │   │   ├── User.ts
│   │   │   └── index.ts
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useToast.ts
│   │   │   └── useMalls.ts
│   │   ├── utils/
│   │   │   ├── validateData.ts
│   │   │   ├── spatial.ts
│   │   │   └── constants.ts
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── public/
│   │   └── vite.svg
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .eslintrc.cjs
├── server/
│   ├── data/
│   │   └── malls.json
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── malls.js
│   ├── utils/
│   │   └── validateData.js
│   ├── index.js           # Unified server with auth
│   ├── mockServer.js (optional)
│   ├── package.json
│   └── .env
├── tests/
│   ├── spatial.test.ts
│   └── validateData.test.ts
├── README.md
├── PRD.md
├── .gitignore
└── package.json
```

---

## 9. Development Phases

### Phase 1: Foundation (Day 1)
**Duration:** 4-6 hours

**Goals:**
- ✅ Write PRD
- Set up project structure
- Initialize Git repository
- Install all dependencies
- Download gist files
- Set up authentication server
- Create TypeScript interfaces
- Configure Tailwind CSS

**Deliverables:**
- Working dev environment
- Server running on localhost:5000
- Client running on localhost:5173
- Basic project scaffold

---

### Phase 2: Authentication (Day 1-2)
**Duration:** 3-4 hours

**Goals:**
- Implement login page UI
- Create AuthContext
- Set up protected routes
- Implement JWT token management
- Test all three user roles

**Deliverables:**
- Functional login system
- Role-based routing
- Logout functionality

---

### Phase 3: Map Integration (Day 2)
**Duration:** 4-5 hours

**Goals:**
- Integrate map library (Leaflet/Cesium)
- Center map on Doha
- Display mall markers
- Display store markers
- Implement marker hover effects
- Implement marker click handlers

**Deliverables:**
- Interactive map with all markers
- Clickable markers

---

### Phase 4: Data Display (Day 2-3)
**Duration:** 3-4 hours

**Goals:**
- Create mall detail modal/card
- Create store detail modal/card
- Fetch and display mall/store data
- Implement loading states
- Handle API errors

**Deliverables:**
- Full data display functionality
- Error handling

---

### Phase 5: Role-Based Features (Day 3-4)
**Duration:** 5-6 hours

**Goals:**
- Implement admin mall toggle
- Implement manager store toggle
- Implement store edit form
- Add form validation
- Implement cascading mall/store status
- Add success/error notifications

**Deliverables:**
- All role-specific features working
- Proper permission enforcement

---

### Phase 6: UI/UX Polish (Day 4-5)
**Duration:** 4-5 hours

**Goals:**
- Responsive design implementation
- Modern styling and animations
- Mobile optimization
- Accessibility improvements
- Toast notifications
- Loading states

**Deliverables:**
- Beautiful, modern UI
- Responsive on all devices

---

### Phase 7: Testing & Documentation (Day 5)
**Duration:** 3-4 hours

**Goals:**
- Run and pass all tests
- Test all user roles thoroughly
- Test on multiple browsers
- Test responsive design
- Write comprehensive README
- Document design decisions
- Fix bugs

**Deliverables:**
- All tests passing
- Complete README
- Bug-free application

---

### Phase 8: Optional Enhancements (If time permits)
**Duration:** Variable

**Goals:**
- Deploy to Vercel/Netlify
- Add bonus features:
  - Nearest open store finder
  - Animated marker transitions
  - Audit logs
  - Dark mode
  - Advanced filters

**Deliverables:**
- Live demo URL
- Bonus features

---

## 10. Milestones & Timeline

| Date | Milestone | Status |
|------|-----------|--------|
| **Dec 2024** | PRD Complete | ✅ |
| **TBD** | Project setup & authentication | ⏳ |
| **TBD** | Map integration & data display | ⏳ |
| **TBD** | Role-based features | ⏳ |
| **TBD** | UI/UX polish | ⏳ |
| **TBD** | Testing & documentation | ⏳ |
| **TBD** | **Progress Update** | ⏳ |
| **TBD** | **Final Submission** | ⏳ |

---

## 11. Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Map library integration issues | Medium | High | Use Leaflet (simpler) instead of Cesium if time-constrained |
| Complex role-based logic bugs | Medium | High | Write tests early, test thoroughly for each role |
| Responsive design challenges | Low | Medium | Use Tailwind's responsive utilities, test early |
| TypeScript compilation errors | Low | Medium | Enable strict mode from start, fix as you go |
| Time constraints | High | High | Focus on P0 features first, skip bonuses if needed |
| API state management bugs | Medium | High | Use React Context carefully, consider Redux if complex |

### Non-Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scope creep | High | High | Stick to PRD, resist adding features |
| Perfectionism | Medium | Medium | Set time limits per phase, ship working > perfect |
| Burnout | Low | Medium | Take breaks, maintain work-life balance |
| Unclear requirements | Low | High | Reference PRD, make documented assumptions |

---

## 12. Assumptions

1. **Data Persistence:** Changes only need to persist in server memory, not permanent storage
2. **Authentication:** Simple JWT is sufficient, no refresh tokens needed
3. **Map Performance:** 50-100 markers is acceptable performance target
4. **Browser Support:** Modern browsers only (ES6+ support)
5. **Accessibility:** WCAG AA compliance is target, not AAA
6. **Testing:** Unit tests for utilities are sufficient, E2E tests are bonus
7. **Deployment:** Optional, local development is acceptable
8. **Images:** Placeholder images or URLs from malls.json are acceptable
9. **Real-time Updates:** Not required, refresh on action is fine
10. **Multi-language:** Not required for this phase (mentioned for future role)

---

## 13. Success Metrics

### Functional Completeness
- ✅ All P0 features implemented and working
- ✅ All three user roles function correctly
- ✅ All API endpoints working
- ✅ Zero critical bugs

### Code Quality
- ✅ TypeScript strict mode with minimal `any` types
- ✅ All tests passing
- ✅ ESLint warnings < 10
- ✅ Clean, readable code

### User Experience
- ✅ Responsive on mobile, tablet, desktop
- ✅ Modern, professional design
- ✅ Smooth interactions (60fps)
- ✅ Clear error messages

### Documentation
- ✅ Complete README with setup instructions
- ✅ Design decisions documented
- ✅ Code comments for complex logic
- ✅ API endpoints documented

---

## 14. Out of Scope

The following features are explicitly **NOT** required for this project:

1. ❌ User registration/signup
2. ❌ Password reset functionality
3. ❌ Email notifications
4. ❌ Real-time collaboration (WebSockets)
5. ❌ Database integration (PostgreSQL, MongoDB, etc.)
6. ❌ Advanced analytics dashboard
7. ❌ Payment integration
8. ❌ Multi-language support (i18n)
9. ❌ Advanced search/filtering
10. ❌ User profiles and settings
11. ❌ File upload for images
12. ❌ Social sharing features
13. ❌ Print functionality
14. ❌ Export to PDF/CSV
15. ❌ Advanced charting (unless time permits)

---

## 15. References & Resources

### Provided Resources
- [Malls Data (malls.json)](https://gist.github.com/topazahmed/ea65717dfee7d8d6725f019957cab0e7) - Complete mall and store data for Doha
- [Auth Server Reference (integrated into index.js)](https://gist.github.com/topazahmed/fb5e226a906b87a29a8937db6c051d72) - Express server with JWT authentication
- [Data Validation (validateData.ts)](https://gist.github.com/topazahmed/56d2896f0ad36eb2e00b286ab894afa5) - Validation utilities for required fields and coordinates
- [Spatial Utilities (spatial.ts)](https://gist.github.com/topazahmed/084b16b58d95efa136a86c89aae567b5) - Distance calculations and proximity functions
- [Spatial Tests (spatial.test.ts)](https://gist.github.com/topazahmed/0b46475d01c19fb8d8b9404f856c0959) - Unit tests for spatial utilities
- [Mock Server (mockServer.js)](https://gist.github.com/topazahmed/11497c33e2ebbeea4f4e5c63fed713c2) - Extended mock API with random delays for testing
- [Stores API (stores.json)](https://gist.github.com/topazahmed/3ce4526a67c3b945861ad0246f7bd610) - Static stores data (update to match malls.json)

### Documentation Links
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Leaflet Documentation](https://leafletjs.com/)
- [Cesium Documentation](https://cesium.com/learn/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [JWT.io](https://jwt.io/)

---

## 16. Appendix

### A. Doha Coordinates Reference
- **City Center:** 25.2854° N, 51.5310° E
- **West Bay:** 25.3203° N, 51.5308° E
- **The Pearl:** 25.3714° N, 51.5477° E
- **Aspire Zone:** 25.2634° N, 51.4440° E

### B. Sample Mall Data Structure
```json
{
  "id": 1,
  "name": "City Center Mall",
  "location": "West Bay, Doha",
  "coordinates": {
    "latitude": 25.3203,
    "longitude": 51.5308
  },
  "isOpen": true,
  "image": "https://example.com/mall.jpg",
  "description": "Premier shopping destination",
  "opening_hours": "9:00 AM - 10:00 PM",
  "stores": [...]
}
```

### C. Sample Store Data Structure
```json
{
  "id": 101,
  "name": "Tech Haven",
  "mallId": 1,
  "category": "Electronics",
  "coordinates": {
    "latitude": 25.3204,
    "longitude": 51.5309
  },
  "opening_hours": "10:00 AM - 9:00 PM",
  "isOpen": true,
  "description": "Latest electronics and gadgets",
  "image": "https://example.com/store.jpg",
  "contact": {
    "phone": "+974 1234 5678",
    "email": "info@techhaven.com"
  }
}
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | Fahad Murtaza | Initial PRD creation |

---

**End of Product Requirements Document**