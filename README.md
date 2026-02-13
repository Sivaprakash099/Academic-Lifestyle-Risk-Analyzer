# Academic Lifestyle Risk Analyzer

## Project Overview
The **Academic Lifestyle Risk Analyzer** is a full-stack web application designed to help students track their daily habits (study, sleep, stress, etc.) and analyze the potential risk to their academic performance. Using rule-based logic, the system provides a risk assessment (Low, Medium, High) and actionable suggestions for improvement.

## Features
- **User Authentication**: Secure Login and Registration using JWT.
- **Lifestyle Tracking**: Daily input of study hours, sleep hours, screen time, stress level, and activity.
- **Risk Analysis**: Automated rule-based calculation of academic risk score (0-100).
- **Interactive Dashboard**: Visual charts (Recharts) and risk summary cards.
- **Personalized Suggestions**: Tailored advice based on specific risk factors.
- **Responsive UI**: Modern interface built with React and Tailwind CSS.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Recharts, Axios, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT), bcrypt

## Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/academic-lifestyle-risk-analyzer
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user info

### Lifestyle
- `POST /api/lifestyle` - Add new lifestyle entry
- `GET /api/lifestyle` - Get lifestyle history
- `DELETE /api/lifestyle/:id` - Delete entry

### Risk
- `POST /api/risk/analyze` - Trigger risk analysis
- `GET /api/risk/latest` - Get latest risk result

### Profile
- `GET /api/profile` - Get student profile details
- `POST /api/profile` - Update profile details

## Folder Structure
```
/
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
├── server/          # Node/Express Backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── ...
└── README.md
```

## Academic Project Details
- **Logic**: Rule-based (No ML)
- **Focus**: Clean Architecture, RESTful API, Modern UI/UX
