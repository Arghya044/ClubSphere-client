
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardPath = () => {
    if (!userData) return '/dashboard/member';
    if (userData.role === 'admin') return '/dashboard/admin';
    if (userData.role === 'clubManager') return '/dashboard/manager';
    return '/dashboard/member';
  };

  return (
    <nav className="bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ClubSphere
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <Link to="/clubs" className="hover:text-primary transition">Clubs</Link>
            <Link to="/events" className="hover:text-primary transition">Events</Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:text-primary transition"
                >
                  <img
                    src={userData?.photoURL || user.photoURL || 'https://i.ibb.co/2yfvQvz/admin-avatar.png'}
                    alt={userData?.name || 'User'}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.target.src = 'https://i.ibb.co/2yfvQvz/admin-avatar.png';
                    }}
                  />
                  <span className="hidden lg:block">{userData?.name || 'User'}</span>
                  <FaUserCircle className="text-xl" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-300 py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-base-200 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to={getDashboardPath()}
                      className="block px-4 py-2 hover:bg-base-200 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-base-200 transition flex items-center space-x-2"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-base-300">
            <Link to="/" className="block py-2 hover:text-primary transition">Home</Link>
            <Link to="/clubs" className="block py-2 hover:text-primary transition">Clubs</Link>
            <Link to="/events" className="block py-2 hover:text-primary transition">Events</Link>
            {user ? (
              <>
                <Link to={getDashboardPath()} className="block py-2 hover:text-primary transition">Dashboard</Link>
                <button onClick={handleLogout} className="block py-2 hover:text-primary transition w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-primary transition">Login</Link>
                <Link to="/register" className="block py-2 hover:text-primary transition">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
