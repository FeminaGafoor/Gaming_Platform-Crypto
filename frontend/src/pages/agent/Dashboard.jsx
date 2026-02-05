import { useState, useEffect } from 'react';
import { agentAPI } from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import { Users, DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AgentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await agentAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your performance overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Players"
          value={stats?.total_players || 0}
          icon={Users}
          color="blue"
        />
        <DashboardCard
          title="Active Players"
          value={stats?.active_players || 0}
          icon={TrendingUp}
          color="green"
        />
        <DashboardCard
          title="Total Earnings"
          value={`$${stats?.total_earnings?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          color="purple"
        />
        <DashboardCard
          title="Withdrawable"
          value={`$${stats?.withdrawable_balance?.toFixed(2) || '0.00'}`}
          icon={CreditCard}
          color="orange"
        />
      </div>

      {/* Earnings Chart */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Last 7 Days Earnings</h2>
        {stats?.earnings_chart?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.earnings_chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No earnings data yet
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Rate</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.commission_rate}%</p>
          <p className="text-sm text-gray-600 mt-2">Revenue share from player losses</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Withdrawals</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.pending_withdrawals || 0}</p>
          <p className="text-sm text-gray-600 mt-2">Awaiting admin approval</p>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
