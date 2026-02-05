import { useState, useEffect } from 'react';
import { affiliateAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

const AffiliateCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const response = await affiliateAPI.getCommissions();
      setCommissions(response.data);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'amount', label: 'Amount', render: (row) => `$${row.amount.toFixed(2)}` },
    { key: 'commission_type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'created_at', label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commission History</h1>
          <p className="text-gray-600 mt-1">Track all your earnings</p>
        </div>
      </div>

      <DataTable columns={columns} data={commissions} loading={loading} />
    </div>
  );
};

export default AffiliateCommissions;
