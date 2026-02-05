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
      pending: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/30',
      approved: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30',
      rejected: 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg shadow-red-500/30',
      processed: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-500/30',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Withdrawals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Manage your payout requests</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <DollarSign className="w-5 h-5" />
          <span>{showForm ? 'Cancel' : 'Request Withdrawal'}</span>
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl flex items-center space-x-3 shadow-lg animate-pulse">
          <AlertCircle className="w-6 h-6" />
          <span className="font-medium">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-6 py-4 rounded-2xl shadow-lg font-medium">
          {success}
        </div>
      )}

      {/* Withdrawal Form */}
      {showForm && (
        <div className="card shadow-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            New Withdrawal Request
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800/30 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-3 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Important Notes:</span>
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Withdrawals are processed within 2-3 business days</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>You'll receive an email once your request is approved</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Ensure your payment details are accurate to avoid delays</span>
                </li>
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
