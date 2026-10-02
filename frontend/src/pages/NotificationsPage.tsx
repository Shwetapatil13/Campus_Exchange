import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Heart, Info, Tag } from 'lucide-react';
import { NotificationResponse } from '../types';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export const NotificationsPage: React.FC = () => {
  const { refreshUnreadCount } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      showToast('Failed to load notifications', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      const updated = await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
      refreshUnreadCount();
    } catch (err) {
      showToast('Failed to update notification', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      refreshUnreadCount();
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      showToast('Failed to update notifications', 'error');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'WISHLIST_ADDED':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'PRODUCT_INQUIRY':
        return <Tag className="w-5 h-5 text-brand-500" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Notifications</h1>
            <p className="text-xs text-slate-500 mt-1">Updates on your products, wishlist items, and account</p>
          </div>
        </div>

        {hasUnread && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4 mr-1" /> Mark All Read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-500">Loading notifications...</div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.read && handleMarkAsRead(item.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-4 cursor-pointer ${
                !item.read
                  ? 'bg-brand-500/5 border-brand-500/30 dark:bg-brand-950/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                    {item.message}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>

              {!item.read && (
                <span className="w-2.5 h-2.5 bg-brand-600 rounded-full shrink-0 mt-2 animate-pulse" title="Unread" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="w-12 h-12 text-slate-400" />}
          title="No Notifications Yet"
          description="When other students wishlist your items or interact with your listings, notifications will appear here."
        />
      )}

    </div>
  );
};
