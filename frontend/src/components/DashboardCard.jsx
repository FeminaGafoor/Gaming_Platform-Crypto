const DashboardCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-xl shadow-blue-500/20',
    green: 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/20',
    blue: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/20',
    purple: 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl shadow-purple-500/20',
    orange: 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/20',
  };

  return (
    <div className="card group hover:scale-105 transition-all duration-300 cursor-default">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl ${colorClasses[color]} transform group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            trend > 0
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{value}</p>
    </div>
  );
};

export default DashboardCard;