import { useState, useEffect } from 'react';
import { agentAPI } from '../../services/api';
import DataTable from '../../components/DataTable';
import { Download } from 'lucide-react';

const AgentCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const response = await agentAPI.getCommissions();
      setCommissions(response.data);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Amount', 'Type', 'Description', 'Date'];
    const rows = commissions.map(c => [
      c.id,
      c.amount.toFixed(2),
      c.commission_type,
      c.description || '',
      new Date(c.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'amount', 
      label: 'Amount', 
      render: (row) => (
        <span className="font-semibold text-green-600">
          ${row.amount.toFixed(2)}
        </span>
      )
    },
    { key: 'commission_type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { 
      key: 'created_at', 
      label: 'Date', 
      render: (row) => new Date(row.created_at).toLocaleDateString() 
    },
  ];

  const totalEarnings = commissions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commission History</h1>
          <p className="text-gray-600 mt-1">Track all your earnings</p>
        </div>
        <button
          onClick={exportToCSV}
          className="btn-secondary flex items-center space-x-2"
          disabled={commissions.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
            <p className="text-4xl font-bold text-green-600">
              ${totalEarnings.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Total Commissions</p>
            <p className="text-2xl font-bold text-gray-900">
              {commissions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Commissions Table */}
      <DataTable columns={columns} data={commissions} loading={loading} />
    </div>
  );
};

export default AgentCommissions;
