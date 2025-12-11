import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaBuilding, FaCalendarAlt, FaDollarSign, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import api from '../utils/api';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await api.get('/api/admin/stats');
      return response.data;
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/api/users');
      return response.data;
    },
    enabled: activeTab === 'users',
  });

  const { data: clubs, isLoading: clubsLoading } = useQuery({
    queryKey: ['adminClubs'],
    queryFn: async () => {
      const response = await api.get('/api/admin/clubs');
      return response.data;
    },
    enabled: activeTab === 'clubs',
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['allPayments'],
    queryFn: async () => {
      const response = await api.get('/api/payments/all');
      return response.data;
    },
    enabled: activeTab === 'payments',
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ email, role }) => {
      const response = await api.patch(`/api/users/${email}/role`, { role });
      return response.data;
    },
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update role');
    },
  });

  const updateClubStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.patch(`/api/admin/clubs/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Club ${variables.status} successfully`);
      queryClient.invalidateQueries(['adminClubs']);
      queryClient.invalidateQueries(['adminStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update club status');
    },
  });

  const handleRoleChange = (email, newRole) => {
    updateRoleMutation.mutate({ email, role: newRole });
  };

  const handleClubStatusChange = (id, status) => {
    updateClubStatusMutation.mutate({ id, status });
  };

  if (activeTab === 'overview' && statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70">Total Users</p>
                  <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                </div>
                <FaUsers className="text-4xl text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70">Total Clubs</p>
                  <p className="text-3xl font-bold">{stats?.totalClubs || 0}</p>
                </div>
                <FaBuilding className="text-4xl text-secondary" />
              </div>
              <div className="mt-2 text-sm">
                <span className="text-success">Approved: {stats?.approvedClubs || 0}</span>
                <span className="mx-2">|</span>
                <span className="text-warning">Pending: {stats?.pendingClubs || 0}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70">Total Events</p>
                  <p className="text-3xl font-bold">{stats?.totalEvents || 0}</p>
                </div>
                <FaCalendarAlt className="text-4xl text-accent" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70">Total Revenue</p>
                  <p className="text-3xl font-bold">${stats?.totalPayments || '0.00'}</p>
                </div>
                <FaDollarSign className="text-4xl text-success" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Manage Users</h2>
            {usersLoading ? (
              <div className="flex justify-center">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className="badge badge-primary capitalize">{user.role}</span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <select
                            className="select select-bordered select-sm"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.email, e.target.value)}
                          >
                            <option value="member">Member</option>
                            <option value="clubManager">Club Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'clubs' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Manage Clubs</h2>
            {clubsLoading ? (
              <div className="flex justify-center">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Club Name</th>
                      <th>Manager</th>
                      <th>Category</th>
                      <th>Fee</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clubs?.map((club) => (
                      <tr key={club._id}>
                        <td>{club.clubName}</td>
                        <td>{club.managerEmail}</td>
                        <td>{club.category}</td>
                        <td>${club.membershipFee}</td>
                        <td>
                          <span
                            className={`badge ${
                              club.status === 'approved'
                                ? 'badge-success'
                                : club.status === 'pending'
                                ? 'badge-warning'
                                : 'badge-error'
                            }`}
                          >
                            {club.status}
                          </span>
                        </td>
                        <td>
                          {club.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleClubStatusChange(club._id, 'approved')}
                                className="btn btn-success btn-sm"
                              >
                                <FaCheckCircle /> Approve
                              </button>
                              <button
                                onClick={() => handleClubStatusChange(club._id, 'rejected')}
                                className="btn btn-error btn-sm"
                              >
                                <FaTimesCircle /> Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">All Payments</h2>
            {paymentsLoading ? (
              <div className="flex justify-center">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments?.map((payment) => (
                      <tr key={payment._id}>
                        <td>{payment.userEmail}</td>
                        <td>${payment.amount}</td>
                        <td>
                          <span className="badge badge-primary capitalize">{payment.type}</span>
                        </td>
                        <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className="badge badge-success">{payment.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tabs tabs-boxed mt-8">
        <button
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab ${activeTab === 'clubs' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('clubs')}
        >
          Clubs
        </button>
        <button
          className={`tab ${activeTab === 'payments' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Payments
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;


