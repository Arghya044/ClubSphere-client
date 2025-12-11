import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-base-content/70 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <FaHome className="mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;


