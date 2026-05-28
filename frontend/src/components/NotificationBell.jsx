import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bell, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationBell = ({ role, userId, buttonClass }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/notifications/admin`;
      if (role === "warga" && userId) {
        url = `${import.meta.env.VITE_API_URL}/api/notifications/user/${userId}`;
      }
      const res = await axios.get(url);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Optional: Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [role, userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const defaultButtonClass = "relative bg-white p-3 rounded-2xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm";

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClass || defaultButtonClass}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Notifikasi</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                  {unreadCount} Baru
                </span>
              )}
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm font-medium">
                  Belum ada notifikasi
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => !notif.isRead && markAsRead(notif.id)}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                        !notif.isRead ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {!notif.isRead ? (
                          <Circle className="text-indigo-500 fill-indigo-500" size={10} />
                        ) : (
                          <CheckCircle2 className="text-slate-300" size={14} />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm ${!notif.isRead ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                          {notif.pesan}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                          {new Date(notif.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
