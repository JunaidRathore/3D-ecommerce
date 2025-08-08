# 3D eCommerce Platform

A modern, full-stack eCommerce application featuring interactive 3D product visualization, built with React.js, Next.js, Nest.js, TypeScript, and Three.js.

## 🚀 Features

### Core Features
- **3D Product Visualization**: Interactive 3D models with rotation, zoom, and detailed views
- **User Authentication**: JWT-based secure authentication system
- **Product Catalog**: Advanced search, filtering, and categorization
- **Shopping Cart**: Real-time cart management with persistence
- **Order Management**: Complete order lifecycle management
- **Payment Integration**: Secure payments via Stripe
- **Responsive Design**: Mobile-first, modern UI design
- **Admin Dashboard**: Product and order management (planned)

### Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Real-time Updates**: Live cart and inventory updates
- **SEO Optimized**: Server-side rendering with Next.js
- **API Documentation**: Auto-generated Swagger documentation
- **Database Relations**: Efficient PostgreSQL schema design
- **Error Handling**: Comprehensive error management
- **Security**: Input validation, CORS, and secure headers

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - 3D graphics and animations
- **React Three Fiber** - React renderer for Three.js
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form management and validation
- **Framer Motion** - Animation library

#### Backend
- **Nest.js** - Progressive Node.js framework
- **TypeScript** - Type safety and developer experience
- **TypeORM** - Object-relational mapping
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Token authentication
- **Passport** - Authentication middleware
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing
- **class-validator** - Input validation

#### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **Cypress** - End-to-end testing

## 📦 Project Structure

```
ecommerce-3d/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # Reusable React components
│   │   │   ├── ui/          # Basic UI components
│   │   │   ├── layout/      # Layout components
│   │   │   └── 3d/          # Three.js components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and API client
│   │   ├── store/           # Zustand state management
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Nest.js backend application
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # User management module
│   │   ├── products/        # Product catalog module
│   │   ├── cart/            # Shopping cart module
│   │   ├── orders/          # Order management module
│   │   ├── payments/        # Payment processing module
│   │   ├── database/        # Database configuration
│   │   └── common/          # Shared utilities
│   └── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-3d
```

### 2. Database Setup
```bash
# Install PostgreSQL and create database
createdb ecommerce

# Or using PostgreSQL command line
psql -U postgres
CREATE DATABASE ecommerce;
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys

# Start the development server
npm run start:dev
```

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your API URLs

# Start the development server
npm run dev
```

## 🔑 Environment Variables

### Backend (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production Build
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Product Endpoints
- `GET /api/products` - Get products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PATCH /api/cart/item/:id` - Update cart item
- `DELETE /api/cart/item/:id` - Remove cart item

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### Payment Endpoints
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

## 🧪 Testing

### Unit Tests
```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

### End-to-End Tests
```bash
cd frontend
npm run cypress:open
```

## 🚀 Deployment

### Database Migration
```bash
cd backend
npm run migration:run
```

### Docker Deployment (Optional)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Vercel Deployment (Frontend)
```bash
cd frontend
vercel --prod
```

### Heroku Deployment (Backend)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

## 🔒 Security Considerations

- **Authentication**: JWT tokens with secure expiration
- **Input Validation**: Comprehensive validation using class-validator
- **CORS**: Configured for specific domains
- **Environment Variables**: Sensitive data stored securely
- **SQL Injection**: Protected via TypeORM parameterized queries
- **Password Hashing**: bcrypt with salt rounds
- **HTTPS**: Required for production deployment

## 🎨 Design System

### Color Palette
- Primary: `#4F46E5` (Indigo)
- Secondary: `#F3F4F6` (Gray)
- Success: `#10B981` (Emerald)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

### Typography
- Font Family: Inter (system font fallback)
- Heading Scale: 2xl, xl, lg, base
- Font Weights: 400, 500, 600, 700

### Components
- Consistent spacing using 4px grid system
- Rounded corners with 0.5rem radius
- Shadow system for depth and hierarchy
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write unit tests for new features
- Use semantic commit messages
- Update documentation for API changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Real-time chat support
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced admin dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced 3D model editor

### Phase 3 Features
- [ ] AI-powered product recommendations
- [ ] Augmented Reality (AR) integration
- [ ] Social commerce features
- [ ] Advanced analytics dashboard
- [ ] Multi-vendor marketplace
- [ ] Subscription products
- [ ] Advanced inventory management

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@ecommerce3d.com
- Documentation: [docs.ecommerce3d.com](https://docs.ecommerce3d.com)

## 👏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Nest.js](https://nestjs.com/) - Node.js framework
- [Three.js](https://threejs.org/) - 3D library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TypeORM](https://typeorm.io/) - Database ORM
- [Stripe](https://stripe.com/) - Payment processing

---

Built with ❤️ using modern web technologies