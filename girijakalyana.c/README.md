
# Girijakalyana

## Project Overview
Girijakalyana is a comprehensive matrimonial web and mobile application designed to help users find their perfect life partner. The platform offers a modern, user-friendly interface with advanced matchmaking features, membership plans, and secure payment integration.

## Links

### Repository
- **Backend GitHub**: [Girijakalyana-Backend](https://github.com/ornateinteriord/Girijakalyana-Backend)

### Live Deployment
- **Live Website**: [www.girijakalyana.com](https://www.girijakalyana.com/)

## Features

### User Features
- **User Registration & Authentication** - Secure sign-up and login with JWT-based authentication
- **Profile Management** - Create and manage detailed matrimonial profiles
- **Advanced Search** - Find matches based on various criteria
- **My Matches** - View compatible profiles based on preferences
- **Interest System** - Send and receive interest requests from potential matches
- **Membership Plans** - Multiple subscription tiers with different benefits
- **Secure Payments** - Integrated Cashfree payment gateway

### Admin Features
- **Admin Dashboard** - Comprehensive dashboard for platform management
- **User Management** - Manage user accounts and profiles
- **Image Verification** - Verify user profile images
- **Payment Tracking** - Monitor payments, renewals, and incomplete transactions
- **Reports & Analytics** - Generate reports on platform activity
- **Notification Management** - Send and manage user notifications

### Promoter Features
- **Promoter Dashboard** - Dedicated dashboard for promoters
- **Referral System** - Invite and track referred users
- **Earnings Tracking** - View and manage promoter earnings

## Tech Stack

### Frontend
- **React 18** - Core UI library
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Component library for modern UI design
- **React Router DOM** - Client-side routing
- **TanStack React Query** - Server state management
- **Axios** - HTTP client for API calls
- **Framer Motion** - Animation library
- **SCSS/Sass** - Styling
- **Notistack & React Toastify** - Toast notifications
- **React Slick & Swiper** - Carousel/slider components
- **Day.js** - Date manipulation
- **Socket.io Client** - Real-time communication

### Mobile (Hybrid)
- **Capacitor** - Cross-platform native runtime
- **iOS Support** - Native iOS app via Capacitor
- **Android Support** - Native Android app via Capacitor

### Payment Integration
- **Cashfree Payments** - Secure payment processing

## Project Structure
```
src/
├── components/
│   ├── Admin/          # Admin dashboard and management
│   ├── Userprofile/    # User profile and dashboard
│   ├── PromotersDash/  # Promoter dashboard
│   ├── Payments/       # Payment components
│   ├── api/            # API integration hooks
│   ├── common/         # Reusable components
│   ├── navbar/         # Navigation components
│   ├── footer/         # Footer components
│   └── ...
├── assets/             # Static assets
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd girijakalyana.c

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Mobile Development
```bash
# Build web assets
npm run build

# Sync with native projects
npx cap sync

# Open iOS project
npx cap open ios

# Open Android project
npx cap open android
```

## Deployment
- **Web**: Deployed on Vercel
- **Mobile**: iOS App Store & Google Play Store

## Contact & Support
For issues or inquiries, please visit the [GitHub repository](https://github.com/ornateinteriord/Girijakalyana-Backend).

## License
This project is proprietary software. All rights reserved.
