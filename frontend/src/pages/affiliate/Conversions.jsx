import { useState, useEffect } from 'react';
import { affiliateAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

const AffiliateConversions = () => {
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversions();
  }, []);

  const fetchConversions = async () => {
    try {
      const response = await affiliateAPI.getConversions();
      setConversions(response.data);
    } catch (error) {
      console.error('Error fetching conversions:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Player ID' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'total_deposits', label: 'Total Deposits', render: (row) => `$${row.total_deposits.toFixed(2)}` },
    { key: 'created_at', label: 'Registered', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conversions</h1>
          <p className="text-gray-600 mt-1">Players who made deposits through your referral</p>
        </div>
      </div>

      <DataTable columns={columns} data={conversions} loading={loading} />
    </div>
  );
};

export default AffiliateConversions;
