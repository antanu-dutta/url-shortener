import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

const typeStyles = {
  success: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-800",
    icon: <XCircle className="w-5 h-5 text-red-600" />,
  },
  warning: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: <Info className="w-5 h-5 text-blue-600" />,
  },
};

const NotificationToast = ({ type = "info", message, t }) => {
  const { bg, text, icon } = typeStyles[type] || typeStyles.info;

  return (
    <AnimatePresence>
      {t.visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`${bg} ${text} flex items-center gap-3 px-4 py-3 rounded shadow-lg border border-gray-200 w-[320px]`}
        >
          <div className="flex-shrink-0">{icon}</div>
          <p className="text-sm font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
