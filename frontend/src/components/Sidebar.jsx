import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CreditCard,
  Link as LinkIcon,
  MousePointerClick,
  TrendingUp,
  Package,
  Shield,
  Menu,
  X,
} from 'lucide-react';

const Sidebar = () => {
  const { isAgent, isAffiliate, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const agentLinks = [
    { to: '/agent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agent/players', icon: Users, label: 'Players' },
    { to: '/agent/commissions', icon: DollarSign, label: 'Commissions' },
    { to: '/agent/withdrawals', icon: CreditCard, label: 'Withdrawals' },
  ];

  const affiliateLinks = [
    { to: '/affiliate/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/affiliate/referral-links', icon: LinkIcon, label: 'Referral Links' },
    { to: '/affiliate/clicks', icon: MousePointerClick, label: 'Clicks' },
    { to: '/affiliate/conversions', icon: TrendingUp, label: 'Conversions' },
    { to: '/affiliate/commissions', icon: DollarSign, label: 'Commissions' },
    { to: '/affiliate/withdrawals', icon: CreditCard, label: 'Withdrawals' },
    { to: '/affiliate/marketing', icon: Package, label: 'Marketing Assets' },
  ];

  const adminLinks = [
    { to: '/admin/withdrawals', icon: Shield, label: 'Withdrawals' },
  ];

  const links = isAdmin ? adminLinks : isAgent ? agentLinks : affiliateLinks;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
          border-r border-gray-200 dark:border-gray-800
          min-h-screen p-4
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="space-y-2 mt-16 lg:mt-0">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className={`w-5 h-5 flex-shrink-0 transition-transform ${!isActive && 'group-hover:scale-110'}`} />
                  <span className="font-semibold">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
