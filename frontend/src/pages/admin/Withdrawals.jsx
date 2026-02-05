import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getWithdrawals();
      setWithdrawals(res.data);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
      alert('Failed to fetch withdrawals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openApproveModal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setAdminNotes('');
    setShowApproveModal(true);
  };

  const openRejectModal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setAdminNotes('');
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleApprove = async () => {
    if (!selectedWithdrawal) return;

    try {
      setProcessing(true);
      await adminAPI.approveWithdrawal(selectedWithdrawal.id, {
        admin_notes: adminNotes || null
      });
      setShowApproveModal(false);
      setSelectedWithdrawal(null);
      setAdminNotes('');
      fetchData();
    } catch (err) {
      console.error('Error approving withdrawal:', err);
      alert(err.response?.data?.detail || 'Failed to approve withdrawal');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedWithdrawal || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      await adminAPI.rejectWithdrawal(selectedWithdrawal.id, {
        rejection_reason: rejectionReason,
        admin_notes: adminNotes || null
      });
      setShowRejectModal(false);
      setSelectedWithdrawal(null);
      setAdminNotes('');
      setRejectionReason('');
      fetchData();
    } catch (err) {
      console.error('Error rejecting withdrawal:', err);
      alert(err.response?.data?.detail || 'Failed to reject withdrawal');
    } finally {
      setProcessing(false);
    }
  };

  const filteredWithdrawals = filter === 'ALL'
    ? withdrawals
    : withdrawals.filter(w => w.status === filter);

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-yellow-500/30',
      'APPROVED': 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/30',
      'REJECTED': 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-red-500/30'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Withdrawal Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Review and process withdrawal requests</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('PENDING')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg ${
            filter === 'PENDING'
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-yellow-500/30 scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
          }`}
        >
          Pending ({withdrawals.filter(w => w.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setFilter('APPROVED')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg ${
            filter === 'APPROVED'
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/30 scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('REJECTED')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg ${
            filter === 'REJECTED'
              ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-red-500/30 scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
          }`}
        >
          Rejected
        </button>
        <button
          onClick={() => setFilter('ALL')}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg ${
            filter === 'ALL'
              ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-blue-500/30 scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
          }`}
        >
          All
        </button>
      </div>

      {/* Withdrawals Table */}
      <div className="card shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Requested</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <AlertCircle className="w-12 h-12 mb-3" />
                      <p className="text-lg font-medium">No withdrawals found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      #{withdrawal.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {withdrawal.user_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
                        withdrawal.user_role === 'agent'
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-blue-500/30' :
                        withdrawal.user_role === 'affiliate'
                          ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-purple-500/30' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {withdrawal.user_role?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      ${withdrawal.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        <div className="font-medium">{withdrawal.payment_method || 'N/A'}</div>
                        {withdrawal.payment_details && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {withdrawal.payment_details}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${getStatusBadge(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {withdrawal.requested_at ? new Date(withdrawal.requested_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {withdrawal.status === 'PENDING' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openApproveModal(withdrawal)}
                            className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl hover:from-green-500 hover:to-emerald-600 font-bold transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/30 flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => openRejectModal(withdrawal)}
                            className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl hover:from-red-500 hover:to-pink-600 font-bold transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/30 flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : withdrawal.status === 'APPROVED' ? (
                        <div className="text-green-600 dark:text-green-400 flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Processed</span>
                        </div>
                      ) : (
                        <div className="text-red-600 dark:text-red-400 flex items-center space-x-1">
                          <XCircle className="w-4 h-4" />
                          <span className="text-xs">Rejected</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border-2 border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowApproveModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Approve Withdrawal</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Confirm approval for ${selectedWithdrawal.amount.toFixed(2)} withdrawal
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-4 mb-6 border-2 border-blue-200 dark:border-blue-800/30">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">User:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedWithdrawal.user_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-bold text-gray-900 dark:text-white">${selectedWithdrawal.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedWithdrawal.payment_method}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="label">Admin Notes (Optional)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Add any notes about this approval..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{processing ? 'Processing...' : 'Confirm Approval'}</span>
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={processing}
                className="flex-1 btn-secondary disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border-2 border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowRejectModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mx-auto mb-4 shadow-lg">
                <XCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reject Withdrawal</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Provide a reason for rejecting this withdrawal
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-4 mb-6 border-2 border-blue-200 dark:border-blue-800/30">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">User:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedWithdrawal.user_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-bold text-gray-900 dark:text-white">${selectedWithdrawal.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="label">Rejection Reason <span className="text-red-500">*</span></label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Explain why this withdrawal is being rejected..."
                required
              />
            </div>

            <div className="mb-6">
              <label className="label">Admin Notes (Optional)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="input min-h-[80px]"
                placeholder="Add any internal notes..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl px-6 py-3 font-bold hover:from-red-500 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>{processing ? 'Processing...' : 'Confirm Rejection'}</span>
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={processing}
                className="flex-1 btn-secondary disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
