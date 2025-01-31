import React from 'react';
import styles from './Hint.module.css';

type HintProps = {
    name?: string;
    description?: string;
};

const Hint: React.FC<HintProps> = ({ name, description }) => {
    return (
        <div className={styles.hintCard}>
            <div className={styles.iconColumn}>
                <span className={styles.lampIcon}><img src="./assets/icons/lamb.png" alt="lamb" /></span>
            </div>
            <div className={styles.textColumn}>
                <div className={styles.hintName}>{name}</div>
                <div className={styles.hintDescription}>{description}</div>
            </div>
        </div>
    );
};

export default Hint;
