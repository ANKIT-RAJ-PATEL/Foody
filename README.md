<div align="center">
  <img src="frontend/src/assets/logo.png" alt="Foody Logo" width="150"/>
  <h1>Foody - Food Delivery Platform</h1>
  <p>A full-stack food delivery application built with the MERN stack, featuring real-time order tracking, AI-powered chatbot, and role-based dashboards.</p>
</div>

---

## Home Page

<p align="center">
  <img src="frontend/src/assets/home.png" alt="Foody Home" width="800"/>
</p>

## Tech Stack

**Frontend:** React 19, Vite, TailwindCSS, Redux Toolkit, Socket.IO, Leaflet Maps, Firebase Auth

**Backend:** Node.js, Express, MongoDB, Socket.IO, Razorpay, Cloudinary, Nodemailer

**AI:** Groq API (Compound Mini), Google Gemini 2.0 Flash

## Features

<p align="center">
  <img src="frontend/src/assets/shop.png" alt="Restaurant" width="250"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="frontend/src/assets/scooter.png" alt="Delivery" width="250"/>
</p>

### Customer
- Browse restaurants and food items by city
- Mood-based AI food recommendations
- Cart & checkout with Razorpay payment
- Live order tracking with map
- Delivery issue resolution via AI chatbot

### Restaurant Owner
- Create and manage restaurant profile
- Add/edit/delete menu items
- Real-time order notifications
- Order status management
- AI-powered setup and menu tips

### Delivery Boy
- Real-time assignment notifications
- Location tracking with Socket.IO
- OTP-based delivery verification
- AI-powered route and navigation help
- Daily delivery stats dashboard

### AI Chatbot (Foody AI)
- Dual provider support (Groq + Gemini)
- Role-based conversations (User/Owner/Delivery Boy)
- Mood-based food recommendations
- Delivery issue handling with owner escalation
- Context-aware responses (city, items, contacts)

## Project Structure

```
Foody/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers (auth, user, shop, item, order, ai)
│   ├── middlewares/     # Auth & file upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── utils/           # Token, mail, cloudinary utilities
│
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Page components
│       ├── redux/       # State management
│       └── assets/      # Images and static files
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account
- Razorpay account
- Firebase project
- Groq API key (free) or Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/ANKIT-RAJ-PATEL/Foody.git
cd Foody
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Environment Variables

Create `.env` file in `backend/`:
```
PORT=3000
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL=your_email@gmail.com
PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Create `.env` file in `frontend/`:
```
VITE_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_GEOAPIFY_KEY=your_geoapify_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### Running the App

```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/signin | Login |
| POST | /api/auth/googleauth | Google OAuth login |
| GET | /api/user/currentuser | Get current user |
| POST | /api/shop/createeditshop | Create/edit restaurant |
| GET | /api/item/getbycity/:city | Get items by city |
| POST | /api/order/placeorder | Place an order |
| POST | /api/ai/chat | Chat with AI assistant |

## Author

**Ankit Raj Patel** - [GitHub](https://github.com/ANKIT-RAJ-PATEL)
