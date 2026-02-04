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
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;