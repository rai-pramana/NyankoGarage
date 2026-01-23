# 🚗 NyankoGarage

A modern **Garage Management System** built with Next.js and NestJS. Manage products, inventory, transactions, and users with a beautiful, responsive interface and real-time updates.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)

## ✨ Features

### 📦 Product Management
- Create, edit, and delete products
- Track cost and selling prices
- Categorize products (Fluids, Brakes, Filters, etc.)
- Set minimum stock levels for alerts

### 📊 Inventory Management
- Real-time stock tracking
- Stock adjustment with movement history
- Low stock and out-of-stock alerts
- Batch inventory operations

### 💰 Transaction Management
- Create sales and purchase transactions
- Multi-item transactions
- Status workflow (Draft → Completed/Canceled)
- Automatic stock updates on completion

### 📈 Dashboard & Reports
- Today's revenue and orders
- Low stock alerts
- Recent transactions
- Sales, inventory, and profit reports
- Export to CSV

### 👤 User Management
- Role-based access (Owner, Admin, Staff, Warehouse)
- User creation and management
- Profile management
- Password change

### 🔐 Authentication
- Secure JWT authentication
- Remember me functionality
- Forgot password / Reset password flow
- Session management

### ⚡ Real-Time Updates
- WebSocket integration for live updates
- Changes sync across all connected clients
- No manual refresh needed

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client

### Backend
- **Framework:** NestJS 11
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + Passport
- **Real-time:** Socket.io

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rai-pramana/NyankoGarage.git
   cd NyankoGarage
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Generate Prisma client and push schema
   npx prisma generate
   npx prisma db push
   
   # (Optional) Seed database
   npx prisma db seed
   
   # Start development server
   npm run start:dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Create .env.local (optional for local dev)
   # NEXT_PUBLIC_API_URL=http://localhost:3001/api
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nyankogarage"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"
```

#### Frontend (.env.local)
```env
# Optional - defaults to localhost:3001 in development
NEXT_PUBLIC_API_URL="https://your-api-url.com/api"
```

## 📁 Project Structure

```
NyankoGarage/
├── backend/                 # NestJS API
│   ├── prisma/             # Database schema & migrations
│   │   └── schema.prisma
│   └── src/
│       ├── modules/        # Feature modules
│       │   ├── auth/
│       │   ├── products/
│       │   ├── inventory/
│       │   ├── transactions/
│       │   ├── users/
│       │   ├── dashboard/
│       │   └── reports/
│       ├── events/         # WebSocket gateway
│       └── prisma/         # Database service
│
├── frontend/               # Next.js App
│   └── src/
│       ├── app/           # App Router pages
│       ├── components/    # Reusable components
│       ├── hooks/         # Custom hooks
│       ├── lib/           # Utilities & API client
│       └── stores/        # Zustand stores
│
└── render.yaml            # Render deployment config
```

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Backend (Render)
1. Connect your GitHub repository to Render
2. Use the included `render.yaml` for configuration
3. Set environment variables: `DATABASE_URL`, `JWT_SECRET`
4. Deploy

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| GET | `/products` | List products |
| POST | `/products` | Create product |
| GET | `/inventory` | List inventory |
| POST | `/inventory/adjust` | Adjust stock |
| GET | `/transactions` | List transactions |
| POST | `/transactions` | Create transaction |
| GET | `/dashboard/stats` | Dashboard statistics |
| GET | `/reports/sales` | Sales report |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and unlicensed.

## 👤 Author

**Rai Pramana**
- GitHub: [@rai-pramana](https://github.com/rai-pramana)

---

Made with ❤️ and ☕
