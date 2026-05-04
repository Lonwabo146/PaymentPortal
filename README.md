
# Payment Portal

A full-stack payment processing application built with ASP.NET Core 10 and React 19, featuring secure user authentication, role-based authorization, and international payment processing via SWIFT.

## Features

### Backend (ASP.NET Core 10)
- **User Authentication**: Secure registration and login with JWT tokens
- **Password Security**: BCrypt hashing with workFactor 12 for enhanced security
- **Role-Based Authorization**: Support for Customer roles (Employee role to be added later)
- **Payment Processing**: Submit and manage international payments with SWIFT integration
- **Input Validation**: Comprehensive whitelist-based validation on all user inputs
- **Rate Limiting**: DDoS protection with configurable rate limits 
- **Database**: SQL Server with Entity Framework Core migrations

### Frontend (React 19 with Vite)
- **Modern UI**: Built with React 19 and Vite for fast development
- **Routing**: React Router for seamless navigation
- **API Integration**: Axios for HTTP requests with JWT authentication
- **Responsive Design**: Mobile-friendly interface

## Project Structure

```
PaymentPortal/
├── Controllers/
│   ├── AuthController.cs          # User registration and login endpoints
│   └── PaymentController.cs        # Payment submission and management
├── Data/
│   ├── ApplicationDbContext.cs      # EF Core database context
├── DTOs/
│   ├── LoginDto.cs
│   ├── RegisterDto.cs
│   └── PaymentDto.cs
├── Migrations/                      # Database migrations
├── Models/
│   ├── User.cs                     # User entity with roles
│   └── Payments.cs                 # Payment entity with SWIFT details
├── payment-portal-client/          # React frontend
│   ├── src/
│   │   ├── Components/             # React components
│   │   ├── Pages/                  # Page components
│   │   ├── API/                    # API integration
│   │   └── App.jsx                 # Main app component
│   └── vite.config.js              # Vite configuration
├── Services/
│   ├── AuthService.cs              # JWT token generation and password hashing
│   └── ValidationService.cs        # Input validation rules
├── Program.cs                       # Application entry point
└── PaymentPortal.csproj            # Project configuration

```

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 10.0
- **Database**: SQL Server with Entity Framework Core 10.0.7
- **Authentication**: JWT Bearer tokens with custom validation
- **Security**: 
  - BCrypt.Net-Next for password hashing
  - AspNetCoreRateLimit for DDoS protection
- **API Documentation**: OpenAPI support

### Frontend
- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.0.0
- **Routing**: React Router DOM 7.0.0
- **HTTP Client**: Axios 1.7.0
- **Language**: JavaScript ES Module

## Setup Instructions

### Prerequisites
- .NET 10 SDK
- Node.js 18+ and npm
- SQL Server (local or remote)

### Backend Setup

1. **Configure Database Connection**
   - Update `appsettings.json` with your SQL Server connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=PaymentPortal;Trusted_Connection=true;"
   }
   ```

2. **Configure JWT Settings**
   - Add JWT configuration to `appsettings.json`:
   ```json
   "Jwt": {
     "Issuer": "your-issuer",
     "Audience": "your-audience",
     "Key": "your-secret-key-min-32-characters"
   }
   ```

3. **Apply Database Migrations**
   ```powershell
   dotnet ef database update
   ```

4. **Run the Backend**
   ```powershell
   dotnet run
   ```
   The API will be available at `https://localhost:5001`

### Frontend Setup

1. **Navigate to Client Directory**
   ```powershell
   cd payment-portal-client
   ```

2. **Install Dependencies**
   ```powershell
   npm install
   ```

3. **Run Development Server**
   ```powershell
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Build for Production**
   ```powershell
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Payments (Requires JWT Authentication)
- `POST /api/payment` - Submit a new payment (Customer role)
- `GET /api/payment` - Retrieve payment history (Requires role authorization)

## Security Features

- **Password Hashing**: BCrypt with workFactor 12
- **JWT Tokens**: Configurable expiration and validation
- **Input Validation**: Whitelist-based validation for:
  - Full names
  - ID numbers
  - Account numbers
  - Payment amounts and currencies
  - SWIFT codes
- **Rate Limiting**: 60 requests per minute per IP address
- **Role-Based Access Control**: Customer vs Employee permissions

## Data Models

### User
- `Id` - Primary key
- `FullName` - Customer's full name
- `IdNumber` - Government-issued ID
- `AccountNumber` - Bank account number
- `PasswordHash` - BCrypt hashed password
- `Role` - "Customer" or "Employee" (Customer only for now)

### Payments
- `Id` - Primary key
- `CustomerId` - Foreign key to User
- `Amount` - Payment amount (decimal)
- `Currency` - ISO 4217 currency code
- `Provider` - Payment provider (currently "SWIFT")
- `RecipientAccount` - Recipient's account number
- `SwiftCode` - SWIFT code for international transfers
- `Status` - "Pending", "Verified", or "Submitted"
- `CreatedAt` - Payment creation timestamp

## Database Migrations

The project includes migrations for:
1. **InitialCreate**: Initial schema creation
2. **FixAmountPrecision**: Decimal precision adjustment for payment amounts

Run migrations with:
```powershell
dotnet ef database update
```

## Development

### Recommended Tools
- Visual Studio Code and Visual Studio 2026
- SQL Server Management Studio (for database management)
- Postman or VS Code REST Client for API testing

### Environment Configurations
- **Development**: `appsettings.Development.json` (includes detailed logging)
- **Production**: `appsettings.json`
