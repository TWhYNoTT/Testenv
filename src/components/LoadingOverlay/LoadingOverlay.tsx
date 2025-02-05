import React from 'react';
import styles from './loadingOverlay.module.css';

interface LoadingOverlayProps {
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <div className={styles.spinner}></div>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
