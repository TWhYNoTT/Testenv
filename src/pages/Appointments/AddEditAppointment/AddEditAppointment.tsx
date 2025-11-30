import React, { useState, useEffect, useCallback } from 'react';
import { useServices } from '../../../hooks/useServices';
import { useAppointments } from '../../../hooks/useAppointments';
import { useStaff } from '../../../hooks/useStaff';
import { useCategories } from '../../../hooks/useCategories';
import { CategoryListResponse, Category } from '../../../types/api-responses';
import InputField from '../../../components/InputField/InputField';
import Toggle from '../../../components/Toggle/Toggle';
import Button from '../../../components/Button/Button';
import Dropdown from '../../../components/Dropdown/Dropdown';
import TextArea from '../../../components/TextArea/TextArea';
import Calendar from '../../../components/Calendar/Calendar';
import TimePicker from '../../../components/TimePicker/TimePicker';
import styles from './AddEditAppointment.module.css';

enum AppointmentStatus {
    Pending = 1,
    Approved = 2,
    Completed = 3,
    Cancelled = 4,
    NoShow = 5
}

enum PaymentStatus {
    Paid = 1,
    Unpaid = 2,
    Upcoming = 3,
    Draft = 4,
    Late = 5
}

interface AddEditAppointmentProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    selectedTime: string;
    selectedDate: string;
    editingAppointmentId?: string | null;
    businessId?: number;
}

