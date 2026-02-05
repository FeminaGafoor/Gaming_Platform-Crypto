import { useState, useEffect } from 'react';
import { affiliateAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

const AffiliateClicks = () => {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClicks();
  }, []);

  const fetchClicks = async () => {
    try {
      const response = await affiliateAPI.getClicks();
      setClicks(response.data);
    } catch (error) {
      console.error('Error fetching clicks:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'user_agent', label: 'User Agent', render: (row) => row.user_agent?.substring(0, 50) + '...' || 'N/A' },
    { key: 'referrer', label: 'Referrer' },
    { key: 'converted', label: 'Converted', render: (row) => row.converted ? '✅ Yes' : '❌ No' },
    { key: 'clicked_at', label: 'Date', render: (row) => new Date(row.clicked_at).toLocaleString() },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
          Click Tracking
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Monitor all clicks on your referral links</p>
      </div>

      <DataTable columns={columns} data={clicks} loading={loading} />
    </div>
  );
};

export default AffiliateClicks;
