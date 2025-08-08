# Getting Started - 3D eCommerce Platform

Welcome to the 3D eCommerce Platform! This guide will get you up and running quickly.

## ⚡ Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- Git installed

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd ecommerce-3d

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup
```bash
# Create database
createdb ecommerce

# Copy environment files
cd backend
cp .env.example .env  # Edit with your database credentials
cd ../frontend
cp .env.local.example .env.local  # Edit with API URL
```

### 3. Start the Applications
```bash
# Terminal 1 - Start backend
cd backend
npm run start:dev

# Terminal 2 - Start frontend  
cd frontend
npm run dev
```

### 4. Open Your Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## 🐳 Docker Quick Start (Alternative)

If you prefer Docker:

```bash
# Start everything with Docker Compose
docker-compose up --build

# That's it! Everything runs automatically:
# - PostgreSQL database
# - Backend API
# - Frontend app
```

## 🎯 What You Get

### Immediate Features
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ 3D product visualization with Three.js
- ✅ User authentication (register/login)
- ✅ Product catalog with search and filtering
- ✅ Shopping cart functionality
- ✅ Secure API with TypeScript
- ✅ PostgreSQL database with TypeORM

### Next Steps
1. **Add Products**: Use the API to add your first products
2. **Configure Stripe**: Add your Stripe keys for payments
3. **Customize UI**: Modify the design to match your brand
4. **Deploy**: Follow the deployment guide for production

## 📁 Key Files to Know

```
ecommerce-3d/
├── README.md              # Full documentation
├── DEPLOYMENT.md          # Production deployment guide
├── docker-compose.yml     # Local development with Docker
├── backend/
│   ├── src/main.ts        # Backend entry point
│   ├── .env               # Backend environment variables
│   └── src/app.module.ts  # Main app configuration
└── frontend/
    ├── src/app/page.tsx   # Homepage
    ├── .env.local         # Frontend environment variables
    └── src/components/    # UI components
```

## 🎨 First Customizations

### 1. Update Branding
```typescript
// frontend/src/components/layout/header.tsx
<span className="text-xl font-bold">Your Brand Name</span>
```

### 2. Add Your First Product
```bash
# POST to http://localhost:3001/api/products
{
  "name": "Sample Product",
  "description": "A great product",
  "price": 29.99,
  "stock": 100,
  "category": "electronics",
  "images": ["https://example.com/image.jpg"]
}
```

### 3. Configure Payments
```bash
# In backend/.env
STRIPE_SECRET_KEY=sk_test_your_key_here

# In frontend/.env.local  
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

## 🛠️ Development Commands

### Backend
```bash
cd backend
npm run start:dev    # Development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
```

### Frontend
```bash
cd frontend
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Start production build
npm run lint         # Lint code
```

## 🔧 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=ecommerce
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_your_key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Make sure PostgreSQL is running
brew services start postgresql  # macOS
sudo service postgresql start   # Linux
```

**Port Already in Use**
```bash
# Kill process using port 3000 or 3001
lsof -ti:3000 | xargs kill
lsof -ti:3001 | xargs kill
```

**Module Not Found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- **Full Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Documentation**: http://localhost:3001/api (when running)
- **Component Docs**: Check `frontend/src/components/`

## 🎯 Next Steps

1. **Explore the Code**: Browse the well-organized codebase
2. **Add Features**: Check the roadmap in README.md
3. **Deploy**: Use the deployment guide for production
4. **Contribute**: Follow the contributing guidelines

## 🆘 Need Help?

- 📖 Check the full [README.md](README.md) documentation
- 🐛 Found a bug? Create an issue on GitHub
- 💬 Need support? Check the discussions section

---

Happy coding! 🚀 Your 3D eCommerce platform is ready to go!