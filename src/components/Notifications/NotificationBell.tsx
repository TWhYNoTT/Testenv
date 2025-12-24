import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationItem from './NotificationItem';
import styles from './NotificationPanel.module.css';

interface NotificationBellProps {
    className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const {
        notifications,
        unreadCount,
        loading,
        error,
        refresh,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll
    } = useNotifications();

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowConfirmClear(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleBellClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            refresh();
        }
    };

    const handleNotificationClick = (id: number) => {
        markAsRead(id);
    };

    const handleMarkAllRead = () => {
        markAllAsRead();
    };

    const handleClearAll = () => {
        setShowConfirmClear(true);
    };

    const confirmClearAll = () => {
        clearAll();
        setShowConfirmClear(false);
    };

    const cancelClearAll = () => {
        setShowConfirmClear(false);
    };

    const hasNotifications = notifications.length > 0;

    return (
        <div className={`${styles.notificationContainer} ${className || ''}`} ref={panelRef}>
            {/* Bell Icon */}
            <button
                className={styles.bellButton}
                onClick={handleBellClick}
                aria-label="Notifications"
            >
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.538 14.8979C18.0376 14.2266 17.4537 13.5553 17.1201 12.8001C16.4528 11.2897 16.3694 9.61146 16.286 7.93323C16.2026 7.09412 16.1192 6.25501 15.8689 5.4998C15.1182 3.15028 12.7828 1.38815 10.3639 1.30423C7.69474 1.22032 5.19244 2.47899 4.27493 4.82851C3.94129 5.66763 3.77447 6.59065 3.77447 7.51368C3.60765 10.2828 3.44083 13.0518 1.27217 15.2335C0.688303 15.8209 1.10535 16.5761 1.93945 16.66C2.18968 16.66 2.3565 16.66 2.60673 16.66C5.10903 16.66 7.52793 16.66 10.0302 16.66C12.6159 16.66 15.2851 16.66 17.8708 16.66C18.2878 16.66 18.7049 16.5761 18.9551 16.0726C19.1219 15.5692 18.7883 15.3174 18.538 14.8979Z" stroke="#909FBA" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.1991 19.3451C11.6986 20.0164 10.948 20.3521 10.0305 20.436C9.11298 20.3521 8.3623 20.0164 7.77844 19.2612" stroke="#909FBA" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {unreadCount > 0 && (
                    <span className={styles.badge}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {isOpen && (
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3>Notifications</h3>
                        {hasNotifications && (
                            <div className={styles.headerActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={handleMarkAllRead}
                                    disabled={unreadCount === 0}
                                >
                                    Mark All Read
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.clearButton}`}
                                    onClick={handleClearAll}
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.panelContent}>
                        {loading && (
                            <div className={styles.loadingState}>
                                <div className={styles.spinner}></div>
                                <p>Loading notifications...</p>
                            </div>
                        )}

                        {error && !loading && (
                            <div className={styles.errorState}>
                                <p>{error}</p>
                                <button onClick={refresh} className={styles.retryButton}>
                                    Try Again
                                </button>
                            </div>
                        )}

                        {!loading && !error && !hasNotifications && (
                            <div className={styles.emptyState}>
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="24" r="23" stroke="#E5E7EB" strokeWidth="2" />
                                    <path d="M16 24L22 30L32 18" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p>You're all caught up!</p>
                            </div>
                        )}

                        {!loading && !error && hasNotifications && (
                            <div className={styles.notificationList}>
                                {notifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onClick={() => handleNotificationClick(notification.id)}
                                        onDelete={() => deleteNotification(notification.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear All Confirmation */}
                    {showConfirmClear && (
                        <div className={styles.confirmOverlay}>
                            <div className={styles.confirmDialog}>
                                <p>Are you sure you want to clear all notifications?</p>
                                <div className={styles.confirmActions}>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={cancelClearAll}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={styles.confirmButton}
                                        onClick={confirmClearAll}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
