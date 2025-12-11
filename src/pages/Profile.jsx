import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const Profile = () => {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <h1 className="card-title text-3xl mb-6">Profile</h1>
            
            <div className="flex flex-col items-center mb-8">
              <img
                src={userData?.photoURL || 'https://i.ibb.co/2yfvQvz/admin-avatar.png'}
                alt={userData?.name || 'User'}
                className="w-32 h-32 rounded-full mb-4"
                onError={(e) => {
                  e.target.src = 'https://i.ibb.co/2yfvQvz/admin-avatar.png';
                }}
              />
              <h2 className="text-2xl font-bold">{userData?.name || 'User'}</h2>
              <span className="badge badge-primary badge-lg mt-2 capitalize">
                {userData?.role || 'Member'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-xl text-primary" />
                <div>
                  <p className="text-sm text-base-content/70">Email</p>
                  <p className="font-semibold">{userData?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaUser className="text-xl text-primary" />
                <div>
                  <p className="text-sm text-base-content/70">Name</p>
                  <p className="font-semibold">{userData?.name || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-xl text-primary" />
                <div>
                  <p className="text-sm text-base-content/70">Member Since</p>
                  <p className="font-semibold">
                    {userData?.createdAt
                      ? new Date(userData.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;