const AddEditAppointment: React.FC<AddEditAppointmentProps> = ({
    onClose,
    onSuccess,
    isOpen,
    selectedTime,
    selectedDate,
    editingAppointmentId,
    businessId = 0
}) => {
    const { services, getServices, loading: servicesLoading } = useServices();
    const { createAppointment, getAppointmentById, updateAppointment, loading: appointmentLoading } = useAppointments();
    const { staff, getBusinessStaff, loading: staffLoading } = useStaff();
    const { getBusinessCategories, loading: categoriesLoading } = useCategories();

    const [isEditMode, setIsEditMode] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([]);
    const [filteredServices, setFilteredServices] = useState<Array<any>>([]);
    const [pricingOptions, setPricingOptions] = useState<Array<{ id: number, name: string, price: number, currency: string, duration: string }>>([]);

    const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

    const [appointmentData, setAppointmentData] = useState({
        businessId: businessId,
        clientName: '',
        mobileNumber: '',
        email: '',
        categoryId: 0,
        serviceId: 0,
        pricingOptionId: 0,
        amount: '',
        staffId: 0,
        paymentStatus: PaymentStatus.Upcoming,
        appointmentStatus: AppointmentStatus.Pending,
        appointmentDate: new Date().toISOString(),
        isDraft: false,
        notes: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const paymentStatusOptions = [
        { label: 'Paid', value: PaymentStatus.Paid },
        { label: 'Unpaid', value: PaymentStatus.Unpaid },
        { label: 'Upcoming', value: PaymentStatus.Upcoming },
        { label: 'Draft', value: PaymentStatus.Draft },
        { label: 'Late', value: PaymentStatus.Late }
    ];

    const appointmentStatusOptions = [
        { label: 'Pending', value: AppointmentStatus.Pending },
        { label: 'Approved', value: AppointmentStatus.Approved },
        { label: 'Completed', value: AppointmentStatus.Completed },
        { label: 'Cancelled', value: AppointmentStatus.Cancelled },
        { label: 'No Show', value: AppointmentStatus.NoShow }
    ];

    const resetForm = useCallback(() => {
        setAppointmentData({
            businessId: businessId,
            clientName: '',
            mobileNumber: '',
            email: '',
            categoryId: 0,
            serviceId: 0,
            pricingOptionId: 0,
            amount: '',
            staffId: 0,
            paymentStatus: PaymentStatus.Upcoming,
            appointmentStatus: AppointmentStatus.Pending,
            appointmentDate: new Date().toISOString(),
            isDraft: false,
            notes: ''
        });
        setErrors({});
        setSelectedTimeSlot('');
        setCalendarSelectedDate(undefined);
    }, [businessId]);

    const loadExistingAppointment = useCallback(async (appointmentId: string) => {
        try {
            setIsEditMode(true);
            const appointment = await getAppointmentById(parseInt(appointmentId));

            console.log('Loaded appointment for editing:', appointment);

            // Map the appointment data to form structure
            setAppointmentData({
                businessId: appointment.businessId || businessId,
                clientName: appointment.clientName || appointment.customerName || '',
                mobileNumber: appointment.clientPhone || appointment.phoneNumber || '',
                email: appointment.clientEmail || appointment.email || '',
                categoryId: appointment.categoryId || 0,
                serviceId: appointment.businessServiceId || appointment.serviceId || 0,
                pricingOptionId: appointment.servicePricingOptionId || appointment.pricingOptionId || 0,
                amount: appointment.amount?.toString() || appointment.servicePrice?.toString() || '',
                staffId: appointment.staffId || 0,
                paymentStatus: appointment.paymentStatus || PaymentStatus.Upcoming,
                appointmentStatus: appointment.status || AppointmentStatus.Pending,
                appointmentDate: appointment.appointmentDate || new Date().toISOString(),
                isDraft: appointment.isDraft || false,
                notes: appointment.notes || ''
            });

            // Set calendar date
            if (appointment.appointmentDate) {
                const appointmentDate = new Date(appointment.appointmentDate);
                setCalendarSelectedDate(appointmentDate);

                // Set time
                const timeString = appointmentDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                setSelectedTimeSlot(timeString);
            }

        } catch (error) {
            console.error('Failed to load appointment for editing:', error);
            // Fall back to empty form
            setIsEditMode(true);
        }
    }, [getAppointmentById, businessId]);

    const fetchInitialData = useCallback(async () => {
        try {
            // Load all data in parallel
            const promises = [];

            if (services.length === 0) {
                promises.push(getServices());
            }

            if (staff.length === 0) {
                promises.push(getBusinessStaff({ businessId }));
            }

            promises.push(getBusinessCategories());

            const results = await Promise.all(promises);

            // Set categories from the last promise result
            const categoriesResponse = results[results.length - 1] as CategoryListResponse;
            if (categoriesResponse?.categories) {
                setCategories(categoriesResponse.categories.map((cat: Category) => ({
                    id: cat.id,
                    name: cat.name
                })));
            }

        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        }
    }, [getServices, getBusinessStaff, getBusinessCategories, services.length, businessId]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            const initializeModal = async () => {
                setIsInitialLoading(true);
                try {
                    // First, load all the initial data (categories, services, staff)
                    await fetchInitialData();

                    // Then check if we're editing or creating
                    if (editingAppointmentId) {
                        await loadExistingAppointment(editingAppointmentId);
                    } else {
                        setIsEditMode(false);
                        resetForm();

                        // Initialize calendar date from selectedDate prop
                        try {
                            if (selectedDate && selectedDate.includes('/')) {
                                const [day, month, year] = selectedDate.split('/').map(Number);
                                const dateObj = new Date(year, month - 1, day);
                                setCalendarSelectedDate(dateObj);
                            }
                        } catch (error) {
                            console.error('Error parsing initial date:', error);
                            setCalendarSelectedDate(new Date());
                        }

                        // Initialize time from selectedTime prop
                        if (selectedTime && selectedTime.includes(':')) {
                            const [hours, minutes] = selectedTime.split(':').map(Number);
                            const amPm = hours >= 12 ? 'PM' : 'AM';
                            const displayHour = hours % 12 || 12;
                            const displayMinute = minutes.toString().padStart(2, '0');
                            const timeString = `${displayHour}:${displayMinute} ${amPm}`;
                            setSelectedTimeSlot(timeString);
                        }
                    }
                } finally {
                    setIsInitialLoading(false);
                }
            };

            initializeModal();
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, editingAppointmentId, fetchInitialData, resetForm, loadExistingAppointment, selectedDate, selectedTime]);

    const updateAppointmentDateTime = useCallback((date?: Date, time?: string) => {
        if (!date) return;

        const appointmentDate = new Date(date);

        if (time && time.includes(':')) {
            const [timePart, period] = time.split(' ');
            const [hours, minutes] = timePart.split(':').map(Number);

            let finalHours = hours;
            if (period === 'PM' && hours !== 12) {
                finalHours += 12;
            } else if (period === 'AM' && hours === 12) {
                finalHours = 0;
            }

            appointmentDate.setHours(finalHours, minutes, 0, 0);
        } else {
            const now = new Date();
            appointmentDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
        }

        setAppointmentData(prev => ({
            ...prev,
            appointmentDate: appointmentDate.toISOString()
        }));
    }, []);

    const handleCalendarDateChange = useCallback((date: Date) => {
        setCalendarSelectedDate(date);
        updateAppointmentDateTime(date, selectedTimeSlot);
    }, [selectedTimeSlot, updateAppointmentDateTime]);

    const handleTimeChange = useCallback((time: string) => {
        setSelectedTimeSlot(time);
        updateAppointmentDateTime(calendarSelectedDate, time);
    }, [calendarSelectedDate, updateAppointmentDateTime]);

    // Filter services when category changes
    useEffect(() => {
        if (appointmentData.categoryId > 0 && services.length > 0 && categories.length > 0) {
            const selectedCategory = categories.find(c => c.id === appointmentData.categoryId);

            if (selectedCategory) {
                const servicesForCategory = services.filter(service =>
                    service.categoryName.toLowerCase() === selectedCategory.name.toLowerCase()
                );

                setFilteredServices(servicesForCategory);
                console.log('Filtered services for category:', selectedCategory.name, servicesForCategory);
            } else {
                setFilteredServices([]);
            }

            // Only reset service/pricing if not in edit mode or if category actually changed
            if (!isEditMode) {
                setAppointmentData(prev => ({
                    ...prev,
                    serviceId: 0,
                    pricingOptionId: 0,
                    amount: ''
                }));
                setPricingOptions([]);
            }
        } else {
            setFilteredServices([]);
        }
    }, [appointmentData.categoryId, services, categories, isEditMode]);

    // Update pricing options when service changes
    useEffect(() => {
        if (appointmentData.serviceId > 0 && services.length > 0) {
            const selectedService = services.find(s => s.id === appointmentData.serviceId);
            if (selectedService && selectedService.pricingOptions) {
                setPricingOptions(selectedService.pricingOptions.map((opt: any) => ({
                    id: opt.id,
                    name: opt.name,
                    price: opt.price,
                    currency: opt.currency || 'AED',
                    duration: opt.duration
                })));
                console.log('Loaded pricing options for service:', selectedService.name, selectedService.pricingOptions);
            } else {
                setPricingOptions([]);
            }

            // Only reset pricing option if not in edit mode
            if (!isEditMode) {
                setAppointmentData(prev => ({
                    ...prev,
                    pricingOptionId: 0,
                    amount: ''
                }));
            }
        } else {
            setPricingOptions([]);
        }
    }, [appointmentData.serviceId, services, isEditMode]);

    const handleInputChange = (name: string, value: string | number | boolean) => {
        setAppointmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Helper functions for dropdown display values
    const getCategoryDisplayValue = (categoryId: number) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : '';
    };

    const getServiceDisplayValue = (serviceId: number) => {
        const service = filteredServices.find(s => s.id === serviceId) ||
            services.find(s => s.id === serviceId);
        return service ? service.name : '';
    };

    const getPricingOptionDisplayValue = (pricingOptionId: number) => {
        const option = pricingOptions.find(p => p.id === pricingOptionId);
        return option ? option.name : '';
    };

    const getStaffDisplayValue = (staffId: number) => {
        const member = staff.find(s => s.id === staffId);
        return member ? member.fullName : '';
    };

    const getPaymentStatusDisplayValue = (statusValue: PaymentStatus) => {
        const status = paymentStatusOptions.find(s => s.value === statusValue);
        return status ? status.label : '';
    };

    const getAppointmentStatusDisplayValue = (statusValue: AppointmentStatus) => {
        const status = appointmentStatusOptions.find(s => s.value === statusValue);
        return status ? status.label : '';
    };

    // Change handlers for dropdowns
    const handleCategoryChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            const selectedCategory = categories.find(category => category.name === value);
            if (selectedCategory) {
                handleInputChange('categoryId', selectedCategory.id);
            }
        }
    };

    const handleServiceChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            const selectedService = filteredServices.find(service => service.name === value);
            if (selectedService) {
                handleInputChange('serviceId', selectedService.id);
            }
        }
    };

    const handlePricingOptionChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            const selectedOption = pricingOptions.find(option => option.name === value);
            if (selectedOption) {
                handleInputChange('pricingOptionId', selectedOption.id);
                if (selectedOption.price) {
                    handleInputChange('amount', selectedOption.price.toString());
                }
            }
        }
    };

    const handleStaffChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            const selectedStaff = staff.find(s => s.fullName === value);
            if (selectedStaff) {
                handleInputChange('staffId', selectedStaff.id);
            }
        }
    };

    const handlePaymentStatusChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            const selectedStatus = paymentStatusOptions.find(status => status.label === value);
            if (selectedStatus) {
                handleInputChange('paymentStatus', selectedStatus.value);
            }
        }
    };

    const handleAppointmentStatusChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            const selectedStatus = appointmentStatusOptions.find(status => status.label === value);
            if (selectedStatus) {
                handleInputChange('appointmentStatus', selectedStatus.value);
            }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!appointmentData.clientName || appointmentData.clientName.length < 3 || appointmentData.clientName.length > 100) {
            newErrors.clientName = 'Name must be between 3 and 100 characters';
        }
        if (!/^[a-zA-Z\s]*$/.test(appointmentData.clientName)) {
            newErrors.clientName = 'Name can only contain letters and spaces';
        }

        if (!/^\d{10,15}$/.test(appointmentData.mobileNumber)) {
            newErrors.mobileNumber = 'Mobile number must be between 10 and 15 digits';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(appointmentData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!appointmentData.categoryId || appointmentData.categoryId <= 0) {
            newErrors.categoryId = 'Please select a category';
        }

        if (!appointmentData.serviceId || appointmentData.serviceId <= 0) {
            newErrors.serviceId = 'Please select a service';
        }

        if (!appointmentData.pricingOptionId || appointmentData.pricingOptionId <= 0) {
            newErrors.pricingOptionId = 'Please select a pricing option';
        }

        if (!appointmentData.amount || parseFloat(appointmentData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            if (!validateForm()) {
                return;
            }

            const appointmentRequest = {
                clientName: appointmentData.clientName.trim(),
                mobileNumber: appointmentData.mobileNumber,
                email: appointmentData.email,
                categoryId: appointmentData.categoryId,
                serviceId: appointmentData.serviceId,
                pricingOptionId: appointmentData.pricingOptionId,
                amount: parseFloat(appointmentData.amount),
                staffId: appointmentData.staffId,
                paymentStatus: appointmentData.paymentStatus,
                status: appointmentData.appointmentStatus,
                appointmentDate: appointmentData.appointmentDate,
                isDraft: appointmentData.isDraft,
                notes: appointmentData.notes
            };

            if (isEditMode && editingAppointmentId) {
                await updateAppointment(parseInt(editingAppointmentId), appointmentRequest);
            } else {
                await createAppointment({
                    businessId: appointmentData.businessId,
                    ...appointmentRequest
                });
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving appointment:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.modalBackground} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContainer} ${isOpen ? styles.open : ''}`}>
                {(appointmentLoading || isInitialLoading) && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}>
                            <svg viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                            </svg>
                            <span>
                                {isInitialLoading ? 'Loading appointment...' : (isEditMode ? 'Updating appointment...' : 'Creating appointment...')}
                            </span>
                        </div>
                    </div>
                )}

                <div className={styles.headerCloseContainer}>
                    <button onClick={onClose} className={styles.closeButton}>&times;</button>
                    <h2 className={styles.header}>
                        {isEditMode ? 'Edit appointment' : 'New appointment'}
                    </h2>
                </div>

                <div className={styles.appointmentForm}>
                    <InputField
                        label="Client name"
                        name="clientName"
                        value={appointmentData.clientName}
                        onChange={(value) => handleInputChange('clientName', value)}
                        placeholder="Enter client name"
                        feedback={errors.clientName ? 'error' : undefined}
                        feedbackMessage={errors.clientName}
                    />

                    <InputField
                        label="Mobile number"
                        name="mobileNumber"
                        value={appointmentData.mobileNumber}
                        onChange={(value) => handleInputChange('mobileNumber', value)}
                        placeholder="Enter mobile number"
                        feedback={errors.mobileNumber ? 'error' : undefined}
                        feedbackMessage={errors.mobileNumber}
                    />

                    <InputField
                        label="Email address"
                        name="email"
                        value={appointmentData.email}
                        onChange={(value) => handleInputChange('email', value)}
                        type="email"
                        placeholder="Enter email address"
                        feedback={errors.email ? 'error' : undefined}
                        feedbackMessage={errors.email}
                    />

                    <Calendar
                        label="Appointment Date"
                        selectedDate={calendarSelectedDate}
                        onDateChange={handleCalendarDateChange}
                        value={calendarSelectedDate ? 'dateselected' : 'Select appointment date'}
                        leftAligned={false}
                        noBorderRadius={true}
                    />

                    <TimePicker
                        label="Appointment Time"
                        selectedTime={selectedTimeSlot}
                        onTimeChange={handleTimeChange}
                        value={selectedTimeSlot || 'Select appointment time'}
                        noBorderRadius={true}
                    />

                    <Dropdown
                        label="Category"
                        options={categories.map(category => category.name)}
                        value={getCategoryDisplayValue(appointmentData.categoryId)}
                        onChange={handleCategoryChange}
                        isLoading={categoriesLoading}
                        disabled={categoriesLoading}
                        feedback={errors.categoryId ? 'error' : undefined}
                        feedbackMessage={errors.categoryId}
                    />

                    <Dropdown
                        label="Service"
                        options={filteredServices.map(service => service.name)}
                        value={getServiceDisplayValue(appointmentData.serviceId)}
                        onChange={handleServiceChange}
                        isLoading={servicesLoading}
                        disabled={servicesLoading || appointmentData.categoryId <= 0 || filteredServices.length === 0}
                        feedback={errors.serviceId ? 'error' : undefined}
                        feedbackMessage={errors.serviceId}
                    />

                    <Dropdown
                        label="Pricing Option"
                        options={pricingOptions.map(option => option.name)}
                        value={getPricingOptionDisplayValue(appointmentData.pricingOptionId)}
                        onChange={handlePricingOptionChange}
                        disabled={appointmentData.serviceId <= 0 || pricingOptions.length === 0}
                        feedback={errors.pricingOptionId ? 'error' : undefined}
                        feedbackMessage={errors.pricingOptionId}
                    />

                    <InputField
                        label="Amount"
                        name="amount"
                        value={appointmentData.amount}
                        onChange={(value) => handleInputChange('amount', value)}
                        type="number"
                        unit="AED"
                        placeholder="Enter amount"
                        feedback={errors.amount ? 'error' : undefined}
                        feedbackMessage={errors.amount}
                    />

                    <Dropdown
                        label="Assign to staff"
                        options={staff.map(s => s.fullName)}
                        value={getStaffDisplayValue(appointmentData.staffId)}
                        onChange={handleStaffChange}
                        isLoading={staffLoading}
                        disabled={staffLoading}
                    />

                    <Dropdown
                        label="Payment Status"
                        options={paymentStatusOptions.map(status => status.label)}
                        value={getPaymentStatusDisplayValue(appointmentData.paymentStatus)}
                        onChange={handlePaymentStatusChange}
                    />

                    <Dropdown
                        label="Appointment Status"
                        options={appointmentStatusOptions.map(status => status.label)}
                        value={getAppointmentStatusDisplayValue(appointmentData.appointmentStatus)}
                        onChange={handleAppointmentStatusChange}
                    />

                    <TextArea
                        label="Notes"
                        name="notes"
                        value={appointmentData.notes}
                        onChange={(value) => handleInputChange('notes', value)}
                        placeholder="Enter any additional notes..."
                    />

                    <Toggle
                        name="isDraft"
                        label="Save as draft"
                        checked={appointmentData.isDraft}
                        onChange={(value) => handleInputChange('isDraft', value)}
                    />

                    <div className={styles.buttonContainer}>
                        <Button
                            onClick={onClose}
                            label="Cancel"
                            size="medium"
                            noAppearance={true}
                            disabled={isInitialLoading || appointmentLoading}
                        />
                        <Button
                            onClick={handleSubmit}
                            label={isEditMode ? 'Update' : 'Add'}
                            size="medium"
                            disabled={servicesLoading || staffLoading || appointmentLoading || categoriesLoading || isInitialLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditAppointment;