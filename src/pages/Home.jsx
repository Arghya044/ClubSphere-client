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
        transition={{ duration: 0.8 }}
        className="hero min-h-[80vh] bg-gradient-to-r from-primary/10 to-secondary/10 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />

        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            {/* Animated Title with Letter Stagger */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              {["Discover", "&", "Join", "Local", "Clubs"].map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl mb-8 text-base-content/70"
            >
              Connect with like-minded people, explore your interests, and create amazing experiences together.
            </motion.p>

            {/* Animated Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/clubs" className="btn btn-primary btn-lg">
                  Explore Clubs <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/events" className="btn btn-outline btn-lg">
                  View Events <FaCalendarAlt className="ml-2" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              {[
                { icon: FaUsers, label: "Active Members", value: "1000+" },
                { icon: FaCalendarAlt, label: "Events Monthly", value: "50+" },
                { icon: FaCheckCircle, label: "Happy Clubs", value: "100+" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex flex-col items-center"
                >
                  <stat.icon className="text-3xl text-primary mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-base-content/70">{stat.label}</div>
                </motion.div>
              ))}
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
              {featuredClubs?.map((club, index) => (
                <motion.div
                  key={club._id}
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    rotate: index % 2 === 0 ? 1 : -1,
                    transition: { duration: 0.3 }
                  }}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  <motion.figure
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <img
                      src={club.bannerImage || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'}
                      alt={club.clubName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800';
                      }}
                    />
                  </motion.figure>
                  <div className="card-body">
                    <motion.h2
                      className="card-title"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {club.clubName}
                    </motion.h2>
                    <p className="text-base-content/70 line-clamp-2">{club.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <motion.span
                        className="badge badge-primary"
                        whileHover={{ scale: 1.1 }}
                      >
                        {club.category}
                      </motion.span>
                      <motion.span
                        className="text-lg font-semibold"
                        whileHover={{ scale: 1.1, color: '#570df8' }}
                      >
                        {club.membershipFee > 0 ? `$${club.membershipFee}` : 'Free'}
                      </motion.span>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link to={`/clubs/${club._id}`} className="btn btn-primary btn-sm">
                          View Details
                        </Link>
                      </motion.div>
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
      <section className="py-16 px-4 bg-base-200 relative overflow-hidden">
        {/* Background decoration */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 right-10 w-64 h-64 border-4 border-primary/10 rounded-full"
        />

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How ClubSphere Works
            </motion.h2>
            <motion.p
              className="text-base-content/70 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Get started in three simple steps
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-20" />

            {[
              { step: 1, title: 'Discover Clubs', desc: 'Browse through various clubs and find ones that match your interests.', icon: '🔍' },
              { step: 2, title: 'Join & Connect', desc: 'Become a member and connect with like-minded people in your community.', icon: '🤝' },
              { step: 3, title: 'Attend Events', desc: 'Participate in exciting events organized by your clubs.', icon: '🎉' },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="card bg-base-100 shadow-lg text-center p-6 relative"
              >
                {/* Animated step number */}
                <motion.div
                  className="text-6xl font-bold text-primary mb-4 relative"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: item.step * 0.3,
                  }}
                >
                  <motion.span
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block"
                  >
                    {item.step}
                  </motion.span>
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="text-5xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.icon}
                </motion.div>

                <motion.h3
                  className="text-2xl font-semibold mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.title}
                </motion.h3>
                <p className="text-base-content/70">{item.desc}</p>

                {/* Decorative corner */}
                <motion.div
                  className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"
                  whileHover={{ scale: 1.2 }}
                />
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
            <motion.h2
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Join a Club?
            </motion.h2>
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
                whileHover={{
                  scale: 1.05,
                  x: 10,
                  backgroundColor: 'rgba(87, 13, 248, 0.05)',
                  transition: { duration: 0.3 }
                }}
                className="flex items-center space-x-3 p-4 bg-base-100 rounded-lg shadow cursor-pointer"
              >
                <motion.div
                  whileHover={{
                    rotate: 360,
                    scale: 1.2,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <FaCheckCircle className="text-primary text-xl" />
                </motion.div>
                <motion.span
                  className="text-lg"
                  whileHover={{ x: 5 }}
                >
                  {benefit}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

