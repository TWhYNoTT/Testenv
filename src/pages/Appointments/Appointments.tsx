import React, { useState, useMemo, useCallback } from 'react';
import DatePicker from '../../components/DatePicker/DatePicker';
import AppointmentControls from './AppointmentControls/AppointmentControls';
import Button from '../../components/Button/Button';
import { DndContext } from '@dnd-kit/core';
import styles from './Appointments.module.css';
import ScheduleList from './Schedul/ScheduleList';

interface ScheduleData {
    id: string;
    service: string;
    customer: string;
    contact: string;
    duration: string;
    price: string;
    status: string;
    image: string;
    time: string;
    date: string;
}

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const getCurrentMonthYear = () => {
    const date = new Date();
    return `${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
};

const initialScheduleData: ScheduleData[] = [
    { id: '1', service: 'Permanent Hair Colour', customer: 'Nada Ahmed', contact: '0123 456 789', duration: '1h 0min', price: '120 AED', status: 'Paid', image: './assets/icons/avatar.png', time: '12:30 PM', date: '18/08/2024' },
    { id: '2', service: 'Permanent Hair Colour', customer: 'Salama Khaled', contact: '0123 456 789', duration: '1h 0min', price: '120 AED', status: 'Unpaid', image: './assets/icons/avatar.png', time: '7:15 AM', date: '19/08/2024' },
    { id: '3', service: 'Permanent Hair Colour', customer: 'Alaa Omar', contact: '0123 456 789', duration: '1h 30min', price: '200 AED', status: 'Late', image: './assets/icons/avatar.png', time: '8:00 AM', date: '20/08/2024' },
    { id: '4', service: 'Permanent Hair Colour', customer: 'Nada Ahmed', contact: '0123 456 789', duration: '1h 0min', price: '120 AED', status: 'Paid', image: './assets/icons/avatar.png', time: '8:15 AM', date: '21/08/2024' },
    { id: '5', service: 'Permanent Hair Colour', customer: 'Soha Ali', contact: '0123 456 789', duration: '1h 0min', price: '120 AED', status: 'Upcoming', image: './assets/icons/avatar.png', time: '9:15 AM', date: '22/08/2024' },
    { id: '6', service: 'Permanent Hair Colour', customer: 'Aya Mohammed', contact: '0123 456 789', duration: '2h 0min', price: '120 AED', status: 'Draft', image: './assets/icons/avatar.png', time: '10:00 AM', date: '23/08/2024' },
    { id: '7', service: 'Permanent Hair Colour', customer: 'Yasmin Aliaaaa', contact: '0123 456 789', duration: '1h 15min', price: '300 AED', status: 'Paid', image: './assets/icons/avatar.png', time: '10:30 AM', date: '24/08/2024' },

];

const Appointments: React.FC = () => {
    const [scheduleData, setScheduleData] = useState(initialScheduleData);
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        today.setDate(today.getDate() - today.getDay());
        return today.toLocaleDateString('en-GB');
    });

    const handleDateChange = useCallback((date: string) => {
        setSelectedDate(date);
    }, []);

    const handleDragEnd = useCallback((data: ScheduleData[]) => {
        setScheduleData(data);
    }, []);

    const getDateRange = useCallback((startDate: string) => {
        const start = new Date(startDate.split('/').reverse().join('-'));
        return Array.from({ length: 7 }, (_, i) => {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);
            return currentDate.toLocaleDateString('en-GB');
        });
    }, []);

    const dateRange = useMemo(() => getDateRange(selectedDate), [selectedDate, getDateRange]);

    const filteredScheduleData = useMemo(() =>
        scheduleData.filter(item => dateRange.includes(item.date)),
        [scheduleData, dateRange]);

    const currentMonthYear = useMemo(() => getCurrentMonthYear(), []);

    return (
        <div className={styles.appointmentsMainContainer}>
            <div className={styles.controlsHeaderContainer}>
                <h1 className='xH1'>{currentMonthYear}</h1>
                <div className={styles.controlsContainer}>
                    <AppointmentControls />
                    <Button
                        label="New appointment +"
                        variant="primary"
                        size="medium"
                    />
                </div>
            </div>
            <DatePicker onDateChange={handleDateChange} selectedDate={selectedDate} />
            <DndContext>
                <ScheduleList
                    scheduleData={filteredScheduleData}
                    dateRange={dateRange}
                    onDragEnd={handleDragEnd}
                />
            </DndContext>
        </div>
    );
};

export default Appointments;