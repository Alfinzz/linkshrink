import { useEffect, useState } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
};

const COLORS = {
  success: {
    bg: "bg-green-50 border-green-200",
    icon: "text-green-500",
    text: "text-green-800"
  },
  error: {
    bg: "bg-red-50 border-red-200",
    icon: "text-red-500",
    text: "text-red-800"
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: "text-blue-500",
    text: "text-blue-800"
  }
};

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = ICONS[type];
  const colors = COLORS[type];

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all duration-300 ${colors.bg} ${
        visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
      style={{ minWidth: 280, maxWidth: 400 }}
    >
      <Icon size={18} className={colors.icon} />
      <p className={`text-sm font-medium flex-1 ${colors.text}`}>{message}</p>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        <X size={14} />
      </button>
    </div>
  );
}
