import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaUsers, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: club, isLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      const response = await api.get(`/api/clubs/${id}`);
      return response.data;
    },
  });

  const { data: events } = useQuery({
    queryKey: ['clubEvents', id],
    queryFn: async () => {
      const response = await api.get(`/api/events/club/${id}`);
      return response.data;
    },
    enabled: !!club,
  });

  const { data: memberships } = useQuery({
    queryKey: ['myMemberships'],
    queryFn: async () => {
      const response = await api.get('/api/memberships/my-memberships');
      return response.data;
    },
    enabled: !!user,
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/memberships/join', {
        clubId: club._id,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Added to dashboard, pay if required');
      queryClient.invalidateQueries(['myMemberships']);
      queryClient.invalidateQueries(['club', id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to join club');
    },
  });

  const membership = memberships?.find((m) => m.clubId === id);
  const isMember = membership?.status === 'active';
  const isPendingPayment = membership?.status === 'pending_payment';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Club not found</h2>
          <button onClick={() => navigate('/clubs')} className="btn btn-primary">
            Back to Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <button onClick={() => navigate('/clubs')} className="btn btn-ghost mb-4">
            ← Back to Clubs
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-100 shadow-xl mb-8"
            >
              <figure>
                <img
                  src={club.bannerImage || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'}
                  alt={club.clubName}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800';
                  }}
                />
              </figure>
              <div className="card-body">
                <h1 className="card-title text-4xl">{club.clubName}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="badge badge-primary badge-lg">{club.category}</span>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt />
                    <span>{club.location}</span>
                  </div>
                </div>
                <p className="text-lg">{club.description}</p>
              </div>
            </motion.div>

            {/* Events Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Upcoming Events</h2>
                {events?.length === 0 ? (
                  <p className="text-base-content/70">No events scheduled yet.</p>
                ) : (
                  <div className="space-y-4">
                    {events?.map((event) => (
                      <div key={event._id} className="border border-base-300 rounded-lg p-4">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-base-content/70 mb-2">{event.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <FaCalendarAlt />
                            <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaMapMarkerAlt />
                            <span>{event.location}</span>
                          </div>
                          {event.isPaid && (
                            <div className="flex items-center space-x-1">
                              <FaDollarSign />
                              <span>${event.eventFee}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => navigate(`/events/${event._id}`)}
                            className="btn btn-primary btn-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card bg-base-100 shadow-xl sticky top-24"
            >
              <div className="card-body">
                <h2 className="card-title">Membership</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Fee:</span>
                      <span className="text-2xl font-bold">
                        {club.membershipFee > 0 ? `$${club.membershipFee}` : 'Free'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-base-content/70">
                      <FaUsers />
                      <span>Status: {club.status}</span>
                    </div>
                  </div>

                  {user ? (
                    isMember ? (
                      <div className="alert alert-success">
                        <span>You are a member of this club!</span>
                      </div>
                    ) : isPendingPayment ? (
                      <div className="space-y-3">
                        <div className="alert alert-warning">
                          <span>Payment pending. Complete checkout to activate.</span>
                        </div>
                        <button
                          onClick={() => navigate(`/payment/club/${membership._id}`)}
                          className="btn btn-primary w-full"
                        >
                          Pay Now
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => joinMutation.mutate()}
                        className="btn btn-primary w-full"
                        disabled={joinMutation.isPending}
                      >
                        {joinMutation.isPending ? 'Joining...' : 'Join Club'}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="btn btn-primary w-full"
                    >
                      Login to Join
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;

