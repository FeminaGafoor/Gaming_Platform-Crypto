import { useState, useEffect } from 'react';
import { agentAPI } from '../../services/api';
import DataTable from '../../components/DataTable';
import { DollarSign, CreditCard, AlertCircle } from 'lucide-react';

const AgentWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'bank_transfer',
    payment_details: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await agentAPI.getWithdrawals();
      setWithdrawals(response.data);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await agentAPI.requestWithdrawal(formData);
      setSuccess('Withdrawal request submitted successfully!');
      setShowForm(false);
      setFormData({ amount: '', payment_method: 'bank_transfer', payment_details: '' });
      fetchWithdrawals();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to submit withdrawal request');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      processed: 'bg-blue-100 text-blue-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'amount', 
      label: 'Amount', 
      render: (row) => `$${row.amount.toFixed(2)}` 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    { key: 'payment_method', label: 'Method' },
    { 
      key: 'requested_at', 
      label: 'Requested', 
      render: (row) => new Date(row.requested_at).toLocaleDateString() 
    },
    { 
      key: 'processed_at', 
      label: 'Processed', 
      render: (row) => row.processed_at ? new Date(row.processed_at).toLocaleDateString() : '-' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Withdrawals</h1>
          <p className="text-gray-600 mt-1">Manage your payout requests</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Request Withdrawal'}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Withdrawal Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">New Withdrawal Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Amount (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="50"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input pl-10"
                  placeholder="50.00"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Minimum withdrawal: $50.00</p>
            </div>

            <div>
              <label className="label">Payment Method</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="input pl-10"
                  required
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="crypto">Cryptocurrency (USDT)</option>
                  <option value="paypal">PayPal</option>
                  <option value="wise">Wise</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Payment Details</label>
              <textarea
                value={formData.payment_details}
                onChange={(e) => setFormData({ ...formData, payment_details: e.target.value })}
                className="input h-24 resize-none"
                placeholder="Enter your bank account details, crypto wallet address, or PayPal email"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Notes:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Withdrawals are processed within 2-3 business days</li>
                <li>• You'll receive an email once your request is approved</li>
                <li>• Ensure your payment details are accurate to avoid delays</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary flex-1">
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Withdrawals Table */}
      <DataTable columns={columns} data={withdrawals} loading={loading} />
    </div>
  );
};

export default AgentWithdrawals;
