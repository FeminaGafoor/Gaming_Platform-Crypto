

import { useState, useEffect } from 'react';
import { agentAPI } from '../../services/api';
import DataTable from '../../components/DataTable';
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


  const exportToCSV = (rows, filename) => {
  if (!rows || rows.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = ['ID', 'Amount', 'Type', 'Description', 'Date'];
  const data = rows.map(r => [
    r.id,
    r.amount?.toFixed(2),
    r.commission_type,
    r.description || '',
    new Date(r.created_at).toLocaleDateString()
  ]);

  const csv = [headers, ...data]
    .map(row =>
      row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};


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

  const chartData = commissions.map(c => ({
    date: new Date(c.created_at).toLocaleDateString(),
    amount: c.amount
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commission History</h1>
          <p className="text-gray-600 mt-1">Track all your earnings</p>
        </div>
        <button
          type="button"
          onClick={() => exportToCSV(commissions, `commissions_${new Date().toISOString().split('T')[0]}.csv`)}
          className="btn-secondary flex items-center space-x-2"
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

      {/* Trend Graph */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Commission Trend</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No data yet
          </div>
        )}
      </div>

      {/* Commissions Table */}
      <DataTable columns={columns} data={commissions} loading={loading} />
    </div>
  );
};

export default AgentCommissions;
