# Quick Start Guide

Get DSA Pattern Tutor up and running in 5 minutes!

## 🚀 Quick Setup

### Prerequisites
- Node.js (v18+) installed
- MongoDB running locally or MongoDB Atlas account

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd dsa-pattern-tutor

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment

```bash
# Backend configuration
cd backend
cp .env.example .env

# Edit .env with your settings:
# MONGODB_URI=mongodb://localhost:27017/dsa-pattern-tutor
# JWT_SECRET=your-secret-key-here
# PORT=5000
# CLIENT_URL=http://localhost:5173

# Frontend configuration
cd ../frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Step 3: Seed Database

```bash
cd backend
npm run seed
```

This creates:
- 12 sample DSA problems
- Admin account (admin@dsatutor.com / admin123)

### Step 4: Start Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Step 5: Access the App

Open your browser to: `http://localhost:5173`

## 🎯 First Steps

1. **Register** a new account or login with admin credentials
2. **Explore** the dashboard to see your stats
3. **Try Blind Challenge** - practice without hints
4. **Check Analytics** - see your pattern strengths
5. **Complete Speed Mode** - test your speed

## 📚 What's Included

### Sample Problems
- Two Sum (Two Pointers)
- Longest Substring (Sliding Window)
- Search in Rotated Array (Binary Search)
- Climbing Stairs (Dynamic Programming)
- Jump Game (Greedy)
- Subsets (Backtracking)
- Number of Islands (DFS)
- Binary Tree Level Order (BFS)
- Kth Largest Element (Heap)
- Number of Provinces (Union Find)
- Subarray Sum Equals K (Prefix Sum)
- Permutations (Recursion)

### Features
- ✅ Blind Challenge Mode
- ✅ Speed Mode with streaks
- ✅ Adaptive Practice
- ✅ Analytics Dashboard
- ✅ Pattern Confusion Matrix
- ✅ Admin Panel
- ✅ Leaderboard
- ✅ Achievements

## 🛠 Common Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm start            # Start production server
npm run seed         # Seed database

# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
# For local MongoDB:
mongod

# Or use MongoDB Atlas:
# Update MONGODB_URI in backend/.env
```

### Port Already in Use
```bash
# Change PORT in backend/.env
# Or kill the process using the port
lsof -ti:5000 | xargs kill
```

### Frontend Not Connecting to Backend
```bash
# Verify VITE_API_URL in frontend/.env
# Should be: http://localhost:5000/api
```

## 📖 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Explore the admin panel to add more problems
- Customize the UI in `frontend/src/`

## 💡 Tips

1. **Start with Blind Challenge** to test your pattern recognition
2. **Use Adaptive Practice** to focus on weak areas
3. **Check Analytics** regularly to track progress
4. **Try Speed Mode** to improve interview speed
5. **Review explanations** to understand why patterns work

## 🎓 Learning Path

1. **Week 1**: Focus on easy problems, learn basic patterns
2. **Week 2**: Move to medium problems, master 2-3 patterns
3. **Week 3**: Practice speed mode, improve accuracy
4. **Week 4**: Tackle hard problems, refine weak areas

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- Open an issue on GitHub for bugs

---

Happy coding! 🚀
