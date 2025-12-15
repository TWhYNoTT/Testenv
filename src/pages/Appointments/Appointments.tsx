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
import { useCategories } from '../../hooks/useCategories';
import { useBranches } from '../../hooks/useBranches';

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
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Filter states
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<number | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<number | null>(null);

    const { getAppointments, rescheduleAppointment } = useAppointments();
    const { getBusinessCategories } = useCategories();
    const { getBranches } = useBranches();
    const { showToast } = useToast();

    const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([]);
    const [branches, setBranches] = useState<Array<{ id: number, name: string }>>([]);
    const [branchFilter, setBranchFilter] = useState<number | null>(null);

    // Load categories and branches on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const [categoriesResponse, branchesResponse] = await Promise.all([
                    getBusinessCategories(),
                    getBranches()
                ]);

                if (categoriesResponse?.categories) {
                    setCategories(categoriesResponse.categories.map(c => ({ id: c.id, name: c.name })));
                }

                if (branchesResponse?.branches) {
                    setBranches(branchesResponse.branches.map(b => ({ id: b.id, name: b.name })));
                }
            } catch (error) {
                console.error('Failed to load filter data:', error);
            }
        };
        loadData();
    }, [getBusinessCategories, getBranches]);

    const formatAppointmentDate = useCallback((dateTimeString: string) => {
        // CRITICAL: Backend must return dates with Z suffix: "2025-12-11T08:00:00Z"
        // If no Z, JavaScript treats it as local time and timezone conversion fails
        // Example: "2025-12-11T08:00:00Z" (8 AM UTC) → 10 AM Egypt (UTC+2)
        const date = new Date(dateTimeString);

        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        return date.toLocaleDateString('en-GB');
    }, []);

    const formatAppointmentTime = useCallback((dateTimeString: string) => {
        // CRITICAL: Backend must return dates with Z suffix: "2025-12-11T08:00:00Z"
        // new Date() parses Z-suffixed string as UTC
        // getHours() automatically converts to local timezone
        // Example: "2025-12-11T08:00:00Z" → parsed as 8 AM UTC → displayed as 10 AM Egypt
        const date = new Date(dateTimeString);

        if (isNaN(date.getTime())) {
            return 'Invalid Time';
        }

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
        setIsLoading(true);
        setHasError(false);
        try {
            const fromDateParts = selectedDate.split('/');
            const startDate = `${fromDateParts[2]}-${fromDateParts[1]}-${fromDateParts[0]}`;

            const toDateObj = new Date(startDate);
            toDateObj.setDate(toDateObj.getDate() + 6);
            const endDate = toDateObj.toISOString().split('T')[0];

            const response = await getAppointments({
                startDate,
                endDate,
                paymentStatus: paymentStatusFilter ?? undefined,
                categoryId: categoryFilter ?? undefined,
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
            setHasError(true);
            showToast('Error loading appointments. Please try again.', 'error');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate, paymentStatusFilter, categoryFilter, getAppointments, showToast, formatAppointmentTime, formatAppointmentDate]);

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
                    <AppointmentControls
                        branches={branches}
                        categories={categories}
                        onBranchChange={setBranchFilter}
                        onPaymentStatusChange={setPaymentStatusFilter}
                        onCategoryChange={setCategoryFilter}
                    />
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

            {isLoading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}>
                        <svg viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                        </svg>
                        <span>Loading appointments...</span>
                    </div>
                </div>
            ) : hasError ? (
                <div className={styles.emptyState}>
                    <p>Error loading appointments. Please try again.</p>
                    <Button
                        label="Retry"
                        onClick={refreshAppointments}
                        size="small"
                    />
                </div>
            ) : filteredScheduleData.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No appointments scheduled.</p>
                </div>
            ) : (
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
            )}

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