# Deployment Guide

This guide covers deploying the 3D eCommerce Platform to production environments.

## 🌐 Production Deployment Options

### Option 1: Vercel + Railway (Recommended)
- **Frontend**: Vercel (optimized for Next.js)
- **Backend**: Railway (PostgreSQL + Node.js)
- **Database**: Railway PostgreSQL

### Option 2: Docker + Cloud Provider
- **Platform**: AWS ECS, Google Cloud Run, or DigitalOcean App Platform
- **Database**: Managed PostgreSQL service

### Option 3: Traditional VPS
- **Platform**: DigitalOcean Droplet, Linode, or AWS EC2
- **Database**: Self-managed PostgreSQL

## 🚀 Option 1: Vercel + Railway Deployment

### 1. Database Setup on Railway

1. **Create Railway Account**
   ```bash
   # Visit https://railway.app and sign up
   ```

2. **Create PostgreSQL Database**
   - Click "New Project"
   - Select "PostgreSQL"
   - Note the connection details

3. **Configure Database Environment**
   ```env
   DB_HOST=your-railway-host
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your-railway-password
   DB_NAME=railway
   ```

### 2. Backend Deployment on Railway

1. **Create New Service**
   - In your Railway project, click "New Service"
   - Connect your GitHub repository
   - Select the `backend` folder

2. **Configure Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3001
   DB_HOST=containers-us-west-2.railway.app
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your-generated-password
   DB_NAME=railway
   JWT_SECRET=your-super-secure-jwt-secret-key
   JWT_EXPIRES_IN=7d
   STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
   STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

3. **Configure Build Settings**
   ```json
   {
     "build": {
       "commands": ["npm install", "npm run build"]
     },
     "start": {
       "command": "npm run start:prod"
     }
   }
   ```

### 3. Frontend Deployment on Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key
   ```

## 🐳 Option 2: Docker Deployment

### 1. Create Docker Files

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### 2. Docker Compose Configuration

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: ecommerce
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DB_HOST=database
      - DB_PORT=5432
      - DB_USERNAME=postgres
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=ecommerce
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    ports:
      - "3001:3001"
    depends_on:
      - database

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001/api
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 3. Deploy with Docker

```bash
# Create production environment file
cp .env.example .env.prod

# Build and deploy
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🌊 Option 3: DigitalOcean App Platform

### 1. Create App Spec

```yaml
# .do/app.yaml
name: ecommerce-3d
services:
- name: backend
  source_dir: /backend
  github:
    repo: your-username/ecommerce-3d
    branch: main
  run_command: npm run start:prod
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  - key: STRIPE_SECRET_KEY
    value: ${STRIPE_SECRET_KEY}

- name: frontend
  source_dir: /frontend
  github:
    repo: your-username/ecommerce-3d
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NEXT_PUBLIC_API_URL
    value: ${_self.URL}/api

databases:
- name: ecommerce-db
  engine: PG
  version: "13"
```

### 2. Deploy to DigitalOcean

```bash
# Install doctl CLI
# Visit: https://github.com/digitalocean/doctl#installing-doctl

# Deploy app
doctl apps create --spec .do/app.yaml
```

## 🔧 Production Configuration

### 1. Environment Variables Checklist

#### Backend Production Variables
```env
NODE_ENV=production
PORT=3001
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-secure-db-password
DB_NAME=your-db-name
JWT_SECRET=your-super-secure-64-character-secret
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_live_your_stripe_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
FRONTEND_URL=https://your-production-domain.com
```

#### Frontend Production Variables
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_live_key
```

### 2. Database Migration

```bash
# Run migrations in production
cd backend
npm run migration:run
```

### 3. SSL/HTTPS Configuration

#### Vercel (Automatic)
- HTTPS is automatically configured

#### Custom Domain Setup
1. **Add Custom Domain**
   - Vercel: Project Settings → Domains
   - Railway: Project Settings → Custom Domain

2. **Configure DNS**
   ```
   Type: CNAME
   Name: your-subdomain (or @)
   Value: your-platform-domain
   ```

### 4. Monitoring and Logging

#### Application Monitoring
```bash
# Install monitoring tools
npm install @sentry/node @sentry/nextjs
```

#### Health Check Endpoints
```typescript
// backend/src/health/health.controller.ts
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }
}
```

### 5. Performance Optimization

#### Backend Optimization
```typescript
// Enable compression
import compression from 'compression';
app.use(compression());

// Enable caching
import rateLimit from 'express-rate-limit';
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

#### Frontend Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
}
```

## 🔒 Security Checklist

### Production Security Setup

1. **Environment Variables**
   - [ ] All secrets stored securely
   - [ ] No hardcoded credentials
   - [ ] JWT secret is 64+ characters
   - [ ] Database credentials are unique

2. **HTTPS Configuration**
   - [ ] SSL certificates installed
   - [ ] HTTP redirects to HTTPS
   - [ ] HSTS headers enabled

3. **Database Security**
   - [ ] Database not publicly accessible
   - [ ] Firewall rules configured
   - [ ] Regular backups enabled
   - [ ] Connection encryption enabled

4. **API Security**
   - [ ] Rate limiting enabled
   - [ ] CORS properly configured
   - [ ] Input validation on all endpoints
   - [ ] Authentication required for protected routes

5. **Monitoring**
   - [ ] Error tracking (Sentry)
   - [ ] Performance monitoring
   - [ ] Uptime monitoring
   - [ ] Security scanning

## 📊 Post-Deployment Steps

### 1. Verify Deployment

```bash
# Test API endpoints
curl https://your-api-domain.com/api/health

# Test frontend
curl https://your-frontend-domain.com
```

### 2. Database Seeding (Optional)

```bash
# Seed initial data
cd backend
npm run seed:prod
```

### 3. Performance Testing

```bash
# Install load testing tool
npm install -g artillery

# Run performance tests
artillery quick --count 10 --num 3 https://your-api-domain.com/api/products
```

### 4. Monitoring Setup

1. **Uptime Monitoring**
   - Pingdom, UptimeRobot, or StatusPage

2. **Error Tracking**
   - Sentry for error monitoring

3. **Performance Monitoring**
   - New Relic or DataDog

### 5. Backup Configuration

```bash
# Automated database backups
# Railway: Automatic backups enabled
# Custom: Setup cron job for pg_dump
0 2 * * * pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Database Connection Errors**
   ```
   Solution: Check DB credentials and firewall rules
   ```

2. **CORS Errors**
   ```
   Solution: Update FRONTEND_URL in backend environment
   ```

3. **Build Failures**
   ```
   Solution: Check Node.js version compatibility
   ```

4. **Memory Issues**
   ```
   Solution: Upgrade instance size or optimize bundle
   ```

### Debug Commands

```bash
# Check application logs
docker logs container-name

# Database connection test
psql $DATABASE_URL -c "SELECT version();"

# API health check
curl -f https://your-api-domain.com/api/health || exit 1
```

## 📞 Support

For deployment issues:
- Check logs first
- Review environment variables
- Test connections manually
- Contact platform support if needed

---

Happy deploying! 🚀