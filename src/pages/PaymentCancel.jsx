import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const message =
    type === 'event'
      ? 'Your event payment was canceled. You can retry from your dashboard.'
      : 'Your membership payment was canceled. You can retry from your dashboard.';

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card bg-base-100 shadow-xl max-w-lg w-full">
        <div className="card-body text-center space-y-4">
          <h1 className="text-3xl font-bold text-warning">Payment Canceled</h1>
          <p>{message}</p>
          <button className="btn btn-primary w-full" onClick={() => navigate('/dashboard/member')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;


