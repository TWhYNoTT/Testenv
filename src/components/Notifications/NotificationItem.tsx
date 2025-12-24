import React from 'react';
import { NotificationDto, NotificationType } from '../../types/notifications';
import { formatDistanceToNow } from 'date-fns';
import styles from './NotificationPanel.module.css';

interface NotificationItemProps {
    notification: NotificationDto;
    onClick: () => void;
    onDelete: () => void;
}

const getNotificationIcon = (type: NotificationType): string => {
    switch (type) {
        case NotificationType.NewAppointment:
            return '📅';
        case NotificationType.AppointmentCancelled:
            return '❌';
        case NotificationType.AppointmentCompleted:
            return '✅';
        case NotificationType.NewStaffJoined:
            return '👤';
        case NotificationType.PromotionExpiring:
            return '⏰';
        case NotificationType.System:
        default:
            return '🔔';
    }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick, onDelete }) => {
    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <div
            className={`${styles.notificationItem} ${notification.isRead ? styles.read : styles.unread}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
        >
            <div className={styles.itemIcon}>
                {getNotificationIcon(notification.type)}
            </div>

            <div className={styles.itemContent}>
                <p className={styles.itemTitle}>{notification.title}</p>
                {notification.message && (
                    <p className={styles.itemMessage}>{notification.message}</p>
                )}
                <span className={styles.itemTime}>{timeAgo}</span>
            </div>

            <button
                className={styles.deleteButton}
                onClick={handleDelete}
                aria-label="Delete notification"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
};

export default NotificationItem;
