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
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row.status === 'ACTIVE' || row.status === 'active'
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
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
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            row.status === 'ACTIVE' || row.status === 'active'
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {row.status === 'ACTIVE' || row.status === 'active' ? 'Block' : 'Unblock'}
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Players</h1>
          <p className="text-gray-600 mt-1">Manage your players</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Add Player'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {showForm && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Player</h2>
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
