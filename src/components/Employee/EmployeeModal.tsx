import React, { useState, useEffect } from 'react';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import Toggle from '../Toggle/Toggle';
import Dropdown from '../Dropdown/Dropdown';
import styles from './EmployeeModal.module.css';
import { useAuthContext } from '../../contexts/AuthContext';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: any;
    onSave: (employee: any) => void;
    isAdd?: boolean;
    onDeleteClicked: () => void;
    loading?: boolean;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave,
    onDeleteClicked,
    isAdd,
    loading = false
}) => {
    const [data, setData] = useState<any>(initialData || {
        fullName: '',
        email: '',
        phoneNumber: '',
        gender: 2,
        position: '',
        role: 2,
        isActive: true,
        schedules: [
            {
                dayOfWeek: 0,
                startTime: "09:00:00",
                endTime: "17:00:00",
                isAvailable: true
            }
        ]
    });

    const { canManageStaff } = useAuthContext();

    useEffect(() => {
        setData(initialData || {
            fullName: '',
            email: '',
            phoneNumber: '',
            gender: 2,
            position: '',
            role: 2,
            isActive: true,
            schedules: [
                {
                    dayOfWeek: 0,
                    startTime: "09:00:00",
                    endTime: "17:00:00",
                    isAvailable: true
                }
            ]
        });
    }, [initialData]);

    const handleInputChange = (field: string, value: string) => {
        setData({ ...data, [field]: value });
    };

    const handleToggleChange = (checked: boolean) => {
        setData({ ...data, isActive: checked });
    };

    const handleSave = () => {
        if (loading) return;
        onSave(data);
    };

    const handleDelete = () => {
        if (loading) return;
        onDeleteClicked();
    };

    const handleClose = () => {
        if (loading) return;
        onClose();
    };

    // Helper function to get day name
    const getDayName = (dayIndex: number) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex] || '';
    };

    // If modal is not open, don't render anything
    if (!isOpen) {
        return null;
    }

    return (
        <div className={`${styles.modalBackground} ${styles.open}`}>
            <div className={`${styles.modalContainer} ${styles.open}`}>
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}>
                            <svg viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                            </svg>
                            <span>{isAdd ? 'Sending invitation...' : 'Saving...'}</span>
                        </div>
                    </div>
                )}
                <div className={styles.headerCloseInputsContainer}>
                    <button className={styles.closeButton} onClick={handleClose} disabled={loading}>&times;</button>
                    <h2 className={`${styles.header} headerText`}>{isAdd ? 'Add Employee' : 'Edit Employee'}</h2>

                    <InputField
                        label="Full Name"
                        name="fullName"
                        value={data.fullName}
                        onChange={(value) => handleInputChange('fullName', value)}
                        placeholder="Employee Full Name"
                        required
                        disabled={loading}
                    />

                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(value) => handleInputChange('email', value)}
                        placeholder="Email Address"
                        required
                        disabled={loading}
                    />

                    <InputField
                        label="Phone Number"
                        name="phoneNumber"
                        value={data.phoneNumber}
                        onChange={(value) => handleInputChange('phoneNumber', value)}
                        placeholder="Phone Number"
                        required
                        disabled={loading}
                    />

                    {/* Gender selector (required when adding staff) */}
                    <Dropdown
                        options={["Male", "Female"]}
                        value={data.gender === 1 ? 'Male' : 'Female'}
                        onChange={(v) => {
                            const genderValue = typeof v === 'string' ? (v === 'Male' ? 1 : 2) : 2;
                            setData({ ...data, gender: genderValue });
                        }}
                        defaultMessage="Select gender"
                        disabled={loading}
                        label="Gender"
                    />

                    <InputField
                        label="Position"
                        name="position"
                        value={data.position || ''}
                        onChange={(value) => handleInputChange('position', value)}
                        placeholder="e.g. Stylist, Manager, etc."
                        disabled={loading}
                    />

                    {/* Role selector - show when user can manage staff (add or edit) */}
                    {canManageStaff && (


                        <Dropdown
                            options={["Staff Manager", "Staff"]}
                            value={data.role === 1 ? 'Staff Manager' : 'Staff'}
                            onChange={(v) => {
                                const roleValue = typeof v === 'string' ? (v === 'Staff Manager' ? 1 : 2) : 2;
                                setData({ ...data, role: roleValue });
                            }}
                            defaultMessage="Select role"
                            disabled={loading}
                            label="Role"
                        />

                    )}

                    <div className={styles.toggleContainer}>
                        <Toggle
                            messageIfChecked='Active'
                            messageIfNotChecked='Inactive'
                            checked={data.isActive}
                            onChange={handleToggleChange}
                            disabled={loading}
                        />
                    </div>

                    {/* Work Schedule Section */}
                    {!isAdd && data.schedules && data.schedules.length > 0 && (
                        <div className={styles.schedulesSection}>
                            <h3 className={styles.sectionTitle}>Work Schedule</h3>
                            <div className={styles.schedulesList}>
                                {data.schedules.map((schedule: any, index: number) => (
                                    <div key={index} className={styles.scheduleItem}>
                                        <div className={styles.dayName}>
                                            {getDayName(schedule.dayOfWeek)}
                                        </div>
                                        <div className={styles.scheduleTime}>
                                            {schedule.isAvailable ? (
                                                <span>{schedule.startTime.substring(0, 5)} - {schedule.endTime.substring(0, 5)}</span>
                                            ) : (
                                                <span className={styles.unavailable}>Not Available</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.buttonContainer}>
                    <div className={styles.deleteButton}>
                        {!isAdd && (
                            <Button
                                label="Delete employee"
                                onClick={handleDelete}
                                size='small'
                                disabled={loading}
                                icon={
                                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.7637 4.67346L12.938 17.6342C12.938 18.3814 12.3523 18.9926 11.638 18.9926H4.55157C3.838 18.9926 3.25443 18.3814 3.25443 17.6342L2.42871 4.67346" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4.57129 4.21502L4.642 2.11233C4.642 1.50106 5.03986 1 5.52486 1H10.3406C10.8263 1 11.2227 1.50106 11.2227 2.11233L11.2927 4.21502" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 4.30613H15.8671" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5.38863 7.61224L5.89792 16.5167" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7.64371 10.551L7.928 16.4851" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                                iconPosition='left'
                                noAppearance={true}
                                backgroundColor='transparent'
                                fontColor='#E52D42'
                            />
                        )}
                    </div>
                    <div className={styles.cancelAddSave}>
                        <Button label="Cancel" onClick={handleClose} noAppearance={true} size='small' disabled={loading} />
                        <Button
                            label={loading ? (isAdd ? 'Sending...' : 'Saving...') : (isAdd ? 'Add' : 'Save')}
                            onClick={handleSave}
                            size='small'
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;