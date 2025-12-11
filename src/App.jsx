import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Clubs from './pages/Clubs';
import ClubDetails from './pages/ClubDetails';
import Events from './pages/Events';
import EventDetails from './pages/EvenDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ErrorPage from './pages/ErrorPage';
import Profile from './pages/Profile';
import PaymentClub from './pages/PaymentClub';
import PaymentEvent from './pages/PaymentEvent';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

function App() {
  console.log('✅ App component rendered');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/payment/club/:membershipId"
            element={
              <PrivateRoute>
                <PaymentClub />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment/event/:registrationId"
            element={
              <PrivateRoute>
                <PaymentEvent />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <PrivateRoute>
                <PaymentSuccess />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment-cancel"
            element={
              <PrivateRoute>
                <PaymentCancel />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          
          {/* Dashboard Routes */}
          <Route
            path="/dashboard/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminDashboard />} />
            <Route path="clubs" element={<AdminDashboard />} />
            <Route path="payments" element={<AdminDashboard />} />
          </Route>

          <Route
            path="/dashboard/manager"
            element={
              <PrivateRoute allowedRoles={['clubManager']}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<ManagerDashboard />} />
            <Route path="clubs" element={<ManagerDashboard />} />
            <Route path="events" element={<ManagerDashboard />} />
            <Route path="members" element={<ManagerDashboard />} />
          </Route>

          <Route
            path="/dashboard/member"
            element={
              <PrivateRoute allowedRoles={['member', 'clubManager', 'admin']}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<MemberDashboard />} />
            <Route path="clubs" element={<MemberDashboard />} />
            <Route path="events" element={<MemberDashboard />} />
            <Route path="payments" element={<MemberDashboard />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;

