# LeaseFlow - Property Management Platform

A comprehensive multi-tenant SaaS platform for property management companies, built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Features

### Multi-Tenant Architecture
- Unique subdomains for each property management company
- Isolated data and user management per tenant
- Invitation-based user onboarding system

### User Roles & Permissions
- **Super Admin**: Platform owner with full access
- **Company Owner**: Property management company owner
- **Property Manager**: Manages properties and tenants
- **Tenant**: Lease holders with limited access
- **Contractor**: Maintenance service providers
- **Accountant**: Financial management access

### Core Functionality
- **Property Management**: Add, edit, and manage property portfolios
- **Lease Management**: Create and track lease agreements
- **Tenant Management**: Comprehensive tenant profiles and communication
- **Payment Processing**: Stripe integration for rent collection
- **Maintenance Requests**: AI-powered issue categorization
- **Real-time Notifications**: Pusher integration for live updates
- **Analytics & Reporting**: Business insights and KPIs

### Technical Features
- **Progressive Web App (PWA)**: Cross-platform compatibility
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live notifications and data synchronization
- **AI Integration**: OpenAI for maintenance issue categorization
- **Secure Authentication**: NextAuth.js with JWT tokens
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI primitives
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **State Management**: Zustand
- **Real-time**: Pusher or Socket.io
- **Payments**: Stripe Connect
- **AI**: OpenAI API
- **PWA**: next-pwa
- **Deployment**: Vercel/Railway ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Real\ Estate
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Copy the example environment file and configure your variables:
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/leaseflow"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Stripe (Optional for payments)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Pusher (Optional for real-time)
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="us2"

# OpenAI (Optional for AI features)
OPENAI_API_KEY="sk-..."
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed with demo data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 🔐 Demo Credentials

After seeding the database, you can use these demo accounts:

**Company Owner**
- Email: `owner@demo.com`
- Password: `demo123`

**Property Manager**
- Email: `manager@demo.com`
- Password: `demo123`

**Tenant**
- Email: `tenant1@demo.com`
- Password: `demo123`

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── providers/        # Context providers
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks

prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Database seeding script

public/
├── manifest.json          # PWA manifest
└── icons/                # PWA icons
```

## 🎯 Key Features Implementation

### Multi-Tenant Architecture
The platform uses a shared database with tenant isolation through `companyId` foreign keys. Each company gets:
- Unique subdomain (e.g., `demo.leaseflow.com`)
- Isolated data access
- Custom branding capabilities

### Role-Based Access Control
Implemented through Prisma schema and NextAuth.js:
- Role-based route protection
- Component-level permission checks
- API endpoint authorization

### Real-time Features
Using Pusher for live updates:
- Maintenance request notifications
- Payment status changes
- Lease updates

### Payment Processing
Stripe Connect integration for:
- Automated rent collection
- Security deposit handling
- Multi-party payouts

## 🔧 Development

### Database Commands
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and apply migrations
npx prisma migrate dev

# Reset database and re-seed
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### Build Commands
```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Railway
1. Connect your GitHub repository to Railway
2. Add PostgreSQL database service
3. Configure environment variables
4. Deploy

### Environment Variables for Production
Ensure all required environment variables are set:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth.js
- `NEXTAUTH_URL`: Your production URL
- Additional service keys as needed

## 🔒 Security Features

- JWT-based authentication with NextAuth.js
- Role-based access control (RBAC)
- SQL injection protection via Prisma
- XSS protection with Content Security Policy
- CSRF protection built into Next.js
- Environment variable validation

## 📱 PWA Features

- Offline functionality
- Push notifications
- App-like experience on mobile
- Automatic updates
- Cross-platform compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the demo implementation

## 🔄 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Document management system
- [ ] Automated lease renewals
- [ ] Integration with accounting software
- [ ] Multi-language support
- [ ] White-label solutions

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.

