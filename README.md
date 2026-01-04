# 📦 Anything.ai - Inventory Management System

A full-stack Inventory Management Application featuring a modern, responsive frontend and a robust, secure backend. Designed for seamless product management and user purchasing flows.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg](https://anything-backend-role.onrender.com/)

## 🚀 Features

-   **User Authentication**: Secure JWT-based login and registration (User & Admin roles).
-   **Dashboard**: Dynamic product grid with animations and responsive design.
-   **Product Management** (Admin): Add, Edit, and Delete products with ease.
-   **Shopping Experience** (User): Browse products, view details, and purchase items with real-time stock updates.
-   **Checkout Flow**: Dedicated checkout page with quantity selection and order summary.
-   **Containerized**: Fully dockerized for easy deployment.

---
## �️ Security Features

The backend is hardened against common web vulnerabilities using industry-standard practices:

-   **Helmet.js**: Sets secure HTTP headers (e.g., Content-Security-Policy, X-Frame-Options) to protect against common attacks.
-   **Express Rate Limit**: Prevents DDoS and brute-force attacks by limiting the number of API requests (100 msgs / 15 mins).
-   **HPP (HTTP Parameter Pollution)**: Protects against parameter pollution attacks by preventing abuse of array parameters in URL query strings.
-   **XSS Protection**: Inputs are sanitized to prevent Cross-Site Scripting (XSS) attacks.
-   **JWT Authentication**: Stateless, secure user sessions via JSON Web Tokens.
-   **Role-Based Access Control (RBAC)**: Strict `admin` vs `user` permission checks on all sensitive endpoints.
-   **Body Limit**: Payload size restricted to 10kb to prevent server overload.

---

## 🛠️ Tech Stack

### Frontend
-   **React (Vite)**: Fast, modern UI development.
-   **Tailwind CSS**: Utility-first styling for a premium look.
-   **GSAP**: Smooth animations for page transitions and interactions.
-   **Axios**: Efficient API communication.
-   **Lucide React**: Beautiful, consistent icons.

### Backend
-   **Node.js & Express**: High-performance server environment.
-   **PostgreSQL**: Reliable relational database.
-   **Sequelize ORM**: Schema modeling and database interactions.
-   **Redis (Upstash)**: Caching for improved performance.
-   **New Relic**: Application performance monitoring.

---

## ⚙️ Installation & Setup

### Option 1: Docker (Recommended)

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd Anything.ai
    ```

2.  **Set up Environment Variables**:
    *   Create a `.env` file in `backend-assignment/` (see `.env.example` or use the provided keys).
    *   Ensure your Docker Compose secrets are configured if running in CI/CD.

3.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
4.  **Access the App**:
    *   Frontend: `http://localhost:3000`
    *   Backend API: `http://localhost:5000`

### Option 2: Local Development

**Backend**:
```bash
cd backend-assignment
npm install
npm run dev
```

**Frontend**:
```bash
cd frontend-assignment
npm install
npm run dev
```

---

## 🔌 API Documentation

### 1. Authentication
*   **POST** `/api/auth/register`
*   **POST** `/api/auth/login`

**Response Example (Login)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Products

#### Get All Products
*   **GET** `/api/products`
*   **Access**: Public

**Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 101,
      "name": "Wireless Headphones",
      "price": "199.99",
      "stock": 45,
      "ProductLogo": "https://example.com/img.jpg"
    }
  ]
}
```

#### Get Single Product
*   **GET** `/api/products/:id`
*   **Access**: Protected (User/Admin)

#### Checkout (Buy Product)
*   **POST** `/api/products/:id/checkout`
*   **Access**: Protected (User)
*   **Body**: `{ "quantity": 2 }`

**Response**:
```json
{
  "success": true,
  "message": "Purchase successful",
  "newStock": 43
}
```

#### Admin Operations
*   **POST** `/api/products` (Create)
*   **PUT** `/api/products/:id` (Update)
*   **DELETE** `/api/products/:id` (Delete)

---

## 🔒 Environment Variables

Ensure you have the following variables in your `backend-assignment/.env`:

```env
PORT=5000
DATABASE_URL=postgres://user:pass@host:5432/db
JWT_SECRET=your_super_secret_key
ADMIN_SECRET_KEY=your_admin_secret
REDIS_URL=rediss://...
```

---




