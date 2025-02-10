import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DatePicker from '../../components/DatePicker/DatePicker';
import AppointmentControls from './AppointmentControls/AppointmentControls';
import Button from '../../components/Button/Button';
import { DndContext } from '@dnd-kit/core';
import styles from './Appointments.module.css';
import ScheduleList from './Schedul/ScheduleList';
import AddEditAppointment from './AddEditAppointment/AddEditAppointment';
import { useToast } from '../../contexts/ToastContext';
import { useAppointments } from '../../hooks/useAppointments';


export interface ScheduleAppointment {
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

// const initialScheduleData: ScheduleAppointment[] = [
//     { id: '1', service: 'Permanent Hair Colour', customer: 'Nada Ahmed', contact: '0123 456 789', duration: '1h 0min', price: '120 AED', status: 'Paid', image: './assets/icons/avatar.png', time: '12:30 PM', date: '18/08/2024' },
//     { id: '2', service: 'Permanent Hair Colour', customer: 'Salama Khaled', contact: '0123 456 789', duration: '1h 0min', price: '120 AED', status: 'Unpaid', image: './assets/icons/avatar.png', time: '7:15 AM', date: '19/08/2024' },
//     { id: '3', service: 'Permanent Hair Colour', customer: 'Alaa Omar', contact: '0123 456 789', duration: '1h 30min', price: '200 AED', status: 'Late', image: './assets/icons/avatar.png', time: '8:00 AM', date: '20/08/2024' },
//     { id: '4', service: 'Permanent Hair Colour', customer: 'Nada Ahmed', contact: '0123 456 789', duration: '1h 0min', price: '120 AED', status: 'Paid', image: './assets/icons/avatar.png', time: '8:15 AM', date: '21/08/2024' },
//     { id: '5', service: 'Permanent Hair Colour', customer: 'Soha Ali', contact: '0123 456 789', duration: '1h 0min', price: '120 AED', status: 'Upcoming', image: './assets/icons/avatar.png', time: '9:15 AM', date: '22/08/2024' },
//     { id: '6', service: 'Permanent Hair Colour', customer: 'Aya Mohammed', contact: '0123 456 789', duration: '2h 0min', price: '120 AED', status: 'Draft', image: './assets/icons/avatar.png', time: '10:00 AM', date: '23/08/2024' },
//     { id: '7', service: 'Permanent Hair Colour', customer: 'Yasmin Aliaaaa', contact: '0123 456 789', duration: '1h 15min', price: '300 AED', status: 'Paid', image: './assets/icons/avatar.png', time: '10:30 AM', date: '24/08/2024' },

// ];

const Appointments: React.FC = () => {
    const [scheduleData, setScheduleData] = useState<ScheduleAppointment[]>([]);

    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        today.setDate(today.getDate() - today.getDay());
        return today.toLocaleDateString('en-GB');
    });
    const [selectedDate0, setSelectedDate0] = useState<string>(() => {
        const today = new Date();
        today.setDate(today.getDate() - today.getDay());
        return today.toLocaleDateString('en-GB');
    });
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const { getAppointments } = useAppointments();
    const { showToast } = useToast();

    // Update handleDateChange to properly memoize dependencies
    const handleDateChange = useCallback((date: string) => {
        setSelectedDate(date);
        // Remove the automatic fetch here since it will be handled by the useEffect
    }, []);

    const handleTimeSlotSelect = useCallback((time: string) => {
        setSelectedTimeSlot(time);
    }, []);

    const convertTimeToAPIFormat = useCallback((timeSlot: string | null) => {
        if (!timeSlot) return '';

        // Convert "1:00 PM" to "13:00"
        const [time, period] = timeSlot.split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);

        if (period === 'PM' && hour !== 12) {
            hour += 12;
        } else if (period === 'AM' && hour === 12) {
            hour = 0;
        }

        return `${hour.toString().padStart(2, '0')}:${minutes}`;
    }, []);

    const handleDragEnd = useCallback((data: ScheduleAppointment[]) => {
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

    const getStatusText = useCallback((status: number): string => {
        switch (status) {
            case 0: return 'Upcoming';
            case 1: return 'Paid';
            case 2: return 'Late';
            case 3: return 'Unpaid';
            case 4: return 'Draft';
            default: return 'Unknown';
        }
    }, []);

    const formatTime = useCallback((timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    }, []);

    const refreshAppointments = useCallback(async () => {
        try {
            const fromDate = selectedDate.split('/').reverse().join('-');
            const toDateObj = new Date(fromDate);
            toDateObj.setDate(toDateObj.getDate() + 6);
            const toDate = toDateObj.toISOString().split('T')[0];

            const response = await getAppointments({
                fromDate,
                toDate,
                includeDrafts: true,
                pageNumber: 1,
                pageSize: 100
            });

            const transformedData: ScheduleAppointment[] = response.appointments.map(appointment => ({
                id: appointment.id.toString(),
                service: appointment.service.serviceName,
                customer: appointment.clientName,
                contact: appointment.mobileNumber,
                duration: "1h 30min",
                price: `${appointment.amount} AED`,
                status: getStatusText(appointment.status),
                image: './assets/icons/avatar.png',
                time: formatTime(appointment.startTime),
                date: appointment.appointmentDate.split('T')[0].split('-').reverse().join('/')
            }));

            setScheduleData(transformedData);
        } catch (error) {
            showToast('Failed to fetch appointments', 'error');
        }
    }, [selectedDate, getAppointments, showToast, getStatusText, formatTime]);

    useEffect(() => {
        refreshAppointments();
    }, [refreshAppointments]);

    // Update handleAddAppointmentSuccess to use refreshAppointments
    const handleAddAppointmentSuccess = useCallback(() => {
        showToast('Appointment created successfully', 'success');
        refreshAppointments(); // Call refresh instead of changing selectedDate
    }, [showToast, refreshAppointments]);

    const handleDateClick = useCallback((date: string) => {
        // This will be called when a date is clicked in the DatePicker
        setSelectedDate0(date);
    }, []);

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
                        onClick={() => setIsAddEditOpen(true)}
                    />
                </div>
            </div>
            <DatePicker
                onDateChange={handleDateChange}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}  // Add this prop
            />

            <DndContext>
                <ScheduleList
                    scheduleData={filteredScheduleData}
                    dateRange={dateRange}
                    onDragEnd={handleDragEnd}
                    onTimeSlotSelect={handleTimeSlotSelect} // Add this prop
                />
            </DndContext>

            <AddEditAppointment
                isOpen={isAddEditOpen}
                onClose={() => setIsAddEditOpen(false)}
                onSuccess={handleAddAppointmentSuccess}
                selectedTime={convertTimeToAPIFormat(selectedTimeSlot)} // Add this prop
                selectedDate={selectedDate0}
            />
        </div>
    );
};

export default Appointments;