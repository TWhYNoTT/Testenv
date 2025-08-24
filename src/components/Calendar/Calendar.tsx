import React, { useState, useEffect, useRef } from 'react';
import styles from './Calendar.module.css';

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

type CalendarProps = {
    label?: string;
    value?: string,
    startYear?: number;
    endYear?: number;
    startMonth?: number;
    endMonth?: number;
    startDay?: number;
    endDay?: number;
    message?: string;
    selectedDate?: Date;
    onDateChange?: (date: Date) => void;
    leftAligned?: boolean;
    noBorderRadius?: boolean;
};

const Calendar: React.FC<CalendarProps> = ({
    label = '',
    value = 'Select a date',
    startYear = 1900,
    endYear = 2100,
    startMonth = 4,
    endMonth = 5,
    startDay = 5,
    endDay = 10,
    message = '',
    selectedDate: initialSelectedDate,
    onDateChange = () => { },
    leftAligned = true,
    noBorderRadius = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialSelectedDate || null);
    const [currentMonth, setCurrentMonth] = useState(
        initialSelectedDate ? initialSelectedDate.getMonth() : new Date().getMonth()
    );
    const [currentYear, setCurrentYear] = useState(
        initialSelectedDate ? initialSelectedDate.getFullYear() : new Date().getFullYear()
    );
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
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

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

    const handleDateClick = (day: number) => {

        const newDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(newDate);
        onDateChange(newDate);
        value = 'dateselected';
        // setIsOpen(false);
    };



    const handlePrevMonth = () => {
        if (!(currentYear === startYear && currentMonth === startMonth)) {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }
        }
    };

    const handleNextMonth = () => {
        if (!(currentYear === endYear && currentMonth === endMonth)) {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        }
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newYear = parseInt(event.target.value, 10);
        if (newYear >= startYear && newYear <= endYear) {
            setCurrentYear(newYear);
        }
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (
            !((currentYear === startYear && parseInt(event.target.value, 10) < startMonth) ||
                (currentYear === endYear && parseInt(event.target.value, 10) > endMonth))
        )
            setCurrentMonth(parseInt(event.target.value, 10));
    };

    const toggleCalendar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const renderDays = () => {
        const daysArray = [];
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);

        // Add empty days to align the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push(<div key={`empty-start-${i}`} className={styles.emptyDay}></div>);
        }

        for (let i = 1; i <= daysInCurrentMonth; i++) {
            if (
                (currentYear === startYear && currentMonth === startMonth && i < startDay) ||
                (currentYear === endYear && currentMonth === endMonth && i > endDay) ||
                (currentYear === startYear && currentMonth < startMonth) ||
                (currentYear === endYear && currentMonth > endMonth)
            ) {
                daysArray.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
                continue;
            }
            daysArray.push(
                <div
                    key={i}
                    className={`${styles.day} ${selectedDate && selectedDate.getDate() === i && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear ? styles.selectedDay : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(i);

                    }}
                >
                    {i}
                </div>
            );
        }

        // // Add empty days to align the last day of the month
        // const remainingDays = 42 - (firstDayOfMonth + daysInCurrentMonth);
        // for (let i = 0; i < remainingDays; i++) {
        //     daysArray.push(<div key={`empty-end-${i}`} className={styles.emptyDay}></div>);
        // }

        return daysArray;
    };

    return (
        <div className={styles.calendarWrapper} ref={calendarRef}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.dropdown} onClick={toggleCalendar}>
                <div className={`${styles.selected} ${isOpen ? styles.isOpen : ''} ${noBorderRadius ? styles.noBorderRadius : ''}`}>
                    {value === 'alltime' ? 'All' : (value === 'dateselected' ? (selectedDate ? selectedDate.toDateString() : 'Select a date') : 'Select a date')}

                </div>
                {isOpen && (
                    <div className={`${styles.calendarContainer} ${leftAligned ? styles.leftAligned : ''}`} onClick={(e) => { e.stopPropagation() }}>
                        <div className={styles.navigation}>
                            <div className={`${styles.navButton} ${styles.prev} `} onClick={handlePrevMonth} ></div >
                            <div className={styles.yearMonthWrp}>
                                <select value={currentMonth} onChange={handleMonthChange} className={styles.monthSelect}>
                                    {months.map((month, index) => (
                                        <option key={index} value={index}>{month}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={currentYear}
                                    onChange={handleYearChange}
                                    min={startYear}
                                    max={endYear}
                                    className={styles.yearSelect}
                                />
                            </div>
                            <div className={`${styles.navButton} ${styles.next} `} onClick={handleNextMonth} ></div >
                        </div>
                        <div className={styles.daysOfWeek}>
                            {daysOfWeek.map((day, index) => (
                                <div key={index} className={styles.dayOfWeek}>{day}</div>
                            ))}
                        </div>
                        <div className={styles.days}>
                            {renderDays()}
                        </div>
                    </div>
                )}
            </div>
            {message && <div className={styles.message}>{message}</div>}
        </div>
    );
};

export default Calendar;