import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await adminAPI.getWithdrawals();
      setWithdrawals(res.data);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    await adminAPI.approveWithdrawal(id);
    fetchData();
  };

  const handleReject = async (id) => {
    await adminAPI.rejectWithdrawal(id);
    fetchData();
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'user_id', label: 'User' },
    { 
      key: 'amount', 
      label: 'Amount', 
      render: (row) => `$${row.amount.toFixed(2)}` 
    },
    { key: 'status', label: 'Status' },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <div className="space-x-2">
          <button
            onClick={() => handleApprove(row.id)}
            className="px-3 py-1 border border-blue-500 text-blue-600 rounded"
          >
            Approve
          </button>
          <button
            onClick={() => handleReject(row.id)}
            className="px-3 py-1 border border-red-500 text-red-600 rounded"
          >
            Reject
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Withdrawals</h1>
      <DataTable columns={columns} data={withdrawals} loading={loading} />
    </div>
  );
};

export default AdminWithdrawals;
