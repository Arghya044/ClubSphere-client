import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const PaymentEvent = () => {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  const origin = window.location.origin;

  const { data: registration, isLoading, isError } = useQuery({
    queryKey: ['registration', registrationId],
    queryFn: async () => {
      const response = await api.get(`/api/event-registrations/${registrationId}`);
      return response.data;
    },
    enabled: Boolean(registrationId),
  });

  const payMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/payments/create-event-checkout-session', {
        eventId: registration.eventId,
        registrationId: registration._id,
        successUrl: `${origin}/payment-success`,
        cancelUrl: `${origin}/payment-cancel`,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('Unable to start checkout.');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to start checkout');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError || !registration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Registration not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/member')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isPaid = registration.status === 'registered';

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body space-y-6">
            <h1 className="card-title text-3xl">Complete Event Payment</h1>
            <div className="border border-base-300 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Event</span>
                <span>{registration.event?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Club</span>
                <span>{registration.club?.clubName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Amount</span>
                <span className="text-2xl font-bold">${registration.event?.eventFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status</span>
                <span className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`}>
                  {registration.status}
                </span>
              </div>
            </div>

            {isPaid ? (
              <div className="alert alert-success">
                <span>Payment already completed for this event.</span>
              </div>
            ) : (
              <button
                className="btn btn-primary w-full"
                onClick={() => payMutation.mutate()}
                disabled={payMutation.isPending}
              >
                {payMutation.isPending ? 'Redirecting...' : 'Pay with Stripe'}
              </button>
            )}

            <button className="btn btn-ghost w-full" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentEvent;


