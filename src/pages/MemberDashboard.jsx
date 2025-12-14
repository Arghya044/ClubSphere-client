import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FaBuilding, FaCalendarAlt, FaDollarSign, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/api';
import { useState, useEffect } from 'react';

const MemberDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Sync activeTab with URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/clubs')) {
      setActiveTab('clubs');
    } else if (path.includes('/events')) {
      setActiveTab('events');
    } else if (path.includes('/payments')) {
      setActiveTab('payments');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  const { data: memberships, isLoading: membershipsLoading } = useQuery({
    queryKey: ['myMemberships'],
    queryFn: async () => {
      const response = await api.get('/api/memberships/my-memberships');
      return response.data;
    },
  });

  const { data: registrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ['myRegistrations'],
    queryFn: async () => {
      const response = await api.get('/api/event-registrations/my-registrations');
      return response.data;
    },
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['myPayments'],
    queryFn: async () => {
      const response = await api.get('/api/payments/my-payments');
      return response.data;
    },
  });

  const stats = {
    totalClubs: memberships?.filter((m) => m.status === 'active').length || 0,
    totalEvents: registrations?.filter((r) => r.status === 'registered').length || 0,
    totalSpent: payments?.reduce((sum, p) => sum + p.amount, 0) || 0,
  };

  const upcomingEvents = registrations
    ?.filter((r) => {
      if (!r.event) return false;
      const eventDate = new Date(r.event.eventDate);
      return eventDate >= new Date() && r.status === 'registered';
    })
    .sort((a, b) => new Date(a.event.eventDate) - new Date(b.event.eventDate))
    .slice(0, 5) || [];

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-0 w-full">
        <h1 className="text-3xl font-bold mb-8">Member Dashboard</h1>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-base-100 shadow-xl"
              >
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base-content/70">My Clubs</p>
                      <p className="text-3xl font-bold">{stats.totalClubs}</p>
                    </div>
                    <FaBuilding className="text-4xl text-primary" />
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
                      <p className="text-base-content/70">My Events</p>
                      <p className="text-3xl font-bold">{stats.totalEvents}</p>
                    </div>
                    <FaCalendarAlt className="text-4xl text-secondary" />
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
                      <p className="text-base-content/70">Total Spent</p>
                      <p className="text-3xl font-bold">${stats.totalSpent.toFixed(2)}</p>
                    </div>
                    <FaDollarSign className="text-4xl text-success" />
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-base-100 shadow-xl mb-8"
            >
              <div className="card-body">
                <h2 className="card-title mb-4">Upcoming Events</h2>
                {registrationsLoading ? (
                  <div className="flex justify-center">
                    <div className="spinner"></div>
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <p className="text-base-content/70">No upcoming events.</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.map((registration) => (
                      <div
                        key={registration._id}
                        className="border border-base-300 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {registration.event?.title || 'Event'}
                            </h3>
                            <p className="text-sm text-base-content/70">
                              {registration.club?.clubName || 'Club'}
                            </p>
                            <p className="text-sm text-base-content/70">
                              {registration.event?.eventDate
                                ? new Date(registration.event.eventDate).toLocaleDateString()
                                : ''}
                            </p>
                          </div>
                          <Link
                            to={`/events/${registration.eventId}`}
                            className="btn btn-primary btn-sm"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'clubs' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">My Clubs</h2>
              {membershipsLoading ? (
                <div className="flex justify-center">
                  <div className="spinner"></div>
                </div>
              ) : memberships?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-base-content/70 mb-4">You haven't joined any clubs yet.</p>
                  <Link to="/clubs" className="btn btn-primary">
                    Browse Clubs
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memberships?.map((membership) => (
                    <motion.div
                      key={membership._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card bg-base-200 shadow-lg"
                    >
                      <div className="card-body">
                        <h3 className="card-title">{membership.club?.clubName || 'Club'}</h3>
                        <p className="text-base-content/70 line-clamp-2">
                          {membership.club?.description || ''}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="badge badge-primary">
                            {membership.club?.category || ''}
                          </span>
                          <span
                            className={`badge ${membership.status === 'active'
                              ? 'badge-success'
                              : 'badge-warning'
                              }`}
                          >
                            {membership.status}
                          </span>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <Link
                            to={`/clubs/${membership.clubId}`}
                            className="btn btn-primary btn-sm"
                          >
                            View Club
                          </Link>
                          {membership.status === 'pending_payment' && (
                            <Link
                              to={`/payment/club/${membership._id}`}
                              className="btn btn-secondary btn-sm"
                            >
                              Pay Now
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">My Event Registrations</h2>
              {registrationsLoading ? (
                <div className="flex justify-center">
                  <div className="spinner"></div>
                </div>
              ) : registrations?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-base-content/70 mb-4">You haven't registered for any events yet.</p>
                  <Link to="/events" className="btn btn-primary">
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="min-w-[140px]">Event</th>
                        <th className="min-w-[120px]">Club</th>
                        <th className="min-w-[100px]">Date</th>
                        <th className="min-w-[100px]">Status</th>
                        <th className="min-w-[160px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations?.map((registration) => (
                        <tr key={registration._id}>
                          <td className="min-w-[140px]">{registration.event?.title || 'Event'}</td>
                          <td className="min-w-[120px]">{registration.club?.clubName || 'Club'}</td>
                          <td className="min-w-[100px]">
                            {registration.event?.eventDate
                              ? new Date(registration.event.eventDate).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td className="min-w-[100px]">
                            <span
                              className={`badge ${registration.status === 'registered'
                                ? 'badge-success'
                                : 'badge-warning'
                                }`}
                            >
                              {registration.status}
                            </span>
                          </td>
                          <td className="min-w-[160px]">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Link
                                to={`/events/${registration.eventId}`}
                                className="btn btn-primary btn-sm whitespace-nowrap"
                              >
                                View
                              </Link>
                              {registration.status === 'pending_payment' && (
                                <Link
                                  to={`/payment/event/${registration._id}`}
                                  className="btn btn-secondary btn-sm whitespace-nowrap"
                                >
                                  Pay Now
                                </Link>
                              )}
                            </div>
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
              <h2 className="card-title mb-4">Payment History</h2>
              {paymentsLoading ? (
                <div className="flex justify-center">
                  <div className="spinner"></div>
                </div>
              ) : payments?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-base-content/70">No payment history.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="min-w-[80px]">Amount</th>
                        <th className="min-w-[100px]">Type</th>
                        <th className="min-w-[100px]">Date</th>
                        <th className="min-w-[90px]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments?.map((payment) => (
                        <tr key={payment._id}>
                          <td className="font-semibold min-w-[80px]">${payment.amount}</td>
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

        <div className="tabs tabs-boxed mt-8 flex flex-wrap gap-2 justify-center sm:justify-start">
          <button
            className={`tab flex-1 sm:flex-initial min-w-[90px] ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab flex-1 sm:flex-initial min-w-[90px] ${activeTab === 'clubs' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('clubs')}
          >
            My Clubs
          </button>
          <button
            className={`tab flex-1 sm:flex-initial min-w-[90px] ${activeTab === 'events' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            My Events
          </button>
          <button
            className={`tab flex-1 sm:flex-initial min-w-[90px] ${activeTab === 'payments' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payment History
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;

