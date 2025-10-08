Store Locator and Management System where users log in with different roles and interact with malls and stores around
Doha, Qatar. 

🚀 Objective 

Create a React (or .NET Core) web app that. 

Displays an interactive map of Doha malls and their stores. 

Allows authenticated users to perform different actions depending on their role. 

Validates data and shows clear UI feedback. 

Looks like a sleek 2030-era application ✨. 

🧩 Tech Stack 

Frontend: React (TypeScript preferred) 

Backend: Node.js (mock Express API provided) 

UI Library: Tailwind / Material UI / Bootstrap / SCSS 

Map: Cesium (preffered), Leaflet or Mapbox 

Charts: AMCharts / Chart.js  

Auth: JSON Web Token (JWT) 

⚙️ Core Code Requirements 

Map Integration 
Display malls and stores on a full-screen map (centered on Doha).
Show store pins with hover effects and click interactions. 

Store & Mall Detail Cards 

Show details (images, descriptions, hours, status). 

Allow updates when permitted by the user’s role. 

Error Handling UI 

Toast or banner feedback for validation or API errors. 

Role-Based Logic 

Admin: Can toggle malls open/close (affecting all stores). 

Manager: Can toggle individual stores open/close. 

Store User: Can edit store details (name, hours, etc.). 

Responsive Design 

Functional and attractive on both desktop and mobile. 

Validation 

Use validateData.ts (see below) to verify required fields, valid coordinates, and logical structure. 

Type Safety 

Define interfaces for Mall, Store, and API responses. 

🗂️ Data Structure 

File: server/data/malls.json 

https://gist.github.com/topazahmed/ea65717dfee7d8d6725f019957cab0e7 

🔐 Authentication API 

🧩 Server Setup 

File: server/authServer.js 

(https://gist.github.com/topazahmed/fb5e226a906b87a29a8937db6c051d72) 

npm install express cors jsonwebtoken 

node server/authServer.js 

 

Runs at http://localhost:5000 

🔑 Login Credentials 

 

Role 

Username 

Password 

Permissions 

 

Admin 

admin 

a 

Open/close entire malls 

 

Manager 

manager 

m 

Open/close individual stores 

 

Store 

store 

s 

Edit store details 

 🧠 Endpoints 

Method 

Endpoint 

Role(s) 

Description 

POST 

/api/login 

Any 

Authenticate user and return JWT 

GET 

/api/malls 

All 

Get list of malls and stores 

PATCH 

/api/malls/:id/toggle 

Admin 

Toggle mall open/close (affects all stores) 

PATCH 

/api/malls/:mallId/stores/:storeId/toggle 

Manager 

Toggle single store open/close 

PUT 

/api/malls/:mallId/stores/:storeId 

Store 

Update store details 


🧾 Example Flow 

Login 

POST /api/login 

{ 

  "username": "manager", 

  "password": "m" 

} 

Returns: {"token": "<jwt>", "role": "manager"} 

 

Get malls 

GET /api/malls 

Authorization: Bearer <token> 

 

Admin closes a mall 

PATCH /api/malls/1/toggle 

Authorization: Bearer <token> 

 

Store updates its info 

PUT /api/malls/1/stores/101 

{ 

  "name": "Star Electronics & Gadgets", 

  "opening_hours": "Mon–Sun 10:00 – 9:00 PM" 

} 

 

🧮 Data Validation 

Gist: https://gist.github.com/topazahmed/56d2896f0ad36eb2e00b286ab894afa5 

Use validateData.ts to verify: 

Required fields 

Latitude/longitude within valid Doha ranges 

Logical consistency between mall/store relationships 

Run manually: 

npm run validate-data 

 

🌍 Spatial Utilities 

Use Spatial.ts (https://gist.github.com/topazahmed/084b16b58d95efa136a86c89aae567b5) 

Functions provided: 

distanceBetween(lat1, lon1, lat2, lon2) – distance in km 

isNear(lat1, lon1, lat2, lon2, radiusKm) – returns boolean 

Unit tests: 

Spatial.test.ts (https://gist.github.com/topazahmed/0b46475d01c19fb8d8b9404f856c0959) 

🧪 Testing 

Run: 

npm run test 

 

Tests include: 

Data validation logic 

Spatial distance calculations 

Optional UI or store-state logic 

⚡ Mock API (Extended) 

A second local Express API (mockServer.js, gist: https://gist.github.com/topazahmed/11497c33e2ebbeea4f4e5c63fed713c2) is provided for read-only endpoints (e.g., static /api/stores (https://gist.github.com/topazahmed/3ce4526a67c3b945861ad0246f7bd610) update
 it to match malls.json). 

Candidates can merge or replace it with the login backend. 

It randomly delays or returns malformed data to test validation handling. 

💡 Bonus Ideas (Optional) 

Show different UI states per role (disabled fields, hidden buttons). 

Add “nearest open store” using Spatial.isNear(). 

Animate open/close transitions on map markers. 

Add audit logs for updates. 

 

🧭 Submission 

Fork or clone the starter repo. 

Implement your solution with frequent commits. 

Push to a public GitHub repository. 

Include a short write-up in this README explaining your design choices. 

Optional: deploy a demo via Vercel / Netlify. 