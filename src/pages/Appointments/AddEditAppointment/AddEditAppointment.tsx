import React, { useState, useEffect } from 'react';
import { useServices } from '../../../hooks/useServices';
import { useAppointments } from '../../../hooks/useAppointments';  // Add this import
import InputField from '../../../components/InputField/InputField';
import Toggle from '../../../components/Toggle/Toggle';
import Button from '../../../components/Button/Button';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { AppointmentStatus } from '../../../types/enums';
import { format } from 'date-fns'; // Add this import

import styles from './AddEditAppointment.module.css';

interface AddEditAppointmentProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddEditAppointment: React.FC<AddEditAppointmentProps> = ({ onClose, onSuccess, isOpen }) => {
    const { services, getServices, loading: servicesLoading } = useServices();
    const { createAppointment, loading: appointmentLoading } = useAppointments();  // Add this line

    const [appointmentData, setAppointmentData] = useState({
        clientName: '',
        mobileNumber: '',
        emailAddress: '',
        category: '',
        service: 0,  // Changed to number
        amount: '',
        assignedTo: '',
        status: AppointmentStatus.Upcoming,  // Changed to use enum directly
        saveAsDraft: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const statusOptions = [
        { label: 'Upcoming', value: AppointmentStatus.Upcoming },
        { label: 'Paid', value: AppointmentStatus.Paid },
        { label: 'Late', value: AppointmentStatus.Late },
        { label: 'Unpaid', value: AppointmentStatus.Unpaid },
        { label: 'Draft', value: AppointmentStatus.Draft }
    ];

    useEffect(() => {
        let mounted = true;

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Only fetch if we haven't already
            if (services.length === 0) {
                getServices().catch(error => {
                    if (mounted) {
                        console.error('Failed to fetch services:', error);
                    }
                });
            }
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            mounted = false;
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]); // Remove getServices from dependencies

    const serviceOptions = services.map(service => ({
        label: service.name,
        value: service.id.toString()
    }));

    const handleInputChange = (name: string, value: string | number | boolean) => {
        setAppointmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getServiceDisplayValue = (serviceId: number) => {
        const service = services.find(s => s.id === serviceId);
        return service ? service.name : '';
    };

    const getStatusDisplayValue = (statusValue: AppointmentStatus) => {
        const status = statusOptions.find(s => s.value === statusValue);
        return status ? status.label : '';
    };

    const handleServiceChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            const selectedService = services.find(service => service.name === value);
            if (selectedService) {
                handleInputChange('service', selectedService.id);
            }
        }
    };

    const handleStatusChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            const selectedStatus = statusOptions.find(status => status.label === value);
            if (selectedStatus) {
                handleInputChange('status', selectedStatus.value);
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
        if (!emailRegex.test(appointmentData.emailAddress)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Service validation
        if (!appointmentData.service || appointmentData.service <= 0) {
            newErrors.service = 'Please select a service';
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

            const today = new Date();
            const appointmentRequest = {
                clientName: appointmentData.clientName.trim(),
                mobileNumber: appointmentData.mobileNumber,
                email: appointmentData.emailAddress,
                serviceId: appointmentData.service,
                amount: parseFloat(appointmentData.amount),
                // Format date as YYYY-MM-DD
                appointmentDate: format(today, 'yyyy-MM-dd'),
                // Format time as HH:mm
                appointmentTime: format(today, 'HH:mm'),
                isDraft: appointmentData.saveAsDraft,
                status: appointmentData.status
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
                            <span>Creating appointment...</span>
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
                        name="emailAddress"
                        value={appointmentData.emailAddress}
                        onChange={(value) => handleInputChange('emailAddress', value)}
                        type="email"
                        placeholder="Enter email address"
                        feedback={errors.email ? 'error' : undefined}
                        feedbackMessage={errors.email}
                    />

                    <Dropdown
                        label="Category"
                        options={['Haircut', 'Coloring', 'Styling', 'Treatment']}
                        value={appointmentData.category}


                    />

                    <Dropdown
                        label="Service"
                        options={services.map(service => service.name)}
                        value={getServiceDisplayValue(appointmentData.service)}
                        onChange={handleServiceChange}
                        isLoading={servicesLoading}
                        disabled={servicesLoading}
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
                        label="Assign to someone"
                        options={['Ahmad Housam', 'Adam Zanaty']}
                        value={appointmentData.assignedTo}


                    />

                    <Dropdown
                        label="Status"
                        options={statusOptions.map(status => status.label)}
                        value={getStatusDisplayValue(appointmentData.status)}
                        onChange={handleStatusChange}
                    />

                    <Toggle
                        name="saveAsDraft"
                        label="Save as draft"
                        checked={appointmentData.saveAsDraft}
                        onChange={(value) => handleInputChange('saveAsDraft', value)}
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
                            disabled={servicesLoading || appointmentLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditAppointment;