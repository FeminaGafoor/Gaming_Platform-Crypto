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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
          Agent Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Welcome back! Here's your performance overview.</p>
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
      <div className="card shadow-2xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
          Last 7 Days Earnings
        </h2>
        {stats?.earnings_chart?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.earnings_chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No earnings data yet
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card shadow-2xl group hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Commission Rate</h3>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
            {stats?.commission_rate}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Revenue share from player losses</p>
        </div>

        <div className="card shadow-2xl group hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pending Withdrawals</h3>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-2">
            {stats?.pending_withdrawals || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting admin approval</p>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
