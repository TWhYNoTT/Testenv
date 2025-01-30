import React from 'react';
import styles from './ProgressBar.module.css';

type ProgressBarProps = {
    label?: string;
    progress: number;
    color?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
    label = '',
    progress,
    color = '#6138e0',
}) => {
    return (
        <div className={styles.progressBarContainer}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.progressBar}>
                <div
                    className={styles.progress}
                    style={{ width: `${progress}%`, backgroundColor: color }}
                />
            </div>

        </div>
    );
};

export default ProgressBar;
