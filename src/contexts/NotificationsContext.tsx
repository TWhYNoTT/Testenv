import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api';
import { NotificationDto, NotificationListResponse } from '../types/notifications';
import { useAuthContext } from './AuthContext';
import { useToast } from './ToastContext';
import * as signalR from '@microsoft/signalr';

interface NotificationsContextType {
    notifications: NotificationDto[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: number) => Promise<void>;
    clearAll: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const SIGNALR_HUB_URL = 'https://devanza-dev-backend.azurewebsites.net/hubs/notifications';
// const SIGNALR_HUB_URL = 'http://localhost:5279/hubs/notifications';

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { accessToken, businessId, isAuthenticated } = useAuthContext();
    const { showToast } = useToast();
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    const refresh = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);

        try {
            const response = await apiService.getNotifications();
            setNotifications(response.notifications);
            setUnreadCount(response.unreadCount);
        } catch (err) {
            setError('Unable to load notifications. Please refresh or check back later.');
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const markAsRead = useCallback(async (id: number) => {
        try {
            await apiService.markNotificationAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            showToast('Unable to mark notification as read. Please try again.', 'error');
        }
    }, [showToast]);

    const markAllAsRead = useCallback(async () => {
        try {
            await apiService.markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            showToast('Unable to mark all notifications as read. Please try again.', 'error');
        }
    }, [showToast]);

    const deleteNotification = useCallback(async (id: number) => {
        try {
            await apiService.deleteNotification(id);
            const notification = notifications.find(n => n.id === id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (notification && !notification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            showToast('Unable to clear the notification. Please try again.', 'error');
        }
    }, [notifications, showToast]);

    const clearAll = useCallback(async () => {
        try {
            await apiService.clearAllNotifications();
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            showToast('Unable to clear all notifications. Please try again.', 'error');
        }
    }, [showToast]);

    // Request browser notification permission
    useEffect(() => {
        if (isAuthenticated && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, [isAuthenticated]);

    // Initial load
    useEffect(() => {
        if (isAuthenticated) {
            refresh();
        }
    }, [isAuthenticated, refresh]);

    // SignalR connection for real-time updates
    useEffect(() => {
        if (!isAuthenticated || !accessToken || !businessId) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(SIGNALR_HUB_URL, {
                accessTokenFactory: () => accessToken
            })
            .withAutomaticReconnect()
            .build();

        connection.on('OnNewNotification', (notification: NotificationDto) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
                try {
                    new Notification(notification.title, {
                        body: notification.message || '',
                        icon: '/assets/icons/layout/logo.png',
                        tag: `notification-${notification.id}` // Prevents duplicate notifications
                    });
                } catch (e) {
                    console.error('Failed to show browser notification:', e);
                }
            }
        });

        connection.on('OnNotificationRead', (notificationId: number) => {
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        });

        connection.on('OnAllNotificationsRead', () => {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        });

        connection.on('OnNotificationDeleted', (notificationId: number) => {
            setNotifications(prev => {
                const notification = prev.find(n => n.id === notificationId);
                if (notification && !notification.isRead) {
                    setUnreadCount(c => Math.max(0, c - 1));
                }
                return prev.filter(n => n.id !== notificationId);
            });
        });

        connection.on('OnAllNotificationsCleared', () => {
            setNotifications([]);
            setUnreadCount(0);
        });

        let isCancelled = false;

        connection.start()
            .then(() => {
                if (!isCancelled) {
                    console.log('SignalR connected successfully');
                    connection.invoke('JoinBusinessGroup', businessId)
                        .catch((err: Error) => console.error('Failed to join business group:', err));
                }
            })
            .catch((err: Error) => {
                if (!isCancelled) {
                    console.error('SignalR Connection Error:', err);
                }
            });

        connectionRef.current = connection;

        return () => {
            isCancelled = true;
            if (connectionRef.current) {
                connectionRef.current.invoke('LeaveBusinessGroup', businessId).catch(() => { });
                connectionRef.current.stop();
                connectionRef.current = null;
            }
        };
    }, [isAuthenticated, accessToken, businessId]);

    return (
        <NotificationsContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            error,
            refresh,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            clearAll
        }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationsProvider');
    }
    return context;
};
