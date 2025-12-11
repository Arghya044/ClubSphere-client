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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-base-content/70 text-lg">Discover exciting events from local clubs</p>
        </motion.div>

        {/* Search and Sort Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-lg mb-8"
        >
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search Events</span>
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    className="input input-bordered w-full pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-control">
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
              </div>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card bg-base-100 shadow-xl"
              >
                <div className="card-body">
                  <h2 className="card-title">{event.title}</h2>
                  <p className="text-base-content/70 line-clamp-3">{event.description}</p>
                  <div className="flex items-center space-x-4 mt-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaMapMarkerAlt />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  {event.isPaid && (
                    <div className="mt-2">
                      <span className="badge badge-primary">${event.eventFee}</span>
                    </div>
                  )}
                  <div className="card-actions justify-end mt-4">
                    <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
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


