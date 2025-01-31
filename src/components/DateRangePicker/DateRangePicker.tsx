import React, { useState } from 'react';
import Calendar from '../Calendar/Calendar';
import Checkbox from '../Checkbox/Checkbox';
import styles from './DateRangePicker.module.css';

const DateRangePicker: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedRange, setSelectedRange] = useState<string>('alltime');



    const handleRangeChange = (range: string) => {
        setSelectedRange(range);
        if (range !== 'dateselected') {
            setSelectedDate(null);
        }
    };



    return (
        <div className={styles.dateRangePicker}>
            <div className={styles.checkboxGroup}>
                <Checkbox
                    label="All-time"
                    checked={selectedRange === 'alltime'}
                    onChange={() => handleRangeChange('alltime')}
                    variant="button"
                />
                <Checkbox
                    label="Last 7 days"
                    checked={selectedRange === 'last7days'}
                    onChange={() => handleRangeChange('last7days')}
                    variant="button"
                />
                <Checkbox
                    label="Last 30 days"
                    checked={selectedRange === 'last30days'}
                    onChange={() => handleRangeChange('last30days')}
                    variant="button"
                />

                <div className={styles.datePicker} >
                    <span>Date</span>
                    <Calendar
                        onDateChange={(date) => {
                            setSelectedDate(date);
                            handleRangeChange('dateselected');
                        }}
                        selectedDate={selectedDate!}
                        value={selectedRange}
                    />
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;
