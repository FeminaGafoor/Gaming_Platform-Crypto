import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);

  const fetchData = async () => {
    const res = await adminAPI.getWithdrawals();
    setWithdrawals(res.data);
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Withdrawals</h1>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.id} className="border-b">
                <td className="px-4 py-3">{w.id}</td>
                <td className="px-4 py-3">{w.user_id}</td>
                <td className="px-4 py-3">${w.amount}</td>
                <td className="px-4 py-3">{w.status}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => handleApprove(w.id)}
                    className="px-3 py-1 border border-blue-500 text-blue-600 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(w.id)}
                    className="px-3 py-1 border border-red-500 text-red-600 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {withdrawals.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No withdrawals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWithdrawals;
