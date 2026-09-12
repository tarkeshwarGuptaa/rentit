# 🏠 rentit — Student Room Finder

An Airbnb-inspired MERN stack platform for students to find rooms near their college. Landlords list rooms, students browse via cards + interactive map, and connect directly via WhatsApp.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+
- **MongoDB** running locally (or MongoDB Atlas URI)
- **Cloudinary** account (for photo uploads — optional for dev)

### 1. Clone & Install

```bash
# Server
cd roomnear/server
npm install

# Client
cd roomnear/client
npm install
```

### 2. Environment Setup

```bash
# Copy and edit server/.env
cp server/.env.example server/.env
# Edit MONGO_URI, JWT_SECRET, and Cloudinary keys
```

### 3. Seed Database (Fake Data)

```bash
cd server
npm run seed
```

This creates:
- 5 landlord accounts
- 1 student account
- 15 room listings near IIT Delhi

**Test Credentials:**
- Landlord: `rajesh@example.com` / `password123`
- Student: `arjun@example.com` / `password123`

### 4. Run Development

```bash
# Terminal 1 — Server (port 5000)
cd server
npm run dev

# Terminal 2 — Client (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📱 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth** | JWT-based register/login with student & landlord roles |
| 🏠 **Room Listings** | Airbnb-style cards with filters, sort, and search |
| 🗺️ **Map View** | Interactive Leaflet map with room pins (split-view) |
| 📷 **Photo Upload** | Multi-photo upload to Cloudinary |
| 📱 **WhatsApp Contact** | Direct WhatsApp link to landlord |
| 📊 **Dashboard** | Landlord dashboard to manage listings |
| ✅ **Validation** | Joi schemas for backend, inline validation frontend |
| 🛡️ **Error Handling** | Global error boundary + per-page error states |
| 📱 **Responsive** | Mobile-first responsive design |

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7, Leaflet
- **Backend:** Express 5, MongoDB, Mongoose, JWT, Joi, Multer, Cloudinary
- **UI:** react-hot-toast, react-icons, react-helmet-async

## 📁 Structure

```
roomnear/
├── server/          # Express API
│   ├── config/      # DB connection
│   ├── controllers/ # Route handlers
│   ├── middleware/   # Auth, validation, error, upload
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── seed/        # Seed script
│   └── utils/       # ApiError, asyncHandler, validators
│
├── client/          # React SPA
│   └── src/
│       ├── components/  # UI components
│       ├── pages/       # Page views
│       ├── context/     # Auth state
│       ├── hooks/       # Custom hooks
│       └── utils/       # API config
```
