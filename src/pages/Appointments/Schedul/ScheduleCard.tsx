import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppointments } from '../../../hooks/useAppointments';
import { useToast } from '../../../contexts/ToastContext';
import styles from './ScheduleCard.module.css';

interface ScheduleCardProps {
    service: string;
    customer: string;
    contact: string;
    duration: string;
    price: string;
    status: string;
    image: string;
    isShrinked: boolean;
    appointmentId?: string;
    onEdit?: (appointmentId: string) => void;
    onDelete?: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
    service, customer, contact, duration, price, status, image, isShrinked,
    appointmentId, onEdit, onDelete
}) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { deleteAppointment, loading } = useAppointments();
    const { showToast } = useToast();

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        // Calculate position for portal dropdown
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 5,
                left: rect.right - 200 // Align right edge of dropdown with menu
            });
        }

        setDropdownVisible(!isDropdownVisible);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
            menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setDropdownVisible(false);
            setShowDeleteConfirm(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close dropdown on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (isDropdownVisible || showDeleteConfirm) {
                setDropdownVisible(false);
                setShowDeleteConfirm(false);
            }
        };

        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isDropdownVisible, showDeleteConfirm]);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (appointmentId && onEdit) {
            onEdit(appointmentId);
        }
        setDropdownVisible(false);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setShowDeleteConfirm(true);
        setDropdownVisible(false);
    };

    const handleConfirmDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!appointmentId) return;

        try {
            await deleteAppointment(parseInt(appointmentId));
            showToast('Appointment deleted successfully', 'success');
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            showToast('Failed to delete appointment', 'error');
        }
        setShowDeleteConfirm(false);
    };

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setShowDeleteConfirm(false);
    };

    const statusClass = status.toLowerCase();

    // Dropdown rendered via Portal to escape overflow:hidden
    const dropdownPortal = (isDropdownVisible || showDeleteConfirm) && createPortal(
        <div
            className={styles.dropdownMenu}
            ref={dropdownRef}
            style={{
                position: 'fixed',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: '200px',
                zIndex: 10000
            }}
        >
            {isDropdownVisible && !showDeleteConfirm && (
                <>
                    <div className={styles.dropdownItem} onClick={handleEdit}>
                        <svg className={styles.icon} width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.43624 8.24985C6.32883 8.24985 6.27513 8.19614 6.22143 8.14244C6.16773 8.08874 6.16773 7.98133 6.22143 7.76652L6.86586 6.15545C6.97327 5.88693 7.18808 5.56472 7.40289 5.34991L11.5917 1.16111C11.6991 1.0537 11.8065 1 11.9676 1C12.1287 1 12.2898 1.0537 12.3972 1.16111L13.2028 1.96665C13.3102 2.07405 13.3639 2.23516 13.3639 2.39627C13.3639 2.55737 13.3102 2.71848 13.2028 2.82589L9.01396 7.01469C8.79915 7.2295 8.47694 7.44431 8.20842 7.55171L6.59735 8.24985C6.59735 8.24985 6.48994 8.24985 6.43624 8.24985Z" stroke="#333333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.3767 6.96098V14.1034C11.3767 14.6942 10.8934 15.1775 10.3027 15.1775H1.71028C1.11955 15.1775 0.63623 14.6942 0.63623 14.1034V2.82588C0.63623 2.23515 1.11955 1.75183 1.71028 1.75183H7.99348" stroke="#333333" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Edit</span>
                    </div>
                    <div className={styles.separator}></div>
                    <div className={styles.dropdownItem} onClick={handleDeleteClick}>
                        <svg className={styles.icon} width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.4762 4.31384L13.5925 17.2745C13.5925 18.0109 13.0034 18.6 12.267 18.6H4.97663C4.24023 18.6 3.65111 18.0109 3.65111 17.2745L2.84106 4.31384" stroke="#DF0000" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5.19751 4.24017L5.27115 2.1046C5.27115 1.51548 5.71299 1 6.15483 1H11.0887C11.6042 1 11.9724 1.51548 11.9724 2.1046L12.046 4.24017" stroke="#DF0000" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M1 4.24023H16.3172" stroke="#DF0000" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5.71289 7.18579L6.22837 16.1699" stroke="#DF0000" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8.21655 10.2051L8.51111 16.1699" stroke="#DF0000" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Delete</span>
                    </div>
                </>
            )}

            {showDeleteConfirm && (
                <div className={styles.confirmDelete}>
                    <p>Delete appointment?</p>
                    <div className={styles.confirmButtons}>
                        <button onClick={handleCancelDelete} className={styles.cancelBtn}>Cancel</button>
                        <button
                            onClick={handleConfirmDelete}
                            className={styles.deleteBtn}
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );

    return (
        <div className={`${styles.scheduleCard} ${styles[statusClass]} ${isShrinked ? styles.isShrinked : ''}`}>
            <div className={`${styles.menu} menu`} onClick={handleMenuClick} ref={menuRef}>
                <svg className={styles.menuIcon} viewBox="0 0 6 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.54902 5.1C1.07843 5.1 0 4 0 2.6C0 1.1 1.07843 0 2.54902 0C3.92157 0 5 1.1 5 2.6C5 4 3.92157 5.1 2.54902 5.1Z" fill="#909FBA" />
                    <path d="M2.54902 14.6C1.07843 14.6 0 13.4 0 12C0 10.6 1.07843 9.40002 2.54902 9.40002C3.92157 9.40002 5.09804 10.5 5.09804 12C5 13.4 3.92157 14.6 2.54902 14.6Z" fill="#909FBA" />
                    <path d="M2.54902 24C1.07843 24 0 22.9 0 21.4C0 20 1.07843 18.8 2.54902 18.8C3.92157 18.8 5.09804 19.9 5.09804 21.4C5 22.9 3.92157 24 2.54902 24Z" fill="#909FBA" />
                </svg>
            </div>

            {/* Dropdown rendered via Portal */}
            {dropdownPortal}

            <div className={styles.scheduleDetails}>
                <div className={styles.service}>{service}</div>
                <div className={styles.customerDetails}>
                    <img src={image} alt={customer} className={styles.customerImage} />
                    <div className={styles.customerNamePhone}>
                        <div className={styles.customerName}>{customer}</div>
                        <div className={styles.contact}>{contact}</div>
                    </div>
                </div>
                <div className={styles.durationPriceStatus}>
                    <div className={styles.durationPrice}>
                        <div className={styles.duration}>{duration}</div>
                        <div className={styles.price}>{price}</div>
                    </div>
                    <div className={`${styles.status} ${styles[statusClass]}`}>{status}</div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleCard;