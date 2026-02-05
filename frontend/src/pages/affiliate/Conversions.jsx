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
    <div className="space-y-6 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
          Conversions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Players who made deposits through your referral</p>
      </div>

      <DataTable columns={columns} data={conversions} loading={loading} />
    </div>
  );
};

export default AffiliateConversions;
