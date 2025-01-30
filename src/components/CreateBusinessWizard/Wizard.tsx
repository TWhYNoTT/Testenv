import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';

import Step1 from './Step1/Step1';
import Step2 from './Step2/Step2';
import Step3 from './Step3/Step3';
import Step4 from './Step4/Step4';
import ProgressBar from '../ProgressBar/ProgressBar';
import Hint from '../Hint/Hint';
import styles from './Wizard.module.css';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ServiceType } from '../../types/enums';
import { Business, BusinessHours } from '../../types/business';
import {
    useGetMyBusinessesQuery,
    useGetCategoriesQuery,
    useCreateBusinessMutation,
    useUpdateBusinessMutation
} from '../../store/api';

// Set up the default icon for leaflet
const defaultIcon = L.icon({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});
L.Marker.prototype.options.icon = defaultIcon;

const DEFAULT_LATITUDE = 25.276987;
const DEFAULT_LONGITUDE = 55.296249;

const Wizard: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<string[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [businessId, setBusinessId] = useState<number | null>(null);

    // RTK Query hooks
    const {
        data: businesses,
        isLoading: isLoadingBusinesses
    } = useGetMyBusinessesQuery({ skip: false });

    const {
        data: categories = [],
        isLoading: isLoadingCategories
    } = useGetCategoriesQuery({ activeOnly: true });

    const [createBusiness, { isLoading: isCreating }] = useCreateBusinessMutation();
    const [updateBusiness, { isLoading: isUpdatingBusiness }] = useUpdateBusinessMutation();

    // Form states with proper initialization
    const [formData, setFormData] = useState({
        businessName: '',
        about: '',
    });

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>(ServiceType.Everyone);

    const [alwaysOpen, setAlwaysOpen] = useState(false);
    const [weekDays, setWeekDays] = useState<string[]>([]);
    const [businessHours, setBusinessHours] = useState<{
        [key: string]: { from: string; to: string }
    }>({});

    const [locationData, setLocationData] = useState({
        country: '',
        state: '',
        streetAddress: '',
        city: '',
        zipCode: '',
        homeServicesAvailable: false,
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE
    });

    const [markerPosition, setMarkerPosition] = useState<{ lat: number, lng: number }>({
        lat: DEFAULT_LATITUDE,
        lng: DEFAULT_LONGITUDE
    });

    // Effect to populate form with business data
    useEffect(() => {
        if (businesses && businesses.length > 0) {
            const business: Business = businesses[0];

            try {
                setIsEditMode(true);
                setBusinessId(business.id);

                // Step 1: Basic Info
                setFormData({
                    businessName: business.name || '',
                    about: business.about || ''
                });

                // Step 2: Service Type and Categories
                if (business.serviceType !== undefined) {
                    setSelectedServiceType(business.serviceType);
                }

                if (business.categories && Array.isArray(business.categories)) {
                    const categoryIds = business.categories.map(cat => cat.categoryId);
                    setSelectedCategories(categoryIds);
                }

                // Step 3: Business Hours
                if (business.isAlwaysOpen !== undefined) {
                    setAlwaysOpen(business.isAlwaysOpen);
                }

                if (business.businessHours && Array.isArray(business.businessHours)) {
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const activeWeekDays: string[] = [];
                    const hoursMap: { [key: string]: { from: string; to: string } } = {};

                    business.businessHours.forEach((hour: BusinessHours) => {
                        if (hour.dayOfWeek >= 0 && hour.dayOfWeek < days.length) {
                            const dayName = days[hour.dayOfWeek];
                            activeWeekDays.push(dayName);
                            hoursMap[dayName] = {
                                from: hour.openTime || '',
                                to: hour.closeTime || ''
                            };
                        }
                    });

                    setWeekDays(activeWeekDays);
                    setBusinessHours(hoursMap);
                }

                // Step 4: Location
                if (business.location) {
                    const location = business.location;
                    const lat = location.latitude || DEFAULT_LATITUDE;
                    const lng = location.longitude || DEFAULT_LONGITUDE;

                    setLocationData({
                        country: location.city || '',
                        state: location.state || '',
                        streetAddress: location.streetAddress || '',
                        city: location.city || '',
                        zipCode: location.zipCode || '',
                        homeServicesAvailable: location.hasHomeService || false,
                        latitude: lat,
                        longitude: lng
                    });

                    setMarkerPosition({ lat, lng });
                }
            } catch (error) {
                console.error('Error populating form data:', error);
                setErrors(['Error loading business data. Please try again.']);
            }
        }
    }, [businesses]);

    const validateStep = (currentStep: number): boolean => {
        const newErrors: string[] = [];

        switch (currentStep) {
            case 1:
                if (!formData.businessName.trim()) {
                    newErrors.push('Business name is required');
                }
                if (!formData.about.trim()) {
                    newErrors.push('Business description is required');
                }
                break;

            case 2:
                if (selectedCategories.length === 0) {
                    newErrors.push('Please select at least one category');
                }
                break;

            case 3:
                if (!alwaysOpen && weekDays.length === 0) {
                    newErrors.push('Please select business days or mark as always open');
                }
                if (!alwaysOpen && weekDays.length > 0) {
                    const invalidHours = weekDays.some(day => !businessHours[day]?.from || !businessHours[day]?.to);
                    if (invalidHours) {
                        newErrors.push('Please set both opening and closing times for selected days');
                    }
                }
                break;

            case 4:
                if (!locationData.city.trim()) {
                    newErrors.push('City is required');
                }
                if (!locationData.state.trim()) {
                    newErrors.push('State is required');
                }
                if (!locationData.streetAddress.trim()) {
                    newErrors.push('Street address is required');
                }
                break;
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        const newPosition = {
            lat: e.latlng.lat,
            lng: e.latlng.lng
        };
        setMarkerPosition(newPosition);
        setLocationData(prev => ({
            ...prev,
            latitude: newPosition.lat,
            longitude: newPosition.lng
        }));
    };

    const LocationMarker: React.FC = () => {
        const map = useMap();
        useMapEvents({
            click: handleMapClick,
            locationfound(e) {
                map.flyTo(e.latlng, map.getZoom());
            },
        });

        return markerPosition ? <Marker position={markerPosition} /> : null;
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        try {
            const businessData = {
                name: formData.businessName,
                about: formData.about,
                serviceType: selectedServiceType,
                isAlwaysOpen: alwaysOpen,
                location: {
                    country: locationData.country,
                    city: locationData.city,
                    state: locationData.state,
                    streetAddress: locationData.streetAddress,
                    zipCode: locationData.zipCode,
                    hasHomeService: locationData.homeServicesAvailable,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude
                },
                businessHours: !alwaysOpen ? weekDays.map(day => {
                    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
                    return {
                        dayOfWeek: dayIndex,
                        isOpen: true,
                        openTime: businessHours[day]?.from || '',
                        closeTime: businessHours[day]?.to || '',
                        is24Hours: false
                    };
                }) : [],
                categoryIds: selectedCategories
            };

            if (isEditMode && businessId) {
                await updateBusiness({ id: businessId, ...businessData }).unwrap();
            } else {
                await createBusiness(businessData).unwrap();
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving business:', error);
            setErrors(['Failed to save business. Please try again.']);
        }
    };

    const nextStep = () => {
        if (validateStep(step)) {
            if (step < 4) {
                setStep(step + 1);
                setErrors([]);
            } else {
                handleSubmit();
            }
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
            setErrors([]);
        }
    };

    if (isLoadingBusinesses || isLoadingCategories) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.wizardContainer}>
            <div className={styles.wizardHeader}>
                <div className="container">
                    <svg width="161" height="33" viewBox="0 0 161 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_504_1164)">
                            <path d="M27.5551 21.3509C26.5145 24.9546 24.3178 28.0158 21.4274 30.1471C20.3483 30.9221 19.1921 31.5808 17.9203 32.1233C17.8047 32.1233 17.6505 32.1233 17.4964 32.1233L5.47217 32.162V0.116197C7.97721 -5.11413e-05 10.4052 -0.0775502 12.7561 0.154947C15.608 0.426193 18.3442 1.20118 20.9264 2.98366C21.0805 3.09991 21.2732 3.21616 21.4274 3.33241C25.0115 6.00612 27.3238 9.80357 28.0175 13.9498C28.4029 16.3522 28.2873 18.871 27.5551 21.3509Z" fill="#FFB6B3" />
                            <path d="M15.9547 21.9322C19.7221 21.9322 22.7761 18.8614 22.7761 15.0735C22.7761 11.2856 19.7221 8.21484 15.9547 8.21484C12.1874 8.21484 9.1333 11.2856 9.1333 15.0735C9.1333 18.8614 12.1874 21.9322 15.9547 21.9322Z" fill="#FFD5C5" />
                            <path d="M3.31396 13.2912V32.0073V32.1623L5.47216 32.046L18.3828 31.271C19.2306 31.271 20.0399 29.1398 20.8493 29.0235C21.119 27.7448 20.7336 25.3423 20.3868 25.2261C20.1941 25.1486 19.6931 24.9548 19.0379 24.6836C18.1515 24.3349 17.0339 23.8699 16.2631 23.5986C15.6465 23.3661 15.1455 22.8236 14.7601 22.1649C14.4903 21.6999 14.2205 21.2349 14.0278 20.7699C13.9508 20.5761 13.8737 20.4212 13.7966 20.2662C13.7195 20.0724 13.6424 19.8787 13.5654 19.7237C13.1414 18.5999 12.3707 17.8249 11.9467 17.4762C11.5228 17.1274 10.8676 17.0499 10.0198 16.7787C9.17191 16.5074 9.17191 15.4612 9.05629 14.88C9.05629 14.8025 8.94068 14.6862 8.78652 14.6475C8.01574 14.2987 5.70339 14.3762 5.70339 14.3762C5.62631 14.2987 5.51069 14.2212 5.43362 14.1437C4.54722 13.2137 3.81497 13.1362 3.31396 13.2912Z" fill="#B15EAA" />
                            <path d="M31.7173 18.0186C31.6402 21.8548 30.0601 25.3422 27.5551 27.8997C25.5125 29.9534 22.8148 31.3871 19.8472 31.8909C19.2306 32.0071 18.5755 32.0459 17.9203 32.0846C17.8047 32.0846 17.6505 32.0846 17.4964 32.0846L5.47215 32.1234H3.3525H3.31396C3.31396 32.1234 3.31396 32.1234 3.3525 32.0846L3.39104 32.0459C3.85351 31.5809 4.66283 30.4959 5.47215 29.4497C5.47215 29.4497 5.47215 29.4497 5.47215 29.4109C6.35855 28.2872 7.28349 27.1635 7.86158 26.776C9.94269 25.4197 10.6749 25.226 10.6749 25.226C11.0603 25.1097 11.4072 24.8772 11.677 24.606C12.3321 23.986 12.7175 23.0948 12.8717 22.6685C12.9487 22.436 13.0644 22.2035 13.18 22.0098C13.2185 21.8935 13.2956 21.816 13.3341 21.6998C13.5654 21.351 13.7966 21.0023 14.0278 20.6923C16.9568 16.8561 21.3888 16.3136 21.3888 16.3136C21.9284 16.2361 22.4679 16.1586 22.9304 16.0811C23.7012 15.9261 24.4334 15.6936 25.05 15.4999C26.3604 15.0349 27.3238 14.4536 27.979 13.9886C28.2873 13.7561 28.5185 13.6011 28.6727 13.4461C28.8269 13.2911 28.981 13.1361 29.0966 12.9424C29.4435 12.3611 29.7903 11.8574 30.0986 11.4312C31.1007 13.4074 31.6788 15.6548 31.7173 18.0186Z" fill="#6138E0" />
                            <path d="M3.31414 13.291C3.31414 13.291 -4.16245 25.0709 3.31414 32.162L5.81918 23.3659L3.31414 13.291Z" fill="#B15EAA" />
                            <path d="M155.775 14.7248C155.775 14.3373 155.891 13.9498 156.083 13.6399C156.276 13.2911 156.546 13.0199 156.893 12.8261C157.239 12.6324 157.586 12.5161 157.972 12.5161C158.357 12.5161 158.742 12.6324 159.051 12.8261C159.398 13.0199 159.667 13.2911 159.86 13.6399C160.053 13.9886 160.168 14.3373 160.168 14.7248C160.168 15.1123 160.091 15.4611 159.899 15.8098C159.706 16.1586 159.436 16.4298 159.089 16.6236C158.742 16.8173 158.396 16.9336 157.972 16.9336C157.586 16.9336 157.201 16.8173 156.854 16.6236C156.507 16.4298 156.237 16.1586 156.045 15.8098C155.852 15.4611 155.775 15.1123 155.775 14.7248ZM156.045 14.7248C156.045 15.0736 156.122 15.3836 156.314 15.6936C156.469 16.0036 156.738 16.2361 157.008 16.3911C157.316 16.5461 157.625 16.6623 157.972 16.6623C158.318 16.6623 158.627 16.5848 158.935 16.3911C159.243 16.2361 159.475 15.9648 159.629 15.6936C159.783 15.3836 159.899 15.0736 159.899 14.7248C159.899 14.3761 159.822 14.0661 159.667 13.7561C159.513 13.4461 159.282 13.2136 158.974 13.0586C158.665 12.8649 158.357 12.7874 158.01 12.7874C157.663 12.7874 157.355 12.8649 157.047 13.0586C156.738 13.2136 156.507 13.4849 156.353 13.7561C156.122 14.0661 156.045 14.3761 156.045 14.7248ZM158.742 14.1823C158.742 14.3373 158.704 14.4536 158.627 14.6086C158.55 14.7248 158.434 14.8023 158.318 14.8798L159.012 16.0423H158.665L158.049 14.9961H157.548V16.0423H157.239V13.4849H157.856C158.126 13.4849 158.357 13.5624 158.511 13.6786C158.665 13.7173 158.742 13.9111 158.742 14.1823ZM157.548 14.7248H157.856C158.049 14.7248 158.164 14.6861 158.28 14.5698C158.396 14.4923 158.434 14.3373 158.434 14.1823C158.434 13.8336 158.241 13.6786 157.856 13.6786H157.548V14.7248Z" fill="#909FBA" />
                            <path d="M85.9809 13.0198L82.3968 20.8472L78.8126 13.0198H75.2285L81.3562 26.8146H83.3603L89.565 13.0198H85.9809Z" fill="#283444" />
                            <path d="M40.813 26.8146V4.92114H45.3991C47.5959 4.92114 49.3301 5.15364 50.6019 5.57988C51.9508 6.00613 53.2226 6.74237 54.3017 7.74986C56.5369 9.80358 57.6931 12.516 57.6931 15.8873C57.6931 19.2585 56.5369 21.9709 54.1861 24.0634C52.9914 25.1096 51.7581 25.8459 50.4863 26.2334C49.2916 26.6596 47.5573 26.8534 45.3606 26.8534H40.813V26.8146ZM44.0888 23.7147H45.5533C47.0178 23.7147 48.251 23.5597 49.2531 23.2497C50.2165 22.9009 51.1029 22.3972 51.9123 21.6609C53.5309 20.1884 54.3402 18.251 54.3402 15.8485C54.3402 13.446 53.5309 11.5086 51.9508 9.99733C50.5248 8.67984 48.4052 7.98235 45.5918 7.98235H44.1274V23.7147H44.0888Z" fill="#283444" />
                            <path d="M73.6868 20.6534H63.8208C63.8979 21.7771 64.2832 22.7071 64.9384 23.3659C65.5936 24.0246 66.4029 24.3734 67.4435 24.3734C68.2528 24.3734 68.8694 24.1796 69.409 23.7921C69.91 23.4046 70.488 22.7071 71.1432 21.6996L73.8409 23.2109C73.417 23.9084 72.9931 24.5284 72.5306 25.0321C72.0681 25.5358 71.5671 25.9621 71.0661 26.2721C70.5266 26.5821 69.987 26.8533 69.3704 26.9696C68.7538 27.1246 68.0986 27.2021 67.3664 27.2021C65.3238 27.2021 63.6666 26.5433 62.4334 25.2258C61.2001 23.9084 60.5835 22.1259 60.5835 19.9172C60.5835 17.7472 61.2001 15.9647 62.3948 14.6085C63.5895 13.291 65.2082 12.5935 67.2122 12.5935C69.2163 12.5935 70.8349 13.2522 72.0296 14.531C73.1858 15.8097 73.7639 17.5922 73.7639 19.8784L73.6868 20.6534ZM70.4495 18.0572C70.0256 16.3522 68.9465 15.4997 67.2508 15.4997C66.8654 15.4997 66.5185 15.5772 66.1717 15.6935C65.8248 15.8097 65.5165 15.9647 65.2467 16.1972C64.977 16.4297 64.7457 16.701 64.553 17.011C64.3603 17.3209 64.2062 17.6697 64.0906 18.0572H70.4495Z" fill="#283444" />
                            <path d="M100.857 13.02H104.056V26.8535H100.857V25.4198C99.5466 26.6598 98.1591 27.2798 96.6176 27.2798C94.7292 27.2798 93.1491 26.5823 91.9158 25.226C90.6825 23.8311 90.0659 22.0486 90.0659 19.9561C90.0659 17.9024 90.6825 16.1587 91.9158 14.7637C93.1491 13.3687 94.6906 12.71 96.5405 12.71C98.1591 12.71 99.5851 13.3687 100.857 14.6862V13.02ZM93.3032 19.8786C93.3032 21.1961 93.6501 22.2811 94.3438 23.1336C95.076 23.9861 95.9624 24.4123 97.08 24.4123C98.2748 24.4123 99.1997 24.0248 99.9319 23.2111C100.664 22.3586 101.011 21.3123 101.011 19.9949C101.011 18.7161 100.664 17.6311 99.9319 16.7787C99.1997 15.9649 98.2748 15.5387 97.1186 15.5387C96.0395 15.5387 95.1145 15.9649 94.3823 16.7787C93.6501 17.5924 93.3032 18.6386 93.3032 19.8786Z" fill="#283444" />
                            <path d="M108.025 13.0198H111.224V14.2986C112.342 13.1748 113.575 12.6323 114.962 12.6323C116.581 12.6323 117.814 13.1361 118.701 14.1436C119.471 14.996 119.857 16.391 119.857 18.3673V26.8534H116.658V19.1035C116.658 17.7473 116.465 16.8173 116.08 16.2748C115.695 15.7323 115.039 15.461 114.076 15.461C113.035 15.461 112.265 15.8098 111.841 16.5073C111.417 17.2048 111.186 18.406 111.186 20.111V26.7759H107.987V13.0198H108.025Z" fill="#283444" />
                            <path d="M128.451 23.8309H136.621V26.8533H122.169L131.071 16.0035H124.057V13.0198H137.353L128.451 23.8309Z" fill="#283444" />
                            <path d="M149.725 13.02H152.923V26.8535H149.725V25.4198C148.414 26.6598 147.027 27.2798 145.485 27.2798C143.597 27.2798 142.017 26.5823 140.783 25.226C139.55 23.8311 138.934 22.0486 138.934 19.9561C138.934 17.9024 139.55 16.1587 140.783 14.7637C142.017 13.3687 143.558 12.71 145.408 12.71C147.027 12.71 148.453 13.3687 149.725 14.6862V13.02ZM142.209 19.8786C142.209 21.1961 142.556 22.2811 143.25 23.1336C143.982 23.9861 144.869 24.4123 145.986 24.4123C147.181 24.4123 148.106 24.0248 148.838 23.2111C149.57 22.3586 149.917 21.3123 149.917 19.9949C149.917 18.7161 149.57 17.6311 148.838 16.7787C148.106 15.9649 147.181 15.5387 146.025 15.5387C144.946 15.5387 144.021 15.9649 143.289 16.7787C142.556 17.5924 142.209 18.6386 142.209 19.8786Z" fill="#283444" />
                        </g>
                    </svg>
                </div>
            </div>

            <div className={styles.wizardContent}>
                <div className={styles.formContainer}>
                    <div className={styles.progressWrappar}>
                        <ProgressBar progress={(step / 4) * 100} label={`Step ${step} out of 4`} />
                    </div>

                    {errors.length > 0 && (
                        <div className={styles.errors}>
                            {errors.map((error, index) => (
                                <div key={index} className={styles.error}>{error}</div>
                            ))}
                        </div>
                    )}

                    <div className={styles.StepContainer}>
                        {step === 1 && (
                            <Step1
                                formData={formData}
                                setFormData={setFormData}
                            />
                        )}
                        {step === 2 && (
                            <Step2
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                selectedServiceType={selectedServiceType}
                                setSelectedServiceType={setSelectedServiceType}
                                categories={categories}
                                isLoading={isLoadingCategories}
                            />
                        )}
                        {step === 3 && (
                            <Step3
                                alwaysOpen={alwaysOpen}
                                setAlwaysOpen={setAlwaysOpen}
                                weekDays={weekDays}
                                setWeekDays={setWeekDays}
                                businessHours={businessHours}
                                setBusinessHours={setBusinessHours}
                            />
                        )}
                        {step === 4 && (
                            <Step4
                                locationData={locationData}
                                setLocationData={setLocationData}
                            />
                        )}
                    </div>
                </div>

                <div className={`${styles.hintMapContainer} ${styles['map' + step]}`}>
                    {step === 4 ? (
                        <MapContainer
                            center={[markerPosition.lat, markerPosition.lng]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker />
                        </MapContainer>
                    ) : (
                        <Hint
                            name='Hint name'
                            description='Flavor text Flavor text Flavor text '
                        />
                    )}
                </div>
            </div>

            <div className={styles.wizardFooter}>
                <div className="container">
                    <Button
                        onClick={prevStep}
                        label='Back'
                        size='medium'
                        noAppearance={true}
                        disabled={step === 1}
                        variant={step === 1 ? 'disabled' : 'primary'}
                    />
                    <Button
                        onClick={nextStep}
                        label={step === 4 ? (isEditMode ? 'Update' : 'Create') : 'Next'}
                        size='medium'
                        disabled={isCreating || isUpdatingBusiness}
                    />
                </div>
            </div>
        </div>
    );
};

export default Wizard;