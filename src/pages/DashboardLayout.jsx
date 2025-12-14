import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaCreditCard,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChartBar,
  FaUserCircle,
} from 'react-icons/fa';

const DashboardLayout = () => {
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getAdminMenu = () => [
    { path: '/dashboard/admin', label: 'Overview', icon: FaChartBar },
    { path: '/dashboard/admin/users', label: 'Manage Users', icon: FaUsers },
    { path: '/dashboard/admin/clubs', label: 'Manage Clubs', icon: FaBuilding },
    { path: '/dashboard/admin/payments', label: 'Payments', icon: FaCreditCard },
  ];

  const getManagerMenu = () => [
    { path: '/dashboard/manager', label: 'Overview', icon: FaChartBar },
    { path: '/dashboard/manager/clubs', label: 'My Clubs', icon: FaBuilding },
    { path: '/dashboard/manager/events', label: 'Events', icon: FaCalendarAlt },
    { path: '/dashboard/manager/members', label: 'Members', icon: FaUsers },
  ];

  const getMemberMenu = () => [
    { path: '/dashboard/member', label: 'Overview', icon: FaChartBar },
    { path: '/dashboard/member/clubs', label: 'My Clubs', icon: FaBuilding },
    { path: '/dashboard/member/events', label: 'My Events', icon: FaCalendarAlt },
    { path: '/dashboard/member/payments', label: 'Payment History', icon: FaCreditCard },
  ];

  const getMenu = () => {
    if (userData?.role === 'admin') return getAdminMenu();
    if (userData?.role === 'clubManager') return getManagerMenu();
    return getMemberMenu();
  };

  const menuItems = getMenu();

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile Header */}
      <div className="bg-base-100 shadow-md md:hidden">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
          <Link to="/" className="text-xl font-bold">ClubSphere</Link>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-base-100 shadow-lg transition-transform duration-300`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-base-300 hidden md:block">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ClubSphere
              </Link>
            </div>

            <div className="p-4 border-b border-base-300">
              <div className="flex items-center space-x-3">
                <img
                  src={userData?.photoURL || 'https://i.ibb.co/2yfvQvz/admin-avatar.png'}
                  alt={userData?.name || 'User'}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    e.target.src = 'https://i.ibb.co/2yfvQvz/admin-avatar.png';
                  }}
                />
                <div>
                  <p className="font-semibold">{userData?.name || 'User'}</p>
                  <p className="text-sm text-base-content/70 capitalize">{userData?.role || 'Member'}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                      isActive
                        ? 'bg-primary text-primary-content'
                        : 'hover:bg-base-200'
                    }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-base-300">
              <Link
                to="/"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-200 transition mb-2"
              >
                <FaHome />
                <span>Back to Home</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-200 transition w-full text-left"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-auto min-w-0">
          <div className="min-w-[280px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

