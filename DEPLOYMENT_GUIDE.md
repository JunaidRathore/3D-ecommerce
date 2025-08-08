# 🚀 Complete Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose installed
- Git repository (GitHub, GitLab, etc.)
- Domain name (optional but recommended)

## 🗄️ Database Options

### Option 1: Local PostgreSQL with Docker
```bash
# Create a docker-compose.yml for database only
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ecommerce_3d
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Option 2: Cloud Database (Recommended for Production)

#### 🔸 Railway (Easiest)
1. Go to [Railway.app](https://railway.app)
2. Create account and new project
3. Add PostgreSQL service
4. Copy connection string

#### 🔸 Supabase (Free PostgreSQL)
1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string

#### 🔸 Neon (Serverless PostgreSQL)
1. Go to [Neon.tech](https://neon.tech)
2. Create database
3. Copy connection string

## 🎯 Backend Deployment

### Option 1: Railway (Recommended)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Deploy backend
cd backend
railway deploy

# 4. Set environment variables in Railway dashboard:
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
NODE_ENV=production
PORT=3001
```

### Option 2: Heroku
```bash
# 1. Install Heroku CLI
# 2. Create Heroku app
heroku create your-app-name-backend

# 3. Set environment variables
heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set STRIPE_SECRET_KEY=sk_test_...

# 4. Deploy
git push heroku main
```

### Option 3: DigitalOcean App Platform
1. Connect GitHub repository
2. Select backend folder
3. Set environment variables
4. Deploy

### Option 4: Docker + VPS
```bash
# Create production Dockerfile in backend/
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel

# 3. Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Option 2: Netlify
1. Connect GitHub repository
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Set environment variables

### Option 3: Digital Ocean
1. Use App Platform
2. Connect repository
3. Select frontend folder
4. Set environment variables

## 🔧 Environment Variables Setup

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com

# Optional: Email service
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@yourdomain.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 📋 Step-by-Step Deployment Process

### 1. Prepare Database
```bash
# If using cloud database, get connection string
# If using local, start PostgreSQL container
docker-compose up -d postgres
```

### 2. Deploy Backend
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run database migrations
npm run migration:run

# Build and start
npm run build
npm run start:prod
```

### 3. Deploy Frontend
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your backend URL

# Build and deploy
npm run build
# Deploy using your chosen platform (Vercel, Netlify, etc.)
```

## 🔒 Production Security Checklist

- [ ] Use HTTPS for both frontend and backend
- [ ] Set strong JWT secret (32+ characters)
- [ ] Configure CORS properly
- [ ] Use environment variables for all secrets
- [ ] Enable database SSL in production
- [ ] Set up rate limiting
- [ ] Configure CSP headers
- [ ] Use secure cookies
- [ ] Enable database backups

## 🚨 Quick Deployment Commands

### Full Stack on Railway
```bash
# Backend
cd backend
railway login
railway link  # Link to existing project or create new
railway up

# Frontend on Vercel
cd frontend
vercel --prod
```

### Full Stack on Heroku + Vercel
```bash
# Backend on Heroku
cd backend
heroku create your-app-backend
git push heroku main

# Frontend on Vercel
cd frontend
vercel --prod
```

## 🧪 Testing Your Deployment

1. **Backend Health Check**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Frontend Loading**
   - Visit your frontend URL
   - Check browser console for errors
   - Test authentication flow

3. **Database Connection**
   - Try creating an account
   - Add products to cart
   - Test checkout flow

## 📞 Support Resources

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **PostgreSQL**: [postgresql.org/docs](https://postgresql.org/docs)
- **Docker**: [docs.docker.com](https://docs.docker.com)

## 🎯 Recommended Stack for Production

1. **Database**: Railway PostgreSQL or Supabase
2. **Backend**: Railway or Heroku
3. **Frontend**: Vercel
4. **Domain**: Cloudflare (free SSL, CDN)
5. **Monitoring**: Sentry for error tracking

This setup gives you:
- ✅ Auto-scaling
- ✅ SSL certificates
- ✅ CDN
- ✅ Database backups
- ✅ Easy deployments
- ✅ Monitoring