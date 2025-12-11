import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import api from '../utils/api';

const Clubs = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  const { data: clubs, isLoading } = useQuery({
    queryKey: ['clubs', search, category, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort);
      const response = await api.get(`/api/clubs?${params.toString()}`);
      return response.data;
    },
  });

  const categories = ['Photography', 'Sports', 'Tech', 'Book Club', 'Hiking', 'Music', 'Art', 'Other'];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Clubs</h1>
          <p className="text-base-content/70 text-lg">Discover clubs that match your interests</p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-lg mb-8"
        >
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search Clubs</span>
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    className="input input-bordered w-full pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sort By</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highestFee">Highest Fee</option>
                  <option value="lowestFee">Lowest Fee</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clubs Grid */}
        {isLoading ? (
          <div className="flex justify-center">
            <div className="spinner"></div>
          </div>
        ) : clubs?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-base-content/70">No clubs found. Try adjusting your filters.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {clubs?.map((club, index) => (
              <motion.div
                key={club._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                  <p className="text-base-content/70 line-clamp-3">{club.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="badge badge-primary">{club.category}</span>
                    <span className="badge badge-outline">{club.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
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
      </div>
    </div>
  );
};

export default Clubs;


