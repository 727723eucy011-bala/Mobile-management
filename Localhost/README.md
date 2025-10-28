# Subscription Management System

A full-stack subscription management system with role-based access control (RBAC) using Spring Boot and React.

## Features

### Security & Authentication
- JWT-based authentication
- Role-based access control (USER/ADMIN)
- Secure password hashing with BCrypt
- Protected API endpoints with Spring Security

### User Features
- User registration and login
- View available subscription plans
- Create new subscriptions
- View subscription history
- Cancel active subscriptions
- Manage customer profile

### Admin Features
- Admin registration and login
- Plan management (CRUD operations)
- User management
- View all subscriptions
- View all transactions
- System oversight and monitoring

## Technology Stack

### Backend
- Spring Boot 3.0.1
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Lombok for boilerplate reduction

### Frontend
- React 18
- Modern JavaScript (ES6+)
- CSS3 with responsive design
- Fetch API for HTTP requests

## API Endpoints

### Authentication
- `POST /auth/register/user` - Register new user
- `POST /auth/register/admin` - Register new admin
- `POST /auth/login` - Login (returns JWT token)
- `POST /auth/logout` - Logout

### Plans (Public access for viewing)
- `GET /plan` - Get all plans
- `GET /plan/{planId}` - Get plan by ID
- `POST /plan` - Create plan (Admin only)
- `PUT /plan/{planId}` - Update plan (Admin only)
- `DELETE /plan/{planId}` - Delete plan (Admin only)

### Subscriptions
- `POST /subscription` - Create subscription (User only)
- `GET /subscription/user/{userId}` - Get user subscriptions
- `GET /subscription/{subscriptionId}` - Get subscription details
- `PUT /subscription/{subscriptionId}/cancel` - Cancel subscription

### Customer Profiles
- `GET /customer/{userId}` - Get customer profile
- `PUT /customer/{userId}` - Update customer profile

### Transactions
- `POST /transaction` - Create transaction (User only)
- `GET /transaction/user/{userId}` - Get user transactions
- `GET /transaction/{transactionId}` - Get transaction details

### Admin Operations
- `GET /admin/users` - Get all users (Admin only)
- `DELETE /admin/user/{userId}` - Delete user (Admin only)
- `PUT /admin/user/role/{userId}` - Update user role (Admin only)
- `GET /admin/customers` - Get all customers (Admin only)
- `GET /admin/subscriptions` - Get all subscriptions (Admin only)
- `GET /admin/transactions` - Get all transactions (Admin only)

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Backend Setup

1. **Database Setup**
   ```sql
   CREATE DATABASE appdb;
   ```

2. **Configure Database**
   Update `springapp/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/appdb?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

3. **Run Backend**
   ```bash
   cd springapp
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd reactapp
   npm install
   ```

2. **Start Development Server**
   ```bash
   PORT=8081 npm start
   ```

   The frontend will start on `http://localhost:8081`

## Default Credentials

The system initializes with sample data:

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### User Account
- Email: `user@example.com`
- Password: `user123`

## Security Implementation

### JWT Authentication
- Tokens include user ID, email, and role
- 5-hour token expiration
- Secure token validation on each request

### Role-Based Access Control
- `@PreAuthorize` annotations on controller methods
- Route-level security in Spring Security configuration
- Frontend role-based component rendering

### Password Security
- BCrypt hashing with salt
- Secure password validation

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `role` (USER/ADMIN)

### Customers Table
- `user_id` (Primary Key, Foreign Key to Users)
- `name`
- `address`
- `mobile_number`

### Plans Table
- `plan_id` (Primary Key)
- `plan_name`
- `price` (Decimal)
- `duration` (Integer, days)
- `description`

### Subscriptions Table
- `subscription_id` (Primary Key)
- `user_id` (Foreign Key)
- `plan_id` (Foreign Key)
- `start_date`
- `end_date`
- `status` (ACTIVE/CANCELLED/EXPIRED)

### Transactions Table
- `transaction_id` (Primary Key)
- `subscription_id` (Foreign Key)
- `amount` (Decimal)
- `transaction_date`
- `payment_method`
- `status` (SUCCESS/FAILED/PENDING)

## Development Notes

### CORS Configuration
- Configured for localhost development
- Update for production deployment

### Error Handling
- Global exception handling in backend
- User-friendly error messages in frontend

### Data Validation
- Backend validation with Spring Validation
- Frontend form validation

## Production Deployment

1. **Backend**
   - Update database configuration
   - Configure JWT secret key
   - Set up HTTPS
   - Configure CORS for production domain

2. **Frontend**
   - Update API base URL
   - Build production bundle: `npm run build`
   - Deploy to web server

## Testing

### Backend Testing
```bash
cd springapp
mvn test
```

### Frontend Testing
```bash
cd reactapp
npm test
```

## License

This project is for educational purposes.