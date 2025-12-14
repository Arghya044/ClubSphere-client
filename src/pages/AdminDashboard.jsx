import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaBuilding, FaCalendarAlt, FaDollarSign, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import api from '../utils/api';
import { useState, useEffect, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Sync activeTab with URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/users')) {
      setActiveTab('users');
    } else if (path.includes('/clubs')) {
      setActiveTab('clubs');
    } else if (path.includes('/payments')) {
      setActiveTab('payments');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

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

  // Fetch all payments for the chart (always enabled for overview)
  const { data: allPayments } = useQuery({
    queryKey: ['allPaymentsForChart'],
    queryFn: async () => {
      const response = await api.get('/api/payments/all');
      return response.data;
    },
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

  // Process payment data for the chart
  const paymentChartData = useMemo(() => {
    if (!allPayments || allPayments.length === 0) return [];

    // Get last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        amount: 0,
      });
    }

    // Aggregate payments by month
    allPayments.forEach((payment) => {
      const paymentDate = new Date(payment.createdAt);
      const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
      const monthData = months.find((m) => m.monthKey === monthKey);
      if (monthData) {
        monthData.amount += payment.amount;
      }
    });

    return months.map(({ month, amount }) => ({
      month,
      amount: parseFloat(amount.toFixed(2)),
    }));
  }, [allPayments]);

  if (activeTab === 'overview' && statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-0 w-full">
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

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-base-100 shadow-xl mb-8"
          >
            <div className="card-body">
              <h2 className="card-title mb-4">Payment Trends (Last 6 Months)</h2>
              {paymentChartData.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-base-content/70">No payment data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={paymentChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--b1))',
                        border: '1px solid hsl(var(--bc) / 0.2)',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      name="Revenue"
                      fill="hsl(var(--p))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
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
                        <th className="min-w-[120px]">Name</th>
                        <th className="min-w-[180px]">Email</th>
                        <th className="min-w-[100px]">Role</th>
                        <th className="min-w-[100px]">Created</th>
                        <th className="min-w-[140px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((user) => (
                        <tr key={user._id}>
                          <td className="min-w-[120px]">{user.name}</td>
                          <td className="min-w-[180px] break-all">{user.email}</td>
                          <td className="min-w-[100px]">
                            <span className="badge badge-primary capitalize">{user.role}</span>
                          </td>
                          <td className="min-w-[100px]">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="min-w-[140px]">
                            <select
                              className="select select-bordered select-sm w-full max-w-[140px]"
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
                        <th className="min-w-[140px]">Club Name</th>
                        <th className="min-w-[180px]">Manager</th>
                        <th className="min-w-[100px]">Category</th>
                        <th className="min-w-[80px]">Fee</th>
                        <th className="min-w-[90px]">Status</th>
                        <th className="min-w-[200px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clubs?.map((club) => (
                        <tr key={club._id}>
                          <td className="min-w-[140px]">{club.clubName}</td>
                          <td className="min-w-[180px] break-all">{club.managerEmail}</td>
                          <td className="min-w-[100px]">{club.category}</td>
                          <td className="min-w-[80px]">${club.membershipFee}</td>
                          <td className="min-w-[90px]">
                            <span
                              className={`badge ${club.status === 'approved'
                                ? 'badge-success'
                                : club.status === 'pending'
                                  ? 'badge-warning'
                                  : 'badge-error'
                                }`}
                            >
                              {club.status}
                            </span>
                          </td>
                          <td className="min-w-[200px]">
                            {club.status === 'pending' && (
                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={() => handleClubStatusChange(club._id, 'approved')}
                                  className="btn btn-success btn-sm whitespace-nowrap"
                                >
                                  <FaCheckCircle /> Approve
                                </button>
                                <button
                                  onClick={() => handleClubStatusChange(club._id, 'rejected')}
                                  className="btn btn-error btn-sm whitespace-nowrap"
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
                        <th className="min-w-[180px]">User</th>
                        <th className="min-w-[80px]">Amount</th>
                        <th className="min-w-[100px]">Type</th>
                        <th className="min-w-[100px]">Date</th>
                        <th className="min-w-[90px]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments?.map((payment) => (
                        <tr key={payment._id}>
                          <td className="min-w-[180px] break-all">{payment.userEmail}</td>
                          <td className="min-w-[80px]">${payment.amount}</td>
                          <td className="min-w-[100px]">
                            <span className="badge badge-primary capitalize">{payment.type}</span>
                          </td>
                          <td className="min-w-[100px]">{new Date(payment.createdAt).toLocaleDateString()}</td>
                          <td className="min-w-[90px]">
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
        <div className="tabs tabs-boxed mt-8 flex flex-wrap gap-2 justify-center sm:justify-start">
          <button
            className={`tab flex-1 sm:flex-initial min-w-[100px] ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab flex-1 sm:flex-initial min-w-[100px] ${activeTab === 'users' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab flex-1 sm:flex-initial min-w-[100px] ${activeTab === 'clubs' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('clubs')}
          >
            Clubs
          </button>
          <button
            className={`tab flex-1 sm:flex-initial min-w-[100px] ${activeTab === 'payments' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

