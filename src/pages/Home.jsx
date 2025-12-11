import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/api';

const Home = () => {
  const { data: clubs, isLoading, error } = useQuery({
    queryKey: ['featuredClubs'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/clubs');
        // Get top 6 clubs (by most members or recently approved)
        const clubsData = response.data || [];
        return clubsData.slice(0, 6);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const featuredClubs = clubs || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hero min-h-[80vh] bg-gradient-to-r from-primary/10 to-secondary/10"
      >
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Discover & Join Local Clubs
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8 text-base-content/70"
            >
              Connect with like-minded people, explore your interests, and create amazing experiences together.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/clubs" className="btn btn-primary btn-lg">
                Explore Clubs <FaArrowRight className="ml-2" />
              </Link>
              <Link to="/events" className="btn btn-outline btn-lg">
                View Events <FaCalendarAlt className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Clubs Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Clubs</h2>
            <p className="text-base-content/70 text-lg">Discover the most popular clubs in your area</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-base-content/70">Unable to load featured clubs. Please try again later.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredClubs?.map((club) => (
                <motion.div
                  key={club._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="card bg-base-100 shadow-xl"
                >
                  <figure>
                    <img
                      src={club.bannerImage || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'}
                      alt={club.clubName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800';
                      }}
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{club.clubName}</h2>
                    <p className="text-base-content/70 line-clamp-2">{club.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="badge badge-primary">{club.category}</span>
                      <span className="text-lg font-semibold">
                        {club.membershipFee > 0 ? `$${club.membershipFee}` : 'Free'}
                      </span>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <Link to={`/clubs/${club._id}`} className="btn btn-primary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/clubs" className="btn btn-outline btn-lg">
              View All Clubs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-base-200">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">How ClubSphere Works</h2>
            <p className="text-base-content/70 text-lg">Get started in three simple steps</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { step: 1, title: 'Discover Clubs', desc: 'Browse through various clubs and find ones that match your interests.' },
              { step: 2, title: 'Join & Connect', desc: 'Become a member and connect with like-minded people in your community.' },
              { step: 3, title: 'Attend Events', desc: 'Participate in exciting events organized by your clubs.' },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="card bg-base-100 shadow-lg text-center p-6"
              >
                <div className="text-4xl font-bold text-primary mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-base-content/70">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Join a Club?</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {[
              'Meet new people with similar interests',
              'Learn new skills and hobbies',
              'Participate in exciting events',
              'Build lasting friendships',
              'Explore your passions',
              'Make a positive impact in your community',
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center space-x-3 p-4 bg-base-100 rounded-lg shadow"
              >
                <FaCheckCircle className="text-primary text-xl" />
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;


