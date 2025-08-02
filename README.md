# OopsiPay - Digital Wallet Management Backend

A comprehensive digital wallet management system built with Node.js, Express.js, TypeScript, and MongoDB. This backend API provides secure financial transaction capabilities including cash-in, cash-out, send money, and comprehensive user management.

## 🌟 Features

### Core Features

- **User Management**: Complete user registration, authentication, and profile management
- **Digital Wallet**: Secure wallet creation and management for users, agents, merchants, and admins
- **Financial Transactions**:
  - Cash In (no fees)
  - Cash Out (1.85% fee with agent commission)
  - Send Money (5 Taka flat fee)
  - Admin Credit transactions
- **Role-Based Access Control**: Support for Users, Agents, Admins, and Super Admins
- **OTP Verification**: Email-based OTP system for secure operations
- **Statistics Dashboard**: Comprehensive analytics for users and transactions
- **File Upload**: Cloudinary integration for profile pictures
- **Security**: JWT-based authentication with refresh tokens

### Technical Features

- **TypeScript**: Full type safety and modern JavaScript features
- **MongoDB**: NoSQL database with Mongoose ODM
- **Redis**: Caching and session management
- **Email Service**: SMTP integration for notifications
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error management
- **Logging**: Morgan HTTP request logging
- **CORS**: Cross-origin resource sharing configuration

## Quick Start

### Prerequisites

- Node.js
- MongoDB
- Redis
- pnpm (package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Nahid-Mahmud/OopsiPay-Backend.git
   cd OopsiPay-Backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Configure the following environment variables in `.env`:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/digital_wallet_management

   # Super Admin Configuration
   SUPER_ADMIN_EMAIL=admin@oopsipay.com
   SUPER_ADMIN_PASSWORD=your_secure_password
   SUPER_ADMIN_PIN=123456
   SUPER_ADMIN_ADDRESS=Admin Address

   # JWT Configuration
   ACCESS_TOKEN_JWT_SECRET=your_access_token_secret
   ACCESS_TOKEN_JWT_EXPIRATION=1d
   REFRESH_TOKEN_JWT_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_JWT_EXPIRATION=30d

   # Session
   EXPRESS_SESSION_SECRET=your_session_secret

   # Frontend URL
   FRONTEND_URL=http://localhost:5173

   # Cloudinary (for file uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email Configuration
   SMTP_PASS=your_email_password
   SMTP_USER=your_email@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_FROM=your_email@gmail.com

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_USERNAME=your_redis_username
   REDIS_PASSWORD=your_redis_password

   # Security
   BCRYPT_SALT_ROUNDS=10
   ```

4. **Start the development server**

   ```bash
   pnpm run dev
   ```

5. **Build for production**
   ```bash
   pnpm run build
   pnpm start
   ```


## **Make sure to add template folder from utils to dist --> utils**


## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

## **[Postman Documentation](https://documenter.getpostman.com/view/30562539/2sB3BALsbp#intro)**


## 🏗️ Project Structure

```
src/
├── app.ts                          # Express app configuration
├── server.ts                       # Server startup and database connection
└── app/
    ├── config/                     # Configuration files
    │   ├── cloudinary.config.ts    # Cloudinary setup
    │   ├── env.ts                  # Environment variables
    │   ├── multer.config.ts        # File upload configuration
    │   ├── passport.ts             # Passport.js setup
    │   └── redis.config.ts         # Redis configuration
    ├── constants/                  # Application constants
    ├── errorHelpers/               # Error handling utilities
    ├── interfaces/                 # TypeScript interfaces
    ├── middlewares/                # Express middlewares
    │   ├── checkAuth.ts           # Authentication middleware
    │   ├── globalErrorHandler.ts  # Global error handler
    │   ├── notFound.ts            # 404 handler
    │   └── validateRequest.ts     # Request validation
    ├── modules/                    # Feature modules
    │   ├── auth/                  # Authentication module
    │   ├── otp/                   # OTP verification module
    │   ├── stats/                 # Statistics module
    │   ├── transactions/          # Transaction module
    │   ├── user/                  # User management module
    │   └── wallet/                # Wallet management module
    ├── routes/                    # Route definitions
    └── utils/                     # Utility functions
        ├── calculateTransactionFee.ts
        ├── generateOtp.ts
        ├── hashPassword.ts
        ├── jwt.ts
        ├── sendEmail.ts
        └── templates/             # Email templates
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable salt rounds
- **Input Validation**: Zod schema validation for all endpoints
- **Rate Limiting**: Built-in protection against abuse
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Sensitive data protection
- **Role-Based Access**: Granular permission system

## 👥 User Roles

### User Roles Hierarchy

1. **Super Admin**

   - Full system access
   - Can manage all users and transactions
   - System configuration capabilities

2. **Admin**

   - Can manage users and view all transactions
   - Cannot modify system configuration
   - Can credit wallets

3. **Agent**

   - Can perform cash-in/cash-out operations
   - Earns commission from transactions
   - Limited user management

4. **User**
   - Can send money and perform basic transactions
   - Can update own profile
   - View own transaction history


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.


**OopsiPay** - Making digital payments simple and secure! 💳✨
