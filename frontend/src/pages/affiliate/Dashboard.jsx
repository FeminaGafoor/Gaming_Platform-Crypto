import { useState, useEffect } from 'react';
import { affiliateAPI } from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import { MousePointerClick, Users, TrendingUp, DollarSign, Percent, Link as LinkIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AffiliateDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await affiliateAPI.getDashboard();
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
          Affiliate Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Track your referral performance and earnings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Clicks"
          value={stats?.total_clicks || 0}
          icon={MousePointerClick}
          color="blue"
        />
        <DashboardCard
          title="Registrations"
          value={stats?.total_registrations || 0}
          icon={Users}
          color="green"
        />
        <DashboardCard
          title="Conversions"
          value={stats?.total_conversions || 0}
          icon={TrendingUp}
          color="purple"
        />
        <DashboardCard
          title="Total Earnings"
          value={`$${stats?.total_earnings?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          color="orange"
        />
      </div>

      {/* Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card shadow-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            Conversion Funnel
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Clicks</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  {stats?.total_clicks || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-lg" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Registrations</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  {stats?.total_registrations || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full shadow-lg transition-all duration-500"
                  style={{
                    width: stats?.total_clicks > 0
                      ? `${(stats.total_registrations / stats.total_clicks * 100)}%`
                      : '0%'
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Conversions (Deposits)</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  {stats?.total_conversions || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full shadow-lg transition-all duration-500"
                  style={{
                    width: stats?.total_registrations > 0
                      ? `${(stats.total_conversions / stats.total_registrations * 100)}%`
                      : '0%'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-100 dark:border-blue-800/30 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                  <Percent className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.conversion_rate || 0}%</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-100 dark:border-green-800/30 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">CPA Amount</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats?.cpa_amount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-orange-100 dark:border-orange-800/30 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Withdrawable Balance</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats?.withdrawable_balance?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clicks Chart */}
        <div className="card shadow-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            Last 7 Days Clicks
          </h2>
          {stats?.clicks_chart?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.clicks_chart}>
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
                <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No click data yet
            </div>
          )}
        </div>

        {/* Earnings Chart */}
        <div className="card shadow-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-6">
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
                <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No earnings data yet
            </div>
          )}
        </div>
      </div>

      {/* Referral Link Quick Access */}
      <div className="card shadow-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-blue-200 dark:border-blue-800/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Referral Link</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Share this link to start earning commissions</p>
            <code className="block bg-white dark:bg-gray-800 px-4 py-3 rounded-xl text-sm text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800/50 font-mono break-all">
              {stats?.referral_url || 'Loading...'}
            </code>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(stats?.referral_url || '');
              alert('Referral link copied!');
            }}
            className="btn-primary whitespace-nowrap"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
