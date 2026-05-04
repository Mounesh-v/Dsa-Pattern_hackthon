# DSA Pattern Tutor

A production-ready full-stack web application that trains students to recognize Data Structures & Algorithms problem-solving patterns under interview pressure. Unlike traditional platforms like LeetCode, this system focuses on pattern recognition rather than memorizing solutions.

## 🚀 Features

### Core Features

- **Blind Challenge Mode**: Practice problems without tags or hints with countdown timer
- **Instant Feedback Engine**: Get detailed explanations of why patterns work or fail
- **Weak Pattern Intelligence Dashboard**: Track accuracy, speed, and improvement by pattern
- **Pattern Confusion Matrix**: Visualize common mistakes and targeted recommendations
- **Adaptive Training Engine**: Personalized practice based on weak areas
- **Speed Training Mode**: 30-second rapid-fire challenges with streaks and leaderboards

### User Features

- User authentication with JWT
- Profile management with achievements
- Detailed analytics and progress tracking
- Leaderboard system
- Multiple practice modes

### Admin Features

- Problem management (CRUD operations)
- User management
- Analytics overview
- Bulk problem upload

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Three.js + React Three Fiber** - 3D animations
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js + Express.js** - Server framework
- **MongoDB + Mongoose** - Database
- **JWT + bcrypt** - Authentication
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dsa-pattern-tutor
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/dsa-pattern-tutor
# JWT_SECRET=your-super-secret-jwt-key
# PORT=5000
# CLIENT_URL=http://localhost:5173

# Seed the database with sample problems
npm run seed

# Start the development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

- Open your browser and navigate to `http://localhost:5173`
- Register a new account or login with the admin credentials:
  - Email: `admin@dsatutor.com`
  - Password: `admin123`

## 📁 Project Structure

```
dsa-pattern-tutor/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Three/          # 3D components
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BlindChallenge.jsx
│   │   │   ├── SpeedMode.jsx
│   │   │   ├── AdaptivePractice.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/            # Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── services/           # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── problemService.js
│   │   │   ├── attemptService.js
│   │   │   ├── analyticsService.js
│   │   │   └── userService.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                     # Express backend
│   ├── src/
│   │   ├── models/             # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Problem.js
│   │   │   ├── Attempt.js
│   │   │   └── Analytics.js
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js
│   │   │   ├── problems.js
│   │   │   ├── attempts.js
│   │   │   ├── analytics.js
│   │   │   └── users.js
│   │   ├── controllers/        # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── problemController.js
│   │   │   ├── attemptController.js
│   │   │   ├── analyticsController.js
│   │   │   └── userController.js
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── config/             # Configuration
│   │   │   └── db.js
│   │   └── server.js
│   ├── seed.js                 # Database seed script
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password

### Problems
- `GET /api/problems/random` - Get random problem
- `GET /api/problems/adaptive` - Get adaptive problem
- `GET /api/problems` - List all problems (admin)
- `POST /api/problems` - Create problem (admin)
- `PUT /api/problems/:id` - Update problem (admin)
- `DELETE /api/problems/:id` - Delete problem (admin)

### Attempts
- `POST /api/attempts` - Submit attempt
- `GET /api/attempts` - Get attempt history
- `GET /api/attempts/stats` - Get user statistics

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/confusion-matrix` - Get confusion matrix
- `GET /api/analytics/weak-patterns` - Get weak patterns
- `GET /api/analytics/progress` - Get progress over time

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/leaderboard` - Get leaderboard

## 🎨 Supported Patterns

The application supports the following DSA patterns:

1. Sliding Window
2. Two Pointers
3. Binary Search
4. Dynamic Programming
5. Greedy
6. Backtracking
7. Graph Traversal
8. DFS (Depth-First Search)
9. BFS (Breadth-First Search)
10. Heap/Priority Queue
11. Union Find
12. Prefix Sum
13. Recursion

## 🚢 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_API_URL`
4. Deploy

### Backend (Render/Railway)

1. Push your code to GitHub
2. Import project in Render/Railway
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT`
   - `CLIENT_URL`
4. Deploy

### Database (MongoDB Atlas)

1. Create a free MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('user' | 'admin'),
  patternStats: {
    [pattern]: {
      attempts: Number,
      correct: Number,
      avgTime: Number
    }
  },
  confusionMatrix: Map,
  speedRecords: {
    bestStreak: Number,
    avgAccuracy: Number,
    totalAttempts: Number
  },
  achievements: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Problem Model
```javascript
{
  title: String,
  description: String,
  difficulty: String ('easy' | 'medium' | 'hard'),
  correctPattern: String,
  wrongPatternExplanations: Map,
  tags: Array,
  companyFrequency: Number,
  timeLimit: Number,
  examples: Array,
  constraints: Array,
  isActive: Boolean,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Attempt Model
```javascript
{
  userId: ObjectId,
  problemId: ObjectId,
  selectedPattern: String,
  isCorrect: Boolean,
  timeTaken: Number,
  mode: String ('blind' | 'speed' | 'adaptive'),
  date: Date
}
```

### Analytics Model
```javascript
{
  userId: ObjectId (unique),
  patternAccuracy: Map,
  confusionMatrix: Map,
  recommendations: Array,
  weakPatterns: Array,
  strongPatterns: Array,
  overallStats: {
    totalAttempts: Number,
    totalCorrect: Number,
    overallAccuracy: Number,
    avgTime: Number,
    bestStreak: Number,
    currentStreak: Number
  },
  progressHistory: Array,
  lastUpdated: Date
}
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet security headers
- CORS configuration
- Protected routes
- Admin-only routes
- Input validation

## 🎯 Future Enhancements

- [ ] AI-generated explanations
- [ ] More pattern types
- [ ] Mobile app (React Native)
- [ ] Real-time multiplayer challenges
- [ ] Video explanations
- [ ] Code editor integration
- [ ] Mock interview mode
- [ ] Company-specific problem sets

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ for DSA learners everywhere
