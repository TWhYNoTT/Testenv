import React, { useState, useEffect } from 'react';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import Toggle from '../Toggle/Toggle';
import styles from './EmployeeModal.module.css';
import { useAuthContext } from '../../contexts/AuthContext';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: any;
    onSave: (employee: any) => void;
    isAdd?: boolean;
    onDeleteClicked: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave,
    onDeleteClicked,
    isAdd
}) => {
    const [data, setData] = useState<any>(initialData || {
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
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
            password: '',
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
        onSave(data);
    };

    const handleDelete = () => {
        onDeleteClicked();
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
                <div className={styles.headerCloseInputsContainer}>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                    <h2 className={`${styles.header} headerText`}>{isAdd ? 'Add Employee' : 'Edit Employee'}</h2>

                    <InputField
                        label="Full Name"
                        name="fullName"
                        value={data.fullName}
                        onChange={(value) => handleInputChange('fullName', value)}
                        placeholder="Employee Full Name"
                        required
                    />

                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(value) => handleInputChange('email', value)}
                        placeholder="Email Address"
                        required
                    />

                    <InputField
                        label="Phone Number"
                        name="phoneNumber"
                        value={data.phoneNumber}
                        onChange={(value) => handleInputChange('phoneNumber', value)}
                        placeholder="Phone Number"
                        required
                    />

                    {isAdd && (
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(value) => handleInputChange('password', value)}
                            placeholder="Password"
                            required
                        />
                    )}

                    <InputField
                        label="Position"
                        name="position"
                        value={data.position || ''}
                        onChange={(value) => handleInputChange('position', value)}
                        placeholder="e.g. Stylist, Manager, etc."
                    />

                    {/* Role selector - show when user can manage staff (add or edit) */}
                    {canManageStaff && (
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>Role</label>
                            <select
                                value={data.role}
                                onChange={(e) => setData({ ...data, role: parseInt(e.target.value) })}
                                className={styles.select}
                            >
                                <option value={1}>Staff Manager</option>
                                <option value={2}>Staff</option>
                            </select>
                        </div>
                    )}

                    <div className={styles.toggleContainer}>
                        <Toggle
                            messageIfChecked='Active'
                            messageIfNotChecked='Inactive'
                            checked={data.isActive}
                            onChange={handleToggleChange}
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
                        <Button label="Cancel" onClick={onClose} noAppearance={true} size='small' />
                        <Button label={isAdd ? 'Add' : 'Save'} onClick={handleSave} size='small' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;