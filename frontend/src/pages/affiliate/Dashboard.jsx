import { useState, useEffect } from 'react';
import { affiliateAPI } from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import { MousePointerClick, Users, TrendingUp, DollarSign, Percent } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Affiliate Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your referral performance and earnings</p>
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
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conversion Funnel</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Clicks</span>
                <span className="text-sm font-bold text-gray-900">{stats?.total_clicks || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Registrations</span>
                <span className="text-sm font-bold text-gray-900">{stats?.total_registrations || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: stats?.total_clicks > 0 
                      ? `${(stats.total_registrations / stats.total_clicks * 100)}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Conversions (Deposits)</span>
                <span className="text-sm font-bold text-gray-900">{stats?.total_conversions || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
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

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Percent className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.conversion_rate || 0}%</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">CPA Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${stats?.cpa_amount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Withdrawable Balance</p>
                  <p className="text-2xl font-bold text-gray-900">${stats?.withdrawable_balance?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clicks Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Last 7 Days Clicks</h2>
          {stats?.clicks_chart?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.clicks_chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No click data yet
            </div>
          )}
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
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No earnings data yet
            </div>
          )}
        </div>
      </div>

      {/* Referral Link Quick Access */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Referral Link</h3>
            <p className="text-sm text-gray-600 mb-3">Share this link to start earning commissions</p>
            <code className="bg-white px-4 py-2 rounded-lg text-sm text-blue-600 border border-blue-200">
              {stats?.referral_url || 'Loading...'}
            </code>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(stats?.referral_url || '');
              alert('Referral link copied!');
            }}
            className="btn-primary"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
