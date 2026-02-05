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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Click Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor all clicks on your referral links</p>
        </div>
      </div>

      <DataTable columns={columns} data={clicks} loading={loading} />
    </div>
  );
};

export default AffiliateClicks;
