import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  studentProfile: any;
  tasks: any[];
}

export default function NotificationSystem({ studentProfile, tasks }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    generateNotifications();
    const interval = setInterval(generateNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [studentProfile, tasks]);

  const generateNotifications = () => {
    const newNotifications: Notification[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    // Study reminders
    if (currentHour === 8 && now.getMinutes() === 0) {
      newNotifications.push({
        id: `reminder-morning-${Date.now()}`,
        type: 'reminder',
        title: 'Morning Study Time!',
        message: 'Time for your morning speaking practice session.',
        timestamp: now,
        read: false,
        action: {
          label: 'Start Practice',
          onClick: () => console.log('Start morning practice')
        }
      });
    }

    // Progress notifications
    const completedTasks = tasks.filter(t => t.completed >= t.dailyTarget).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    if (completionRate >= 80 && completionRate < 100) {
      newNotifications.push({
        id: `progress-${Date.now()}`,
        type: 'success',
        title: 'Great Progress!',
        message: `You've completed ${completedTasks}/${totalTasks} tasks today. Keep it up!`,
        timestamp: now,
        read: false
      });
    }

    // Streak notifications
    const startDate = new Date(studentProfile.startDate);
    const currentDay = Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (currentDay % 7 === 0) {
      newNotifications.push({
        id: `streak-${Date.now()}`,
        type: 'success',
        title: 'Week Complete!',
        message: `Congratulations! You've completed ${currentDay / 7} week(s) of consistent study.`,
        timestamp: now,
        read: false
      });
    }

    // Mock test reminders
    if (currentDay === 15 || currentDay === 22 || currentDay === 27) {
      newNotifications.push({
        id: `mock-test-${Date.now()}`,
        type: 'info',
        title: 'Mock Test Available',
        message: 'A new mock test is ready for you to assess your progress.',
        timestamp: now,
        read: false,
        action: {
          label: 'Take Test',
          onClick: () => console.log('Navigate to mock test')
        }
      });
    }

    // Add new notifications to existing ones
    setNotifications(prev => {
      const existing = prev.filter(n => 
        !newNotifications.some(newN => newN.id === n.id)
      );
      return [...newNotifications, ...existing].slice(0, 10); // Keep only 10 most recent
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Info className="h-5 w-5 text-blue-600" />;
      case 'reminder': return <Clock className="h-5 w-5 text-purple-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'reminder': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 ${
                    !notification.read ? 'bg-blue-50' : 'bg-white'
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-start space-x-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Mark as read
                          </button>
                        )}
                        {notification.action && (
                          <button
                            onClick={() => {
                              notification.action!.onClick();
                              markAsRead(notification.id);
                            }}
                            className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}