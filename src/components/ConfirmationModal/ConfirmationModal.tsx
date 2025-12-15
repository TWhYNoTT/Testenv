import React from 'react';
import Button from '../Button/Button';
import styles from './ConfirmationModal.module.css';

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: string;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmColor
}) => {
    return (
        <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContent} ${isOpen ? styles.open : ''}`}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                <div className={styles.textContainer}>
                    <h2 className={styles.header}>{title}</h2>
                    <p className={styles.descText}>{message}</p>
                </div>
                <div className={styles.buttonsContainer}>
                    <Button label={cancelLabel} onClick={onClose} noAppearance={true} size='small' />
                    <div>
                        <Button
                            label={confirmLabel}
                            onClick={onConfirm}
                            size='medium'
                            backgroundColor={confirmColor}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
