import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-base-100 shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              ClubSphere
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="hover:text-primary transition">Home</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/clubs" className="hover:text-primary transition">Clubs</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/events" className="hover:text-primary transition">Events</Link>
            </motion.div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:text-primary transition"
                >
                  <motion.img
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    src={userData?.photoURL || user.photoURL || 'https://i.ibb.co/2yfvQvz/admin-avatar.png'}
                    alt={userData?.name || 'User'}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.target.src = 'https://i.ibb.co/2yfvQvz/admin-avatar.png';
                    }}
                  />
                  <span className="hidden lg:block">{userData?.name || 'User'}</span>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaUserCircle className="text-xl" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-300 py-2"
                    >
                      <motion.div whileHover={{ x: 5, backgroundColor: 'rgba(0,0,0,0.05)' }}>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 transition"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ x: 5, backgroundColor: 'rgba(0,0,0,0.05)' }}>
                        <Link
                          to={getDashboardPath()}
                          className="block px-4 py-2 transition"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.button
                        whileHover={{ x: 5, backgroundColor: 'rgba(0,0,0,0.05)' }}
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 transition flex items-center space-x-2"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="btn btn-ghost">Login</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="btn btn-primary">Register</Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTimes className="text-2xl" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaBars className="text-2xl" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-base-300"
            >
              <motion.div className="py-4">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/clubs', label: 'Clubs' },
                  { to: '/events', label: 'Events' },
                ].map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10, color: '#570df8' }}
                  >
                    <Link to={item.to} className="block py-2 transition">
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                {user ? (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ x: 10, color: '#570df8' }}
                    >
                      <Link to={getDashboardPath()} className="block py-2 transition">
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ x: 10, color: '#570df8' }}
                      onClick={handleLogout}
                      className="block py-2 transition w-full text-left"
                    >
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ x: 10, color: '#570df8' }}
                    >
                      <Link to="/login" className="block py-2 transition">
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ x: 10, color: '#570df8' }}
                    >
                      <Link to="/register" className="block py-2 transition">
                        Register
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;

