import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './TimePicker.module.css';

type TimePickerProps = {
    label?: string;
    value?: string;
    selectedTime?: string;
    onTimeChange?: (time: string) => void;
    leftAligned?: boolean;
    noBorderRadius?: boolean;
    message?: string;
    disabled?: boolean;
};

const TimePicker: React.FC<TimePickerProps> = ({
    label = '',
    value = 'Select time',
    selectedTime,
    onTimeChange = () => { },
    leftAligned = false,
    noBorderRadius = false,
    message = '',
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalSelectedTime, setInternalSelectedTime] = useState<string>('');
    const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
    const timePickerRef = useRef<HTMLDivElement>(null);

    // Generate time slots in 15-minute intervals (12 hours only)
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = 12; hour >= 1; hour--) {
            for (let minute = 0; minute < 60; minute += 15) {
                const displayMinute = minute.toString().padStart(2, '0');
                const timeString = `${hour}:${displayMinute}`;
                slots.push(timeString);
            }
        }
        // Sort to get proper order: 12:00, 12:15, ..., 1:00, 1:15, ..., 11:45
        return slots.sort((a, b) => {
            const [aHour, aMin] = a.split(':').map(Number);
            const [bHour, bMin] = b.split(':').map(Number);

            const aTime = (aHour === 12 ? 0 : aHour) * 60 + aMin;
            const bTime = (bHour === 12 ? 0 : bHour) * 60 + bMin;

            return aTime - bTime;
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (selectedTime) {
            // Parse selectedTime like "1:30 PM"
            const [timePart, period] = selectedTime.split(' ');
            if (timePart && period) {
                setInternalSelectedTime(timePart);
                setSelectedPeriod(period as 'AM' | 'PM');
            }
        }
    }, [selectedTime]);

    const handleTimeClick = (time: string) => {
        setInternalSelectedTime(time);
        const fullTime = `${time} ${selectedPeriod}`;
        onTimeChange(fullTime);
        // Don't close automatically - let user adjust AM/PM if needed
    };

    const handlePeriodChange = (period: 'AM' | 'PM') => {
        setSelectedPeriod(period);
        if (internalSelectedTime) {
            const fullTime = `${internalSelectedTime} ${period}`;
            onTimeChange(fullTime);
        }
    };

    const toggleTimePicker = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const displayValue = internalSelectedTime && selectedPeriod
        ? `${internalSelectedTime} ${selectedPeriod}`
        : value;

    return (
        <div className={styles.timePickerWrapper} ref={timePickerRef}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.dropdown} onClick={toggleTimePicker}>
                <div className={`${styles.selected} ${isOpen ? styles.isOpen : ''} ${noBorderRadius ? styles.noBorderRadius : ''} ${disabled ? styles.disabled : ''}`}>
                    {displayValue}
                </div>
                {isOpen && (
                    <div className={`${styles.timePickerContainer} ${leftAligned ? styles.leftAligned : ''}`} onClick={(e) => { e.stopPropagation() }}>
                        <div className={styles.periodSelector}>
                            <button
                                type="button"
                                className={`${styles.periodButton} ${selectedPeriod === 'AM' ? styles.activePeriod : ''}`}
                                onClick={() => handlePeriodChange('AM')}
                            >
                                AM
                            </button>
                            <button
                                type="button"
                                className={`${styles.periodButton} ${selectedPeriod === 'PM' ? styles.activePeriod : ''}`}
                                onClick={() => handlePeriodChange('PM')}
                            >
                                PM
                            </button>
                        </div>
                        <div className={styles.timeSlots}>
                            {timeSlots.map((time, index) => (
                                <div
                                    key={index}
                                    className={`${styles.timeSlot} ${internalSelectedTime === time ? styles.selectedTime : ''}`}
                                    onClick={() => handleTimeClick(time)}
                                >
                                    {time}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {message && <div className={styles.message}>{message}</div>}
        </div>
    );
};

export default TimePicker;