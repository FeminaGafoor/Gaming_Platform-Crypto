import { useState, useEffect } from 'react';
import { agentAPI } from '../../services/api';
import DataTable from '../../components/DataTable';
import { UserPlus, AlertCircle } from 'lucide-react';

const AgentPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await agentAPI.getPlayers();
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await agentAPI.createPlayer(formData);
      setSuccess('Player created successfully!');
      setShowForm(false);
      setFormData({ username: '', email: '' });
      fetchPlayers();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create player');
    }
  };

  const togglePlayerStatus = async (playerId) => {
    try {
      await agentAPI.togglePlayerStatus(playerId);
      fetchPlayers();
    } catch (error) {
      console.error('Error toggling player status:', error);
      alert('Failed to toggle player status');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
          row.status === 'ACTIVE' || row.status === 'active'
            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/30'
            : 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-red-500/30'
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      key: 'total_deposits', 
      label: 'Deposits', 
      render: (row) => `$${(row.total_deposits || 0).toFixed(2)}` 
    },
    { 
      key: 'total_losses', 
      label: 'Losses', 
      render: (row) => `$${(row.total_losses || 0).toFixed(2)}` 
    },
    { 
      key: 'created_at', 
      label: 'Joined', 
      render: (row) => new Date(row.created_at).toLocaleDateString() 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => togglePlayerStatus(row.id)}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 shadow-lg ${
            row.status === 'ACTIVE' || row.status === 'active'
              ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white hover:from-red-500 hover:to-pink-600 shadow-red-500/30'
              : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 shadow-green-500/30'
          }`}
        >
          {row.status === 'ACTIVE' || row.status === 'active' ? 'Block' : 'Unblock'}
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Players
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your players</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>{showForm ? 'Cancel' : 'Add Player'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl flex items-center space-x-3 shadow-lg animate-pulse">
          <AlertCircle className="w-6 h-6" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-6 py-4 rounded-2xl shadow-lg font-medium">
          {success}
        </div>
      )}

      {showForm && (
        <div className="card shadow-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">Add New Player</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input"
                placeholder="player123"
                required
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="player@example.com"
                required
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800/30 rounded-2xl p-5 mb-4 shadow-lg">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-3 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Important Notes:</span>
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>A temporary password will be sent to the player's email</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Player can change password after first login</span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary flex-1">
                Create Player
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <DataTable columns={columns} data={players} loading={loading} />
    </div>
  );
};

export default AgentPlayers;
