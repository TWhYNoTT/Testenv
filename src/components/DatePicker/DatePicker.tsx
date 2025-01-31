import React, { useState } from 'react';
import styles from './DatePicker.module.css';

const daysOfWeek = ['Su', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatDate = (date: Date) => ({
    dayName: daysOfWeek[date.getDay()],
    dayNumber: date.getDate(),
});

interface DatePickerProps {
    onDateChange: (date: string) => void;
    selectedDate: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange, selectedDate }) => {


    const [rangeStartDate, setRangeStartDate] = useState(() => {
        const today = new Date();
        today.setDate(today.getDate() - today.getDay());
        return today;
    });
    const [selectedDateF, setSelectedDatef] = useState<string>(selectedDate);

    const dates = Array.from({ length: 7 }, (_, i) => {
        const newDate = new Date(rangeStartDate);
        newDate.setDate(rangeStartDate.getDate() + i);
        return newDate;
    });

    const updateSelectedDate = (date: Date) => {
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        onDateChange(formattedDate);
        setSelectedDatef(formattedDate);
    };

    const handlePrevious = () => {
        const newStartDate = new Date(rangeStartDate);
        newStartDate.setDate(rangeStartDate.getDate() - 7);
        setRangeStartDate(newStartDate);
        updateSelectedDate(newStartDate);
    };

    const handleNext = () => {
        const newStartDate = new Date(rangeStartDate);
        newStartDate.setDate(rangeStartDate.getDate() + 7);
        setRangeStartDate(newStartDate);
        updateSelectedDate(newStartDate);
    };

    const handleDateClick = (date: Date) => {
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        setSelectedDatef(formattedDate);

    };



    return (
        <div className={styles.datePicker}>
            <div className={styles.navButton} onClick={handlePrevious}>
                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="29" y="29" width="29" height="29" rx="10.6842" transform="rotate(-180 29 29)" fill="white" />
                    <path d="M15 10L10.976 14L15 18" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className={styles.dates}>
                {dates.map(date => {
                    const { dayName, dayNumber } = formatDate(date);
                    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    return (
                        <div
                            key={date.toDateString()}
                            className={`${styles.date} ${formattedDate === selectedDateF ? styles.selected : ''}`}
                            onClick={() => handleDateClick(date)}
                        >
                            <span className={styles.dayName}>{dayName}</span>
                            <span className={styles.dayNumber}>{dayNumber}</span>
                        </div>
                    );
                })}
            </div>
            <div className={styles.navButton} onClick={handleNext}>
                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="29" height="29" rx="10.6842" fill="white" />
                    <path d="M14 19L18.024 15L14 11" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
};

export default DatePicker;
