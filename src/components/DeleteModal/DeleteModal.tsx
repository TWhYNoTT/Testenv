import React from 'react';
import Button from '../../components/Button/Button';
import styles from './DeleteModal.module.css';

type DeleteModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    branchName: string;
};

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onDelete, branchName }) => {
    return (
        <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContent} ${isOpen ? styles.open : ''}`}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                <div className={styles.textContainer}>
                    <h2 className={styles.header}>Delete {branchName}</h2>
                    <p className={styles.descText}>All the data will be deleted and this action is irreversible.</p>
                </div>
                <div className={styles.buttonsContainer}>
                    <Button label="Cancel" onClick={onClose} noAppearance={true} size='small' />
                    <div>
                        <Button label="Delete" onClick={onDelete} size='medium' backgroundColor='#E52D42' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;