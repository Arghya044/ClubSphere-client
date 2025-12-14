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
      {/* Hero Section - Redesigned with Advanced Animations */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hero min-h-[90vh] relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
      >
        {/* Animated Grid Background */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                             linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Large Gradient Orbs with Complex Motion */}
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-secondary/20 to-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-accent/15 to-primary/15 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 50, -50, 0],
            scale: [1, 1.4, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, 80, -80, 0],
            y: [0, -60, 60, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-secondary/5 to-transparent rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-20 right-20 w-20 h-20 border-4 border-primary/30"
          animate={{
            rotate: [0, 360],
            y: [0, -20, 0],
            borderRadius: ['0%', '50%', '0%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-16 h-16 border-4 border-secondary/30"
          animate={{
            rotate: [0, -360],
            x: [0, 20, 0],
            borderRadius: ['50%', '0%', '50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 left-10 w-12 h-12 bg-accent/20"
          animate={{
            rotate: [0, 180, 0],
            scale: [1, 1.3, 1],
            borderRadius: ['0%', '50%', '0%'],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Content */}
        <div className="hero-content text-center relative z-10 py-20">
          <div className="max-w-4xl">
            {/* Animated Title with Character Reveal */}
            <motion.div className="mb-8">
              <motion.h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
                {["Discover", "&", "Join"].map((word, wordIndex) => (
                  <motion.span
                    key={wordIndex}
                    className="inline-block mr-4"
                    initial={{ opacity: 0, y: 100, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: wordIndex * 0.2,
                      duration: 0.8,
                      ease: [0.6, 0.05, 0.01, 0.9],
                    }}
                  >
                    {word.split('').map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        className="inline-block"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: wordIndex * 0.2 + charIndex * 0.05,
                          duration: 0.5,
                        }}
                        whileHover={{
                          scale: 1.2,
                          color: '#570df8',
                          transition: { duration: 0.2 },
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {["Local", "Clubs"].map((word, wordIndex) => (
                  <motion.span
                    key={wordIndex}
                    className="inline-block mr-4"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {word.split('').map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        className="inline-block"
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        transition={{
                          delay: 0.8 + wordIndex * 0.2 + charIndex * 0.05,
                          duration: 0.5,
                        }}
                        whileHover={{
                          scale: 1.3,
                          rotateZ: 10,
                          transition: { duration: 0.2 },
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.span>
                ))}
              </motion.h2>
            </motion.div>

            {/* Animated Subtitle with Wave Effect */}
            <motion.p
              className="text-xl md:text-2xl mb-10 text-base-content/80 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {"Connect with like-minded people, explore your interests, and create amazing experiences together.".split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.2 + index * 0.05,
                    duration: 0.5,
                  }}
                  whileHover={{
                    y: -5,
                    color: '#570df8',
                    transition: { duration: 0.2 },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            {/* Animated Buttons with Glow Effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(87, 13, 248, 0)',
                    '0 0 20px rgba(87, 13, 248, 0.5)',
                    '0 0 0px rgba(87, 13, 248, 0)',
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="relative rounded-lg"
              >
                <Link to="/clubs" className="btn btn-primary btn-lg text-lg px-8">
                  Explore Clubs <FaArrowRight className="ml-2" />
                </Link>
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-lg blur-xl -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(244, 114, 182, 0)',
                    '0 0 20px rgba(244, 114, 182, 0.5)',
                    '0 0 0px rgba(244, 114, 182, 0)',
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  },
                }}
                className="relative rounded-lg"
              >
                <Link to="/events" className="btn btn-outline btn-lg text-lg px-8">
                  View Events <FaCalendarAlt className="ml-2" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Animated Stats with Continuous Pulse */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-12"
            >
              {[
                { icon: FaUsers, label: "Active Members", value: "1000+", color: "primary" },
                { icon: FaCalendarAlt, label: "Events Monthly", value: "50+", color: "secondary" },
                { icon: FaCheckCircle, label: "Happy Clubs", value: "100+", color: "accent" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 2 + index * 0.15,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{
                    scale: 1.15,
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                  className="flex flex-col items-center relative group"
                >
                  {/* Glowing Border */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br from-${stat.color}/30 to-${stat.color}/10 rounded-2xl blur-xl`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="relative bg-base-100/50 backdrop-blur-sm p-6 rounded-2xl border border-base-content/10"
                    animate={{
                      borderColor: [
                        'rgba(255, 255, 255, 0.1)',
                        'rgba(87, 13, 248, 0.3)',
                        'rgba(255, 255, 255, 0.1)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.4,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <stat.icon className={`text-5xl text-${stat.color} mb-3`} />
                    </motion.div>
                    <motion.div
                      className="text-4xl font-bold mb-1"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: "easeInOut",
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-base-content/70 font-medium">{stat.label}</div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center gap-2 text-base-content/50"
          >
            <span className="text-sm">Scroll to explore</span>
            <motion.div
              className="w-6 h-10 border-2 border-base-content/30 rounded-full flex justify-center"
              animate={{
                borderColor: [
                  'rgba(255, 255, 255, 0.3)',
                  'rgba(87, 13, 248, 0.6)',
                  'rgba(255, 255, 255, 0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-primary rounded-full mt-2"
                animate={{
                  y: [0, 16, 0],
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
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

