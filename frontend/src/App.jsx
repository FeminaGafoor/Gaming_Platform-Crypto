import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import AgentDashboard from './pages/agent/Dashboard';
import AgentPlayers from './pages/agent/Players';
import AgentCommissions from './pages/agent/Commissions';
import AgentWithdrawals from './pages/agent/Withdrawals';
import AffiliateDashboard from './pages/affiliate/Dashboard';
import AffiliateReferralLinks from './pages/affiliate/ReferralLinks';
import AffiliateClicks from './pages/affiliate/Clicks';
import AffiliateConversions from './pages/affiliate/Conversions';
import AffiliateCommissions from './pages/affiliate/Commissions';
import AffiliateWithdrawals from './pages/affiliate/Withdrawals';
import AffiliateMarketing from './pages/affiliate/Marketing';
import AdminWithdrawals from './pages/admin/Withdrawals';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const redirectPath = user?.role === 'agent' ? '/agent/dashboard' : '/affiliate/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 dark:bg-pink-500/3 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{animationDelay: '3s'}}></div>

      <div className="relative z-10">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Agent Routes */}
          <Route path="/agent/dashboard" element={<ProtectedRoute requiredRole="agent"><DashboardLayout><AgentDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/agent/players" element={<ProtectedRoute requiredRole="agent"><DashboardLayout><AgentPlayers /></DashboardLayout></ProtectedRoute>} />
          <Route path="/agent/commissions" element={<ProtectedRoute requiredRole="agent"><DashboardLayout><AgentCommissions /></DashboardLayout></ProtectedRoute>} />
          <Route path="/agent/withdrawals" element={<ProtectedRoute requiredRole="agent"><DashboardLayout><AgentWithdrawals /></DashboardLayout></ProtectedRoute>} />
          
          {/* Affiliate Routes */}
          <Route path="/affiliate/dashboard" element={<ProtectedRoute requiredRole="affiliate"><DashboardLayout><AffiliateDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/affiliate/referral-links" element={<ProtectedRoute requiredRole="affiliate"><DashboardLayout><AffiliateReferralLinks /></DashboardLayout></ProtectedRoute>} />
          <Route path="/affiliate/clicks" element={<ProtectedRoute requiredRole="affiliate"><DashboardLayout><AffiliateClicks /></DashboardLayout></ProtectedRoute>} />
          <Route path="/affiliate/conversions" element={<ProtectedRoute requiredRole="affiliate"><DashboardLayout><AffiliateConversions /></DashboardLayout></ProtectedRoute>} />
          <Route path="/affiliate/commissions" element={<ProtectedRoute requiredRole="affiliate"><DashboardLayout><AffiliateCommissions /></DashboardLayout></ProtectedRoute>} />
          <Route path="/affiliate/withdrawals" element={<ProtectedRoute requiredRole="affiliate"><DashboardLayout><AffiliateWithdrawals /></DashboardLayout></ProtectedRoute>} />
          <Route path="/affiliate/marketing" element={<ProtectedRoute requiredRole="affiliate"><DashboardLayout><AffiliateMarketing /></DashboardLayout></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/withdrawals" element={<ProtectedRoute requiredRole="admin"><DashboardLayout><AdminWithdrawals /></DashboardLayout></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
