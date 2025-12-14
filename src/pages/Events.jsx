import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSearch, FaSort, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../utils/api';

const Events = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('upcoming');

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', search, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      const response = await api.get(`/api/events?${params.toString()}`);
      return response.data;
    },
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Upcoming Events
          </motion.h1>
          <motion.p
            className="text-base-content/70 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Discover exciting events from local clubs
          </motion.p>
        </motion.div>

        {/* Search and Sort Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
          className="card bg-base-100 shadow-lg mb-8"
        >
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                className="form-control"
                whileHover={{ scale: 1.02 }}
              >
                <label className="label">
                  <span className="label-text">Search Events</span>
                </label>
                <div className="relative">
                  <motion.div
                    animate={{ rotate: search ? 360 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  </motion.div>
                  <input
                    type="text"
                    placeholder="Search by title..."
                    className="input input-bordered w-full pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div
                className="form-control"
                whileHover={{ scale: 1.02 }}
              >
                <label className="label">
                  <span className="label-text">Sort By</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="upcoming">Upcoming First</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center">
            <div className="spinner"></div>
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-base-content/70">No events found. Try adjusting your search.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events?.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="card-body">
                  <motion.h2
                    className="card-title"
                    whileHover={{ x: 5, color: '#570df8' }}
                  >
                    {event.title}
                  </motion.h2>
                  <p className="text-base-content/70 line-clamp-3">{event.description}</p>
                  <div className="flex items-center space-x-4 mt-4 text-sm">
                    <motion.div
                      className="flex items-center space-x-1"
                      whileHover={{ scale: 1.1, x: 5 }}
                    >
                      <FaCalendarAlt />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center space-x-1"
                      whileHover={{ scale: 1.1, x: 5 }}
                    >
                      <FaMapMarkerAlt />
                      <span>{event.location}</span>
                    </motion.div>
                  </div>
                  {event.isPaid && (
                    <div className="mt-2">
                      <motion.span
                        className="badge badge-primary"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        ${event.eventFee}
                      </motion.span>
                    </div>
                  )}
                  <div className="card-actions justify-end mt-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
                        View Details
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Events;

