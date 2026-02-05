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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
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
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
