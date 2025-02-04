import React, { useEffect } from 'react';
import styles from './Toast.module.css';

type ToastType = 'error' | 'success' | 'warning' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'error',
    onClose,
    duration = 5000
}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            {message}
            <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
    );
};

export default Toast;
