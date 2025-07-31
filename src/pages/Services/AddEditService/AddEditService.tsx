import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useServices } from "../../../hooks/useServices";
import { useCategories } from "../../../hooks/useCategories";
import { Category } from "../../../types/api-responses";
import { ServiceRequest, UpdateServiceRequest } from "../../../services/api";
import InputField from "../../../components/InputField/InputField";
import Toggle from "../../../components/Toggle/Toggle";
import Button from "../../../components/Button/Button";
import Checkbox from "../../../components/Checkbox/Checkbox";
import ProgressBar from "../../../components/ProgressBar/ProgressBar";
import Dropdown from "../../../components/Dropdown/Dropdown";
import SearchBar from "../../../components/SearchBar/SearchBar";
import styles from './AddEditService.module.css';

interface AddEditProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingServiceId?: number | null;
}

const AddEditService: React.FC<AddEditProps> = ({ onClose, onSuccess, isOpen, editingServiceId }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingService, setIsLoadingService] = useState(false);
    const { getBusinessCategories } = useCategories();
    const { createService, updateService, getService, loading } = useServices();

    const isEditMode = !!editingServiceId;

    const [serviceData, setServiceData] = useState({
        categoryId: 0,
        name: '',
        image: null as File | null,
        removeExistingImage: false,
        minDuration: '00:30:00',
        maxDuration: '01:00:00',
        serviceType: 1,
        hasHomeService: false,
        description: '',
        isActive: true,
        pricingOptions: [] as Array<{
            name: string;
            price: number;
            currency: string;
            duration: string;
        }>
    });

    const fetchCategories = useCallback(async () => {
        setIsLoadingCategories(true);
        try {
            const response = await getBusinessCategories();
            setCategories(response.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoadingCategories(false);
        }
    }, [getBusinessCategories]);

    const loadServiceData = useCallback(async (serviceId: number) => {
        setIsLoadingService(true);
        try {
            const service = await getService(serviceId);
            setServiceData({
                categoryId: 0, // Will be set after categories are loaded
                name: service.name,
                image: null,
                removeExistingImage: false,
                minDuration: service.minDuration,
                maxDuration: service.maxDuration,
                serviceType: service.serviceType,
                hasHomeService: service.hasHomeService,
                description: service.description || '',
                isActive: service.isActive,
                pricingOptions: service.pricingOptions.map(option => ({
                    name: option.name,
                    price: option.price,
                    currency: option.currency,
                    duration: option.duration
                }))
            });
        } catch (error) {
            console.error('Error loading service:', error);
        } finally {
            setIsLoadingService(false);
        }
    }, [getService]);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (isEditMode && editingServiceId) {
                loadServiceData(editingServiceId);
            }
        }
    }, [isOpen, isEditMode, editingServiceId, fetchCategories, loadServiceData]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleSubmit = async () => {
        try {
            if (isEditMode && editingServiceId) {
                const updateData: UpdateServiceRequest = {
                    name: serviceData.name,
                    image: serviceData.image || undefined,
                    removeExistingImage: serviceData.removeExistingImage,
                    minDuration: serviceData.minDuration,
                    maxDuration: serviceData.maxDuration,
                    serviceType: serviceData.serviceType,
                    hasHomeService: serviceData.hasHomeService,
                    description: serviceData.description,
                    isActive: serviceData.isActive,
                    pricingOptions: serviceData.pricingOptions
                };
                await updateService(editingServiceId, updateData);
            } else {
                const requestData: ServiceRequest = {
                    categoryId: serviceData.categoryId,
                    name: serviceData.name,
                    image: serviceData.image || undefined,
                    minDuration: serviceData.minDuration,
                    maxDuration: serviceData.maxDuration,
                    serviceType: serviceData.serviceType,
                    hasHomeService: serviceData.hasHomeService,
                    description: serviceData.description,
                    pricingOptions: serviceData.pricingOptions
                };
                await createService(requestData);
            }
            await onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving service:', error);
        }
    };

    const [step, setStep] = useState(1);

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleInputChange = (name: string, value: string | number | boolean | File | null) => {
        setServiceData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleInputChange('image', file);
            handleInputChange('removeExistingImage', false);
        }
    };

    const handleRemoveImage = () => {
        handleInputChange('image', null);
        handleInputChange('removeExistingImage', true);
    };

    const handlePricingOptionAdd = () => {
        const newPricingOption = {
            name: "",
            price: 0,
            currency: "AED",
            duration: "00:30:00"
        };
        setServiceData(prev => ({
            ...prev,
            pricingOptions: [...prev.pricingOptions, newPricingOption]
        }));
    };

    const handlePricingOptionChange = (index: number, field: string, value: string | number) => {
        setServiceData(prev => {
            const updatedOptions = [...prev.pricingOptions];
            updatedOptions[index] = {
                ...updatedOptions[index],
                [field]: value
            };
            return {
                ...prev,
                pricingOptions: updatedOptions
            };
        });
    };

    const handlePricingOptionDelete = (index: number) => {
        setServiceData(prev => ({
            ...prev,
            pricingOptions: prev.pricingOptions.filter((_, i) => i !== index)
        }));
    };

    const getCategoryOptions = () => {
        return categories.map(cat => cat.name);
    };

    const getCategoryIdByName = (name: string) => {
        const category = categories.find(cat => cat.name === name);
        return category ? category.id : 0;
    };

    return (
        <div className={`${styles.modalBackground} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContainer} ${isOpen ? styles.open : ''}`}>
                {(loading || isLoadingService) && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}>
                            <svg viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                            </svg>
                            <span>{isEditMode ? 'Updating service...' : 'Creating service...'}</span>
                        </div>
                    </div>
                )}
                <div className={styles.progressWrappar}>
                    <button onClick={onClose} className={styles.closeButton} >&times;</button>
                    <ProgressBar progress={(step / 3) * 100} label={`Step ${step} out of 3`} />
                    <h2 className={`${styles.header} headerText`}>
                        {isEditMode ? 'Edit service' : 'Add service'}
                        {step === 1 && " - Service information"}
                        {step === 2 && " - Pricing & duration"}
                        {step === 3 && " - Assign employee"}
                    </h2>
                </div>
                <div className={styles.headerCloseInputsContainer}>
                    {step === 1 && (
                        <>
                            <div className={styles.uploadphoto}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    id="serviceImage"
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="serviceImage" className={styles.uploadphotolbl}>
                                    {serviceData.image ? (
                                        <img
                                            src={URL.createObjectURL(serviceData.image)}
                                            alt="service preview"
                                            className={styles.previewImage}
                                        />
                                    ) : (
                                        <>
                                            <img src="./assets/icons/uploadphoto.png" alt="upload" />
                                            <span className={styles.desc}>Upload service photo</span>
                                        </>
                                    )}
                                </label>
                                {isEditMode && (serviceData.image || !serviceData.removeExistingImage) && (
                                    <Button
                                        label="Remove Image"
                                        onClick={handleRemoveImage}
                                        size="small"
                                        variant="secondary"
                                    />
                                )}
                            </div>
                            <InputField
                                label="Service name"
                                name="name"
                                value={serviceData.name}
                                onChange={(value) => handleInputChange('name', value)}
                                placeholder="Service name"
                            />
                            {!isEditMode && (
                                <Dropdown
                                    label="Category"
                                    options={getCategoryOptions()}
                                    value={categories.find(cat => cat.id === serviceData.categoryId)?.name || ''}
                                    onChange={(value) => handleInputChange('categoryId', getCategoryIdByName(value as string))}
                                    isLoading={isLoadingCategories}
                                />
                            )}
                            <Dropdown label="Branch" />
                            <div className={styles.checkboxGroup}>
                                <Checkbox
                                    label="Men only"
                                    checked={serviceData.serviceType === 1}
                                    onChange={() => handleInputChange('serviceType', 1)}
                                    variant="button"
                                />
                                <Checkbox
                                    label="Women only"
                                    checked={serviceData.serviceType === 2}
                                    onChange={() => handleInputChange('serviceType', 2)}
                                    variant="button"
                                />
                                <Checkbox
                                    label="Everyone"
                                    checked={serviceData.serviceType === 3}
                                    onChange={() => handleInputChange('serviceType', 3)}
                                    variant="button"
                                />
                            </div>
                            <Toggle
                                name='homeServicesAvailable'
                                label="Home service available"
                                checked={serviceData.hasHomeService}
                                onChange={(value) => handleInputChange('hasHomeService', value)}
                            />
                            {isEditMode && (
                                <Toggle
                                    name='isActive'
                                    label="Service active"
                                    checked={serviceData.isActive}
                                    onChange={(value) => handleInputChange('isActive', value)}
                                />
                            )}
                        </>
                    )}
                    {step === 2 && (
                        <>
                            {serviceData.pricingOptions.map((option, index) => (
                                <div key={index} className={styles.pricingOptionContainer}>
                                    {serviceData.pricingOptions.length > 1 && (
                                        <div className={styles.deletebutton}>
                                            <Button
                                                label="Delete"
                                                onClick={() => handlePricingOptionDelete(index)}
                                                noAppearance={true}
                                                backgroundColor="transparent"
                                                size="small"
                                                fontColor="#ff4444"
                                                icon={
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M7.08331 4.14167L7.26665 3.05001C7.39998 2.25834 7.49998 1.66667 8.90831 1.66667H11.0916C12.5 1.66667 12.6083 2.29167 12.7333 3.05834L12.9166 4.14167" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M15.7084 7.61667L15.1667 16.0083C15.075 17.3167 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3167 4.83335 16.0083L4.29169 7.61667" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                }
                                            />
                                        </div>
                                    )}
                                    <div className={styles.pricingOptionHeader}>
                                        <InputField
                                            label="Pricing option name"
                                            name={`pricingOption-${index}-name`}
                                            value={option.name}
                                            onChange={(value) => handlePricingOptionChange(index, 'name', value)}
                                            placeholder="Pricing option name"
                                        />
                                    </div>
                                    <InputField
                                        label="Duration"
                                        name={`pricingOption-${index}-duration`}
                                        value={option.duration}
                                        onChange={(value) => handlePricingOptionChange(index, 'duration', value)}
                                        placeholder="HH:mm:ss"
                                    />
                                    <InputField
                                        label="Price"
                                        name={`pricingOption-${index}-price`}
                                        value={option.price.toString()}
                                        onChange={(value) => handlePricingOptionChange(index, 'price', parseFloat(value))}
                                        type="number"
                                        unit="AED"
                                    />
                                </div>
                            ))}
                            <Button
                                label="Add pricing option"
                                onClick={handlePricingOptionAdd}
                                noAppearance={true}
                                backgroundColor="transparent"
                                iconPosition="left"
                                size="medium"
                                fontColor="#6138e0"
                                icon={
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.0753 19L9.92529 1" stroke="#6138E0" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 10.075L19 9.92505" stroke="#6138E0" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                            />
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <div className={styles.searchSection}>
                                <SearchBar placeholder="Search employee" />
                            </div>
                            <div className={styles.empsContainer}>
                                <div className={styles.empCard}>
                                    <Checkbox />
                                    <img className={styles.empImg} src="./assets/icons/emp.png" alt="" />
                                    <div className={styles.empDetails}>
                                        <span className={styles.empName}>Ahmad Housam</span>
                                        <span className={styles.empTitle}>Junior stylist</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.buttonContainer}>
                        <Button onClick={prevStep} label='Back' size='medium' noAppearance={true} disabled={step === 1} variant={step === 1 ? 'disabled' : 'primary'} />
                        <Button
                            onClick={step === 3 ? handleSubmit : nextStep}
                            label={step === 3 ? (isEditMode ? 'Update' : 'Done') : 'Next'}
                            size='medium'
                            disabled={loading || isLoadingService}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditService;