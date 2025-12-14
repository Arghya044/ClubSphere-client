import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaUsers } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/api/events/${id}`);
      return response.data;
    },
  });

  const { data: club } = useQuery({
    queryKey: ['club', event?.clubId],
    queryFn: async () => {
      if (!event?.clubId) return null;
      const response = await api.get(`/api/clubs/${event.clubId}`);
      return response.data;
    },
    enabled: !!event?.clubId,
  });

  const { data: registrations } = useQuery({
    queryKey: ['myRegistrations'],
    queryFn: async () => {
      const response = await api.get('/api/event-registrations/my-registrations');
      return response.data;
    },
    enabled: !!user,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/event-registrations/register', {
        eventId: event._id,
        clubId: event.clubId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Added to dashboard, pay if required');
      queryClient.invalidateQueries(['myRegistrations']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to register');
    },
  });

  const registration = registrations?.find((r) => r.eventId === id);
  const isRegistered = registration?.status === 'registered';
  const isPendingPayment = registration?.status === 'pending_payment';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <button onClick={() => navigate('/events')} className="btn btn-primary">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <button onClick={() => navigate('/events')} className="btn btn-ghost mb-4">
            ← Back to Events
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <h1 className="card-title text-4xl">{event.title}</h1>
                {club && (
                  <Link to={`/clubs/${club._id}`} className="link link-primary">
                    {club.clubName}
                  </Link>
                )}
                <p className="text-lg mt-4">{event.description}</p>
                <div className="divider"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt />
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                  </div>
                  {event.isPaid && (
                    <div className="flex items-center space-x-2">
                      <FaDollarSign />
                      <span className="text-2xl font-bold">${event.eventFee}</span>
                    </div>
                  )}
                  {event.maxAttendees && (
                    <div className="flex items-center space-x-2">
                      <FaUsers />
                      <span>Max: {event.maxAttendees} attendees</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card bg-base-100 shadow-xl sticky top-24"
            >
              <div className="card-body">
                <h2 className="card-title">Registration</h2>
                <div className="space-y-4">
                  {event.isPaid ? (
                    <div>
                      <div className="text-2xl font-bold mb-4">${event.eventFee}</div>
                    </div>
                  ) : (
                    <div className="badge badge-success badge-lg">Free Event</div>
                  )}

                  {user ? (
                    isRegistered ? (
                      <div className="alert alert-success">
                        <span>You are registered for this event!</span>
                      </div>
                    ) : isPendingPayment ? (
                      <div className="space-y-3">
                        <div className="alert alert-warning">
                          <span>Payment pending. Complete checkout to confirm.</span>
                        </div>
                        <button
                          onClick={() => navigate(`/payment/event/${registration._id}`)}
                          className="btn btn-primary w-full"
                        >
                          Pay Now
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => registerMutation.mutate()}
                        className="btn btn-primary w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? 'Registering...' : 'Register for Event'}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="btn btn-primary w-full"
                    >
                      Login to Register
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

export default EventDetails;

