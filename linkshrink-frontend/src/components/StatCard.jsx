export default function StatCard({ label, value, subtitle, icon: Icon, iconColor = "text-primary-600", iconBg = "bg-primary-50" }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
