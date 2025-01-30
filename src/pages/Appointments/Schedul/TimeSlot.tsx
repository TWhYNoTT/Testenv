import React from 'react';
import styles from './TimeSlot.module.css';

interface TimeSlotsProps {
    times: string[];
    onTimeSlotClick: (time: string) => void;
    selectedTime: string | null;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ times, onTimeSlotClick, selectedTime }) => {
    return (
        <div className={styles.timeSlots}>
            {times.map((time, index) => (
                <div
                    key={index}
                    className={`${styles.timeSlot} ${selectedTime === time ? styles.active : ''}`}
                    onClick={() => onTimeSlotClick(time)}
                >
                    {time}
                </div>
            ))}
        </div>
    );
};

export default TimeSlots;
