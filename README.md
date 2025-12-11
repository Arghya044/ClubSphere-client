# ClubSphere – Membership & Event Management for Local Clubs

## Project Purpose

ClubSphere is a full-stack MERN web application that helps people discover, join, and manage local clubs (e.g., photography clubs, hiking groups, book clubs, tech clubs). Through ClubSphere, club managers can create and manage clubs and events, and members can join clubs, pay membership fees, and register for events. An admin oversees the entire platform.

## Live URL

https://clubsphere-arghya.netlify.app

## Key Features

### For Members:
- Browse and search clubs by name and category
- Join clubs (free or paid membership via Stripe)
- Register for club events
- View membership and event registration history
- Payment history tracking
- Responsive dashboard with overview statistics

### For Club Managers:
- Create and manage club profiles
- Set membership fees (free or paid)
- Create and manage events for their clubs
- View club members and event registrations
- Dashboard with club statistics

### For Admins:
- Approve or reject club registration requests
- Promote/demote users to "Club Manager" role
- Monitor all payments and platform statistics
- Manage all users, clubs, and events
- Comprehensive admin dashboard

### Technical Features:
- Firebase Authentication (Email/Password + Google Sign-in)
- Stripe payment integration for memberships and events
- Server-side search and filtering
- Sorting capabilities (newest, oldest, fee-based)
- Token-based authentication with Firebase
- Role-based access control
- Responsive design for mobile, tablet, and desktop
- Framer Motion animations
- React Hook Form for form validation
- TanStack Query for data fetching and mutations

## Important NPM Packages Used

### Core Dependencies:
- `react` (^18.2.0) - React library
- `react-dom` (^18.2.0) - React DOM rendering
- `react-router-dom` (^6.21.3) - Client-side routing
- `axios` (^1.6.5) - HTTP client for API requests

### UI & Styling:
- `tailwindcss` (^3.4.1) - Utility-first CSS framework
- `daisyui` (^4.6.0) - Tailwind CSS component library
- `react-icons` (^5.0.1) - Icon library

### Forms & Data Management:
- `react-hook-form` (^7.49.3) - Form state management and validation
- `@tanstack/react-query` (^5.17.19) - Data fetching and caching

### Authentication & Payments:
- `firebase` (^10.7.2) - Firebase SDK for authentication
- `@stripe/stripe-js` (^2.4.0) - Stripe.js library
- `@stripe/react-stripe-js` (^2.4.0) - React components for Stripe

### Animations & UX:
- `framer-motion` (^10.18.0) - Animation library
- `react-hot-toast` (^2.4.1) - Toast notifications

### Development:
- `vite` (^7.2.6) - Build tool and dev server
- `@vitejs/plugin-react` (^4.2.1) - Vite plugin for React

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Note:** Never commit the `.env` file to version control. Use `.env.example` as a template.

## Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ClubSphere
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase and Stripe credentials

4. Start the development server:
```bash
npm run dev
```

5. For production build:
```bash
npm run build
```

## File Structure

```
ClubSphere/
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── index.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   └── vite.svg
├── README.md
├── TAILWIND_SETUP.md
├── TROUBLESHOOTING.md
├── tailwind.config.cjs
├── vite.config.js
└── src/
    ├── App.css
    ├── App.jsx
    ├── assets/
    │   └── react.svg
    ├── components/
    │   ├── ErrorBoundary.jsx
    │   ├── Footer.jsx
    │   ├── Navbar.jsx
    │   └── PrivateRoute.jsx
    ├── context/
    │   └── AuthContext.jsx
    ├── firebase/
    │   └── firebase.config.js
    ├── index.css
    ├── main.jsx
    ├── pages/
    │   ├── AdminDashboard.jsx
    │   ├── ClubDetails.jsx
    │   ├── Clubs.jsx
    │   ├── DashboardLayout.jsx
    │   ├── ErrorPage.jsx
    │   ├── EvenDetails.jsx
    │   ├── Events.jsx
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── ManagerDashboard.jsx
    │   ├── MemberDashboard.jsx
    │   ├── PaymentCancel.jsx
    │   ├── PaymentClub.jsx
    │   ├── PaymentEvent.jsx
    │   ├── PaymentSuccess.jsx
    │   ├── Profile.jsx
    │   └── Register.jsx
    └── utils/
        └── api.js
```

## Database Collections

- **users**: User accounts with roles (admin, clubManager, member)
- **clubs**: Club information and status
- **events**: Event details for clubs
- **memberships**: User-club membership relationships
- **eventRegistrations**: User event registrations
- **payments**: Payment transaction records

## Authentication

- Firebase Authentication handles user authentication
- JWT tokens stored in localStorage
- Protected routes require authentication
- Role-based access control for dashboards

## Payment Integration

- Stripe test mode integration
- Payment intents for memberships and events
- Payment history tracking
- Secure payment processing

## Deployment Notes

- Ensure environment variables are set in your hosting platform
- Add your deployed domain to Firebase authorized domains
- Configure CORS on the backend for your frontend domain
- Ensure MongoDB connection string is accessible

## Super Admin

The super admin account is automatically created on server startup:
- Email:
- Password: 

This account is created only once and can control all activities on the platform.

