# Deployment Guide

This guide will help you deploy the DSA Pattern Tutor application to production.

## Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render or Railway account (for backend)
- MongoDB Atlas account (for database)

## 🚀 Deployment Steps

### 1. Prepare Your Code

#### Backend
```bash
cd backend

# Update .env with production values
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dsa-pattern-tutor
# JWT_SECRET=<generate-a-strong-secret>
# PORT=5000
# NODE_ENV=production
# CLIENT_URL=https://your-frontend.vercel.app

# Test production build
npm start
```

#### Frontend
```bash
cd frontend

# Update .env with production API URL
# VITE_API_URL=https://your-backend.render.com/api

# Test production build
npm run build
npm run preview
```

### 2. Deploy Database (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select a region closest to your users
   - Create the cluster

3. **Configure Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Create a username and password
   - Save credentials securely

4. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows your backend to connect

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

6. **Create Database**
   - The database will be created automatically when you seed it
   - Or create it manually in MongoDB Atlas

### 3. Deploy Backend (Render)

#### Option A: Render (Recommended)

1. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `dsa-pattern-tutor/backend` folder
   - Configure build settings:
     ```
     Build Command: npm install
     Start Command: npm start
     ```

3. **Add Environment Variables**
   - Go to "Environment" tab
   - Add the following variables:
     ```
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dsa-pattern-tutor
     JWT_SECRET=<your-strong-secret>
     PORT=5000
     NODE_ENV=production
     CLIENT_URL=https://your-frontend.vercel.app
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://dsa-tutor-backend.onrender.com`)

5. **Seed Database**
   - Go to "Shell" tab in Render
   - Run: `npm run seed`
   - This will populate your database with sample problems

#### Option B: Railway

1. **Create Railway Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Configure root directory to `backend`

3. **Add Variables**
   - Go to "Variables" tab
   - Add the same environment variables as above

4. **Deploy**
   - Railway will automatically deploy
   - Copy the service URL

### 4. Deploy Frontend (Vercel)

1. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Configure root directory to `frontend`

3. **Add Environment Variables**
   - Go to "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend.render.com/api
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the frontend URL

5. **Update Backend CORS**
   - Go back to Render/Railway
   - Update `CLIENT_URL` environment variable
   - Set it to your Vercel frontend URL
   - Redeploy the backend

### 5. Verify Deployment

1. **Test Frontend**
   - Open your Vercel URL
   - Try registering a new account
   - Test all features

2. **Test Backend**
   - Check Render/Railway logs
   - Test API endpoints:
     ```
     GET https://your-backend.render.com/api/health
     GET https://your-backend.render.com/api/problems/random
     ```

3. **Test Database**
   - Go to MongoDB Atlas
   - Check "Collections" tab
   - Verify data is present

## 🔧 Post-Deployment Configuration

### Enable HTTPS

Both Vercel and Render automatically provide HTTPS. No additional configuration needed.

### Custom Domain (Optional)

#### Frontend (Vercel)
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records

#### Backend (Render)
1. Go to service settings
2. Click "Custom Domains"
3. Add your custom domain
4. Configure DNS records

### Monitoring

#### Render
- Automatic monitoring included
- Check "Metrics" tab for performance
- Set up alerts in "Events"

#### MongoDB Atlas
- Built-in monitoring dashboard
- Set up alerts for performance
- Check "Metrics" tab regularly

### Backup

#### MongoDB Atlas
- Automatic backups included (free tier: daily snapshots)
- Configure backup retention in settings
- Test restore process periodically

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend

**Solution**:
- Verify `CLIENT_URL` in backend matches frontend URL
- Check backend logs for CORS errors
- Ensure both are using HTTPS

#### 2. Database Connection Failed
**Problem**: Backend can't connect to MongoDB

**Solution**:
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions
- Check MongoDB Atlas logs

#### 3. Build Failures
**Problem**: Deployment fails during build

**Solution**:
- Check build logs for specific errors
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility
- Try local build first: `npm run build`

#### 4. Environment Variables Not Loading
**Problem**: App behaves unexpectedly

**Solution**:
- Verify variable names match exactly
- Check for typos in variable names
- Redeploy after adding variables
- Check platform-specific variable requirements

#### 5. 502/504 Errors
**Problem**: Backend is slow or unresponsive

**Solution**:
- Check backend logs for errors
- Verify database connection is stable
- Consider upgrading to paid tier for better performance
- Implement caching where appropriate

## 📊 Performance Optimization

### Frontend (Vercel)
- Enable image optimization
- Use CDN for static assets
- Implement code splitting
- Lazy load components

### Backend (Render)
- Use connection pooling for MongoDB
- Implement caching (Redis)
- Optimize database queries
- Use compression middleware

### Database (MongoDB Atlas)
- Create appropriate indexes
- Use projection to limit returned fields
- Implement query optimization
- Monitor slow queries

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit .env files
   - Use strong secrets
   - Rotate secrets periodically

2. **API Security**
   - Keep rate limiting enabled
   - Monitor for abuse
   - Implement request validation

3. **Database Security**
   - Use strong passwords
   - Enable IP whitelisting
   - Regular backups
   - Monitor access logs

4. **HTTPS**
   - Always use HTTPS in production
   - Implement HSTS headers
   - Use secure cookies

## 📈 Scaling

### When to Scale

- High CPU usage (>80%)
- High memory usage (>80%)
- Slow response times (>2s)
- Database connection limits

### Scaling Options

#### Backend
- Upgrade to paid Render tier
- Add more instances
- Use load balancer

#### Database
- Upgrade MongoDB Atlas tier
- Add read replicas
- Implement sharding

#### Frontend
- Vercel automatically scales
- Consider CDN for static assets
- Implement edge functions

## 🎉 Success!

Your DSA Pattern Tutor application is now live! 

- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.render.com`
- Database: MongoDB Atlas

Monitor your application regularly and make improvements based on user feedback.
