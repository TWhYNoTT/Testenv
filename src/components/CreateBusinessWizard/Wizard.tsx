import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Wizard.module.css';
import Step1 from './Step1/Step1';
import Step2 from './Step2/Step2';
import Step3 from './Step3/Step3';
import Step4 from './Step4/Step4';
import ProgressBar from '../ProgressBar/ProgressBar';
import Button from '../Button/Button';
import Hint from '../Hint/Hint';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { ServiceType } from '../../types/enums';
import { useBizContext } from '../../contexts/BusinessContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Toast } from '../Toast/Toast';

// Set default marker icon
const defaultIcon = L.icon({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});
L.Marker.prototype.options.icon = defaultIcon;

const Wizard: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const { businessData, updateBusinessData, submitBusiness, loading, checkAndNavigate } = useBizContext();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        checkAndNavigate();
    }, []);

    interface BusinessHour {
        dayOfWeek: number;
        isOpen: boolean;
        openTime?: string;
        closeTime?: string;
        is24Hours: boolean;
    }

    const handleBusinessHoursChange = (value: React.SetStateAction<BusinessHour[]>) => {
        const hours = typeof value === 'function' ? value(businessData.businessHours) : value;
        updateBusinessData({ businessHours: hours });
    };

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        updateBusinessData({
            location: {
                ...businessData.location,
                latitude: e.latlng.lat,
                longitude: e.latlng.lng
            }
        });
    };

    const LocationMarker: React.FC = () => {
        const map = useMap();
        useMapEvents({
            click: handleMapClick,
            locationfound(e) {
                map.flyTo(e.latlng, map.getZoom());
            },
        });

        const position: L.LatLng | null = businessData.location.latitude && businessData.location.longitude
            ? L.latLng(businessData.location.latitude, businessData.location.longitude)
            : null;

        return position ? <Marker position={position} /> : null;
    };

    const validateCurrentStep = () => {
        switch (step) {
            case 1:
                console.log('Step 1 validation:', {
                    nameLength: businessData.businessName.length,
                    aboutLength: businessData.about.length
                });
                return businessData.businessName.length >= 3 &&
                    businessData.about.length >= 10;

            case 2:
                return businessData.serviceType !== undefined &&
                    businessData.categoryIds.length > 0;

            case 3:
                if (businessData.isAlwaysOpen) return true;
                return businessData.businessHours.some((hour: BusinessHour) =>
                    hour.isOpen && (hour.is24Hours ||
                        (typeof hour.openTime === 'string' && typeof hour.closeTime === 'string'))
                );

            case 4:
                return businessData.location.country &&
                    businessData.location.city &&
                    businessData.location.state &&
                    businessData.location.streetAddress &&
                    businessData.location.zipCode &&
                    businessData.location.latitude !== undefined;

            default:
                return false;
        }
    };

    const handleNext = async () => {
        if (!validateCurrentStep()) {
            return;
        }

        if (step === 4) {
            try {
                await submitBusiness(); // Let the context handle the data transformation
                navigate('/dashboard');
            } catch (error: any) {
                // Add global error message if needed
                if (error.errors?.Business) {
                    setErrorMessage(error.errors.Business[0]);
                } else if (error.message) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An unexpected error occurred');
                }
            }
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
        }
    };

    const handleLocationChange = (field: string, value: string) => {
        updateBusinessData({
            location: {
                ...businessData.location,
                [field]: value
            }
        });
    };

    const handleToggleChange = (field: string, value: boolean) => {
        updateBusinessData({
            location: {
                ...businessData.location,
                [field]: value
            }
        });
    };

    return (
        <div className={styles.wizardContainer}>
            {errorMessage && (
                <Toast
                    message={errorMessage}
                    type="error"
                    onClose={() => setErrorMessage(null)}
                />
            )}
            {/* Show global error message if exists */}

            <div className={styles.wizardHeader}>
                <div className="container">
                    {/* Your logo SVG */}
                </div>
            </div>

            <div className={styles.wizardContent}>
                <div className={styles.formContainer}>
                    <div className={styles.progressWrappar}>
                        <ProgressBar progress={(step / 4) * 100} label={`Step ${step} out of 4`} />
                    </div>

                    <div className={styles.StepContainer}>
                        {step === 1 && (
                            <Step1
                                formData={{
                                    businessName: businessData.businessName,
                                    about: businessData.about,
                                    businessRegistrationNumber: businessData.businessRegistrationNumber
                                }}
                                setFormData={updateBusinessData}

                            />
                        )}

                        {step === 2 && (
                            <Step2
                                selectedCategories={businessData.categoryIds}
                                setSelectedCategories={(newCategories: React.SetStateAction<string[]>) => {
                                    const categories = typeof newCategories === 'function'
                                        ? newCategories(businessData.categoryIds)
                                        : newCategories;
                                    console.log('New categories:', categories);
                                    updateBusinessData({
                                        categoryIds: categories
                                    });
                                }}
                                selectedServiceType={businessData.serviceType || ServiceType.Everyone}
                                setSelectedServiceType={serviceType =>
                                    updateBusinessData({ serviceType: serviceType as ServiceType })}

                            />
                        )}

                        {step === 3 && (
                            <Step3
                                alwaysOpen={businessData.isAlwaysOpen}
                                setAlwaysOpen={isAlwaysOpen =>
                                    updateBusinessData({ isAlwaysOpen })}
                                businessHours={businessData.businessHours}
                                setBusinessHours={handleBusinessHoursChange}

                            />
                        )}

                        {step === 4 && (
                            <Step4
                                locationData={{
                                    ...businessData.location,
                                    latitude: businessData.location.latitude || 0,
                                    longitude: businessData.location.longitude || 0,
                                }}
                                setLocationData={(locationData) => {
                                    // Handle both function and direct value updates
                                    const newLocation = typeof locationData === 'function'
                                        ? locationData(businessData.location)
                                        : locationData;

                                    updateBusinessData({
                                        location: {
                                            ...businessData.location,
                                            ...newLocation
                                        }
                                    });
                                }}
                                onFieldChange={handleLocationChange}
                                onToggleChange={handleToggleChange}

                            />
                        )}
                    </div>
                </div>

                <div className={`${styles.hintMapContainer} ${styles['map' + step]}`}>
                    {step === 4 ? (
                        <MapContainer
                            center={[businessData.location.latitude || 25.276987,
                            businessData.location.longitude || 55.296249]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <LocationMarker />
                        </MapContainer>
                    ) : (
                        <Hint
                            name={`Step ${step}`}
                            description={getHintDescription(step)}
                        />
                    )}
                </div>
            </div>

            <div className={styles.wizardFooter}>
                <div className="container">
                    <Button
                        onClick={handleBack}
                        label='Back'
                        size='medium'
                        noAppearance={true}
                        disabled={step === 1 || loading}
                        variant={step === 1 ? 'disabled' : 'primary'}
                    />
                    <Button
                        onClick={handleNext}
                        label={step === 4 ? (loading ? 'Creating...' : 'Done') : 'Next'}
                        size='medium'
                        disabled={loading || !validateCurrentStep()}
                    />
                </div>
            </div>
        </div>
    );
};

const getHintDescription = (step: number): string => {
    switch (step) {
        case 1:
            return 'Enter your business details including name and description';
        case 2:
            return 'Select your service type and business categories';
        case 3:
            return 'Set your business operating hours';
        default:
            return 'Complete the information for this step';
    }
};

export default Wizard;