import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CreditCard,
  Link as LinkIcon,
  MousePointerClick,
  TrendingUp,
  Package,
} from 'lucide-react';

const Sidebar = () => {
  const { isAgent, isAffiliate } = useAuth();

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

  const links = isAgent ? agentLinks : affiliateLinks;

  return (
    <aside className="w-64 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 min-h-screen p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
              }`
            }
          >
            <link.icon className={`w-5 h-5 ${!isActive && 'group-hover:scale-110 transition-transform'}`} />
            <span className="font-semibold">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;