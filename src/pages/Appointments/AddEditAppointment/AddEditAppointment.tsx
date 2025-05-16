import React, { useState, useEffect, useCallback } from 'react';
import { useServices } from '../../../hooks/useServices';
import { useAppointments } from '../../../hooks/useAppointments';
import { useStaff } from '../../../hooks/useStaff';
import { useCategories } from '../../../hooks/useCategories'; // Add this import
import InputField from '../../../components/InputField/InputField';
import Toggle from '../../../components/Toggle/Toggle';
import Button from '../../../components/Button/Button';
import Dropdown from '../../../components/Dropdown/Dropdown';
import TextArea from '../../../components/TextArea/TextArea';
import styles from './AddEditAppointment.module.css';

// Define the enums based on provided code
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
    businessId?: number;
}

const AddEditAppointment: React.FC<AddEditAppointmentProps> = ({
    onClose,
    onSuccess,
    isOpen,
    selectedTime,
    selectedDate,
    businessId = 0
}) => {
    const { services, getServices, loading: servicesLoading } = useServices();
    const { createAppointment, loading: appointmentLoading } = useAppointments();
    const { staff, getBusinessStaff, loading: staffLoading } = useStaff();
    // Use the categories hook
    const { getBusinessCategories, loading: categoriesLoading } = useCategories();

    // State for categories, filtered services, and pricing options
    const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([]);
    const [filteredServices, setFilteredServices] = useState<Array<any>>([]);
    const [pricingOptions, setPricingOptions] = useState<Array<{ id: number, name: string, price: number, currency: string, duration: string }>>([]);

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

    const fetchInitialData = useCallback(async () => {
        try {
            // Fetch services if not already loaded
            if (services.length === 0) {
                await getServices();
            }

            // Fetch staff data if businessId is provided
            if (staff.length === 0) {
                await getBusinessStaff({ businessId });
            }

            // Fetch categories
            const categoriesResponse = await getBusinessCategories();
            setCategories(categoriesResponse.categories.map(cat => ({
                id: cat.id,
                name: cat.name
            })));
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        }
    }, [getServices, getBusinessStaff, getBusinessCategories, services.length, businessId]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            fetchInitialData();

            // Fix the date parsing to create a valid date object
            try {
                let formattedDate: any;

                // Parse the date parts correctly
                if (selectedDate && selectedDate.includes('/')) {
                    const [day, month, year] = selectedDate.split('/').map(Number);

                    // Create a proper date object
                    const dateObj = new Date(year, month - 1, day); // month is 0-indexed in JS

                    // If we have a time, add it to the date
                    if (selectedTime && selectedTime.includes(':')) {
                        const [hours, minutes] = selectedTime.split(':').map(Number);
                        dateObj.setHours(hours, minutes, 0, 0);
                    } else {
                        // Default to current time if no time provided
                        const now = new Date();
                        dateObj.setHours(now.getHours(), now.getMinutes(), 0, 0);
                    }

                    // Now create the ISO string
                    formattedDate = dateObj.toISOString();
                } else {
                    // Fallback to current date/time
                    formattedDate = new Date().toISOString();
                }

                setAppointmentData(prev => ({
                    ...prev,
                    appointmentDate: formattedDate
                }));
            } catch (error) {
                console.error('Error formatting date:', error, { selectedDate, selectedTime });
                // Fallback to current date if there's a parsing error
                setAppointmentData(prev => ({
                    ...prev,
                    appointmentDate: new Date().toISOString()
                }));
            }
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, fetchInitialData, selectedDate, selectedTime]);


    // Filter services when category changes
    useEffect(() => {
        if (appointmentData.categoryId > 0 && services.length > 0) {
            // Get the selected category name
            const selectedCategory = categories.find(c => c.id === appointmentData.categoryId);

            if (selectedCategory) {
                // Filter services by matching the categoryName
                const servicesForCategory = services.filter(service =>
                    service.categoryName.toLowerCase() === selectedCategory.name.toLowerCase()
                );

                setFilteredServices(servicesForCategory);
            } else {
                setFilteredServices([]);
            }

            // Reset service and pricing option selections when category changes
            setAppointmentData(prev => ({
                ...prev,
                serviceId: 0,
                pricingOptionId: 0,
                amount: ''
            }));
            setPricingOptions([]);
        } else {
            setFilteredServices([]);
        }
    }, [appointmentData.categoryId, services, categories]);

    // Update pricing options when service changes
    useEffect(() => {
        if (appointmentData.serviceId > 0) {
            const selectedService = services.find(s => s.id === appointmentData.serviceId);
            if (selectedService && selectedService.pricingOptions) {
                setPricingOptions(selectedService.pricingOptions.map((opt: any, index: number) => ({
                    id: index + 1, // Generate an ID if none exists
                    name: opt.name,
                    price: opt.price,
                    currency: opt.currency || 'AED',
                    duration: opt.duration
                })));
            } else {
                setPricingOptions([]);
            }

            // Reset pricing option selection when service changes
            setAppointmentData(prev => ({
                ...prev,
                pricingOptionId: 0,
                amount: ''
            }));
        } else {
            setPricingOptions([]);
        }
    }, [appointmentData.serviceId, services]);

    const handleInputChange = (name: string, value: string | number | boolean) => {
        setAppointmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
                // Update amount with the pricing option's price
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Client Name validation
        if (!appointmentData.clientName || appointmentData.clientName.length < 3 || appointmentData.clientName.length > 100) {
            newErrors.clientName = 'Name must be between 3 and 100 characters';
        }
        if (!/^[a-zA-Z\s]*$/.test(appointmentData.clientName)) {
            newErrors.clientName = 'Name can only contain letters and spaces';
        }

        // Mobile Number validation
        if (!/^\d{10,15}$/.test(appointmentData.mobileNumber)) {
            newErrors.mobileNumber = 'Mobile number must be between 10 and 15 digits';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(appointmentData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Category validation
        if (!appointmentData.categoryId || appointmentData.categoryId <= 0) {
            newErrors.categoryId = 'Please select a category';
        }

        // Service validation
        if (!appointmentData.serviceId || appointmentData.serviceId <= 0) {
            newErrors.serviceId = 'Please select a service';
        }

        // Pricing option validation
        if (!appointmentData.pricingOptionId || appointmentData.pricingOptionId <= 0) {
            newErrors.pricingOptionId = 'Please select a pricing option';
        }

        // Amount validation
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

            // Create a properly formatted date string for the API
            let formattedDate = appointmentData.appointmentDate;

            // Double-check that we have a valid date before submitting
            if (!formattedDate || formattedDate === 'Invalid Date') {
                // Fallback to current date/time
                formattedDate = new Date().toISOString();
            }

            const appointmentRequest = {
                businessId: appointmentData.businessId,
                clientName: appointmentData.clientName.trim(),
                mobileNumber: appointmentData.mobileNumber,
                email: appointmentData.email,
                categoryId: appointmentData.categoryId,
                serviceId: appointmentData.serviceId,
                pricingOptionId: appointmentData.pricingOptionId,
                amount: parseFloat(appointmentData.amount),
                staffId: appointmentData.staffId,
                paymentStatus: appointmentData.paymentStatus,
                appointmentDate: formattedDate,
                isDraft: appointmentData.isDraft,
                notes: appointmentData.notes
            };

            await createAppointment(appointmentRequest);
            await onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating appointment:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.modalBackground} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContainer} ${isOpen ? styles.open : ''}`}>
                {(appointmentLoading) && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}>
                            <svg viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                            </svg>
                            <span>
                                {appointmentLoading ? 'Creating appointment...' :
                                    categoriesLoading ? 'Loading categories...' :
                                        'Loading staff...'}
                            </span>
                        </div>
                    </div>
                )}

                <div className={styles.headerCloseContainer}>
                    <button onClick={onClose} className={styles.closeButton}>&times;</button>
                    <h2 className={styles.header}>New appointment</h2>
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
                        />
                        <Button
                            onClick={handleSubmit}
                            label="Add"
                            size="medium"
                            disabled={servicesLoading || staffLoading || appointmentLoading || categoriesLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditAppointment;