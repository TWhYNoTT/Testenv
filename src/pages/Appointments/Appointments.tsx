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

export interface ApiAppointment {
    id: number;
    serviceName: string;
    customerName: string;
    clientName?: string;
    phoneNumber: string;
    clientPhone?: string;
    email: string;
    clientEmail?: string;
    appointmentDate: string;
    duration: string;
    servicePrice: number;
    paymentStatus: number;
    status: number;
    statusString: string;
    paymentStatusString: string;
    isDraft: boolean;
    staffId?: number;
    staffName?: string;
    isRegisteredCustomer: boolean;
}

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const getCurrentMonthYear = () => {
    const date = new Date();
    return `${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
};

const Appointments: React.FC = () => {
    const [scheduleData, setScheduleData] = useState<ScheduleAppointment[]>([]);
    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
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
    const { getAppointments, rescheduleAppointment } = useAppointments();
    const { showToast } = useToast();

    const formatAppointmentDate = useCallback((dateTimeString: string) => {
        // Dates from backend are ISO 8601 with Z (UTC)
        // new Date() parses as UTC, toLocaleDateString() auto-converts to local timezone
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('en-GB');
    }, []);

    const formatAppointmentTime = useCallback((dateTimeString: string) => {
        // Dates from backend are ISO 8601 with Z (UTC)
        // new Date() parses as UTC, getHours()/getMinutes() auto-convert to local timezone
        const date = new Date(dateTimeString);
        const minutes = date.getMinutes();
        const roundedMinutes = Math.round(minutes / 15) * 15;
        date.setMinutes(roundedMinutes);

        if (roundedMinutes === 60) {
            date.setMinutes(0);
            date.setHours(date.getHours() + 1);
        }

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }, []);

    const handleDateChange = useCallback((date: string) => {
        setSelectedDate(date);
    }, []);

    const handleTimeSlotSelect = useCallback((time: string) => {
        setSelectedTimeSlot(time);
    }, []);

    const convertTimeToAPIFormat = useCallback((timeSlot: string | null) => {
        if (!timeSlot) return '';
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

    const refreshAppointments = useCallback(async () => {
        try {
            const fromDateParts = selectedDate.split('/');
            const startDate = `${fromDateParts[2]}-${fromDateParts[1]}-${fromDateParts[0]}`;

            const toDateObj = new Date(startDate);
            toDateObj.setDate(toDateObj.getDate() + 6);
            const endDate = toDateObj.toISOString().split('T')[0];

            const response = await getAppointments({
                startDate,
                endDate,
                page: 1,
                pageSize: 50
            });

            const transformedData: ScheduleAppointment[] = response.appointments.map(appointment => {
                const [durationHours, durationMinutes] = appointment.duration.split(':').map(Number);
                const formattedDuration = `${durationHours}h ${durationMinutes}min`;

                return {
                    id: appointment.id.toString(),
                    service: appointment.serviceName,
                    customer: appointment.customerName,
                    contact: appointment.phoneNumber,
                    duration: formattedDuration,
                    price: `${appointment.servicePrice} AED`,
                    status: appointment.paymentStatusString,
                    image: './assets/icons/avatar.png',
                    time: formatAppointmentTime(appointment.appointmentDate),
                    date: formatAppointmentDate(appointment.appointmentDate)
                };
            });

            setScheduleData(transformedData);
        } catch (error) {
            showToast('Failed to fetch appointments', 'error');
            console.error(error);
        }
    }, [selectedDate, getAppointments, showToast, formatAppointmentTime, formatAppointmentDate]);

    const handleDragEnd = useCallback(async (data: ScheduleAppointment[], movedAppointmentData?: { appointmentId: string, newTime: string, newDate: string }) => {
        if (movedAppointmentData) {
            try {
                // Convert the new date and time to ISO format
                const [day, month, year] = movedAppointmentData.newDate.split('/').map(Number);
                const [time, period] = movedAppointmentData.newTime.split(' ');
                const [hours, minutes] = time.split(':').map(Number);

                let finalHours = hours;
                if (period === 'PM' && hours !== 12) {
                    finalHours += 12;
                } else if (period === 'AM' && hours === 12) {
                    finalHours = 0;
                }

                const newDateTime = new Date(year, month - 1, day, finalHours, minutes);

                console.log('Rescheduling appointment:', {
                    id: movedAppointmentData.appointmentId,
                    from: scheduleData.find(a => a.id === movedAppointmentData.appointmentId),
                    to: { date: movedAppointmentData.newDate, time: movedAppointmentData.newTime },
                    isoDateTime: newDateTime.toISOString()
                });

                await rescheduleAppointment(parseInt(movedAppointmentData.appointmentId), newDateTime.toISOString());
                showToast('Appointment rescheduled successfully', 'success');
                setScheduleData(data);
            } catch (error) {
                showToast('Failed to reschedule appointment', 'error');
                console.error('Reschedule error:', error);
                // Revert the change on error
                refreshAppointments();
            }
        } else {
            setScheduleData(data);
        }
    }, [scheduleData, rescheduleAppointment, showToast, refreshAppointments]);

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

    useEffect(() => {
        refreshAppointments();
    }, [refreshAppointments]);

    const handleAddAppointmentSuccess = useCallback(() => {
        showToast('Appointment created successfully', 'success');
        refreshAppointments();
        setIsAddEditOpen(false);
        setEditingAppointment(null);
    }, [showToast, refreshAppointments]);

    const handleEditAppointment = useCallback((appointmentId: string) => {
        setEditingAppointment(appointmentId);
        setIsAddEditOpen(true);
    }, []);

    const handleDeleteAppointment = useCallback(() => {
        refreshAppointments();
    }, [refreshAppointments]);

    const handleDateClick = useCallback((date: string) => {
        setSelectedDate0(date);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsAddEditOpen(false);
        setEditingAppointment(null);
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
                onDateClick={handleDateClick}
            />

            <DndContext>
                <ScheduleList
                    scheduleData={filteredScheduleData}
                    dateRange={dateRange}
                    onDragEnd={handleDragEnd}
                    onTimeSlotSelect={handleTimeSlotSelect}
                    onEdit={handleEditAppointment}
                    onDelete={handleDeleteAppointment}
                />
            </DndContext>

            <AddEditAppointment
                isOpen={isAddEditOpen}
                onClose={handleCloseModal}
                onSuccess={handleAddAppointmentSuccess}
                selectedTime={convertTimeToAPIFormat(selectedTimeSlot)}
                selectedDate={selectedDate0}
                editingAppointmentId={editingAppointment}
                businessId={0}
            />
        </div>
    );
};

export default Appointments;