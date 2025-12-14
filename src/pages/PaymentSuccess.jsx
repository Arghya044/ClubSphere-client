import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing | success | error

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const confirmPayment = async () => {
      try {
        await api.post('/api/payments/confirm-checkout', { sessionId });
        setStatus('success');
        toast.success('Payment confirmed');
      } catch (error) {
        setStatus('error');
        toast.error(error.response?.data?.message || 'Failed to confirm payment');
      }
    };

    confirmPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card bg-base-100 shadow-xl max-w-lg w-full">
        <div className="card-body text-center space-y-4">
          {status === 'processing' && (
            <>
              <h1 className="text-3xl font-bold">Confirming payment...</h1>
              <div className="spinner mx-auto"></div>
            </>
          )}

          {status === 'success' && (
            <>
              <h1 className="text-3xl font-bold text-success">Payment Successful</h1>
              <p>Your payment was confirmed and your access is now active.</p>
              <button className="btn btn-primary w-full" onClick={() => navigate('/dashboard/member')}>
                Go to Dashboard
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <h1 className="text-3xl font-bold text-error">We hit a snag</h1>
              <p>We could not confirm this payment. Please try again or contact support.</p>
              <button className="btn btn-primary w-full" onClick={() => navigate('/dashboard/member')}>
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
