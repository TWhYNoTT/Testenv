import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useBusiness } from '../../../hooks/useBusiness';
import Button from '../../../components/Button/Button';
import InputField from '../../../components/InputField/InputField';
import TextArea from '../../../components/TextArea/TextArea';
import Toggle from '../../../components/Toggle/Toggle';
import Checkbox from '../../../components/Checkbox/Checkbox';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { useToast } from '../../../contexts/ToastContext';

import 'leaflet/dist/leaflet.css';
import styles from './AccountSettings.module.css';

const AccountSettings: React.FC = () => {
    const navigate = useNavigate();
    const { checkBusinessExists, updateBusiness } = useBusiness();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Persist identifiers and non-edit fields
    const [businessId, setBusinessId] = useState<number | null>(null);
    const [categoryIds, setCategoryIds] = useState<number[]>([]);
    const [serviceType, setServiceType] = useState<number>(1);
    const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState<string>('');

    const handleClick = useCallback(() => {
        navigate('/settings');
    }, [navigate]);

    const [formData, setFormData] = useState({
        businessName: '',
        about: '',
        category: '',
        alwaysOpen: false,
        location: {
            country: '',
            state: '',
            streetAddress: '',
            city: '',
            zipCode: '',
            homeServicesAvailable: false,
            latitude: 25.276987,
            longitude: 55.296249
        }
    });

    const [weekDays, setWeekDays] = useState<string[]>(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']);
    const [businessHours, setBusinessHours] = useState<{ [key: string]: { from: string, to: string } }>({
        Sunday: { from: '24 hours', to: '24 hours' },
        Monday: { from: '9:00 AM', to: '10:00PM' },
        Tuesday: { from: '9:00 AM', to: '10:00PM' },
        Wednesday: { from: '9:00 AM', to: '10:00PM' },
        Thursday: { from: '9:00 AM', to: '10:00PM' },
        Friday: { from: 'Closed', to: 'Closed' },
        Saturday: { from: 'Closed', to: 'Closed' }
    });

    const getDayName = useCallback((dayNumber: number): string => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayNumber] || days[0];
    }, []);

    const loadBusinessData = useCallback(async () => {
        setIsLoading(true);
        try {
            const business = await checkBusinessExists();
            if (business) {
                // Persist IDs and metadata
                setBusinessId(business.id);
                setCategoryIds(business.categories?.map(c => c.categoryId) || []);
                // serviceType may come as string; try parse number, fallback to 1
                const parsedServiceType = typeof business.serviceType === 'string' ? parseInt(business.serviceType as any, 10) : (business.serviceType as any);
                setServiceType(Number.isFinite(parsedServiceType) ? parsedServiceType : 1);
                setBusinessRegistrationNumber(business.businessRegistrationNumber || '');

                setFormData({
                    businessName: business.name,
                    about: business.about,
                    category: business.categories[0]?.name || '',
                    alwaysOpen: business.isAlwaysOpen,
                    location: {
                        country: business.location.country,
                        state: business.location.state,
                        streetAddress: business.location.streetAddress,
                        city: business.location.city,
                        zipCode: business.location.zipCode,
                        homeServicesAvailable: business.location.hasHomeService,
                        latitude: business.location.latitude,
                        longitude: business.location.longitude
                    }
                });

                const formattedHours: { [key: string]: { from: string, to: string } } = {};
                business.businessHours.forEach(hour => {
                    const dayIndex = typeof hour.dayOfWeek === 'string' ? parseInt(hour.dayOfWeek, 10) : hour.dayOfWeek;
                    const day = getDayName(dayIndex);
                    formattedHours[day] = {
                        from: hour.is24Hours ? '24 hours' : hour.openTime || 'Closed',
                        to: hour.is24Hours ? '24 hours' : hour.closeTime || 'Closed'
                    };
                });
                setBusinessHours(formattedHours);

                setWeekDays(business.businessHours
                    .filter(hour => hour.isOpen)
                    .map(hour => {
                        const dayIndex = typeof hour.dayOfWeek === 'string' ? parseInt(hour.dayOfWeek, 10) : hour.dayOfWeek;
                        return getDayName(dayIndex);
                    })
                );
            }
        } catch (error) {
            console.error('Error loading business data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [checkBusinessExists, getDayName]);

    useEffect(() => {
        loadBusinessData();
    }, [loadBusinessData]);

    const dayHoursList = [
        '24 hours',
        '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
        '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
        '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
    ];

    const handleInputChange = useCallback((name: string, value: string) => {
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }, []);

    const toggleAlwaysOpen = useCallback(() => {
        setFormData(prevData => ({ ...prevData, alwaysOpen: !prevData.alwaysOpen }));
    }, []);

    const handleLocationChange = useCallback((name: string, value: string | number | boolean) => {
        setFormData(prevData => ({
            ...prevData,
            location: { ...prevData.location, [name]: value }
        }));
    }, []);

    const handleWeekDayChange = useCallback((day: string) => {
        setWeekDays(prevState => {
            if (prevState.includes(day)) {
                const newState = prevState.filter(d => d !== day);
                setBusinessHours(prev => {
                    const { [day]: removed, ...rest } = prev;
                    return rest;
                });
                return newState;
            }
            // When enabling a day, default its hours to 24 hours
            setBusinessHours(prev => ({
                ...prev,
                [day]: { from: '24 hours', to: '24 hours' }
            }));
            return [...prevState, day];
        });
    }, []);

    const handleBusinessHourChange = useCallback((day: string, time: 'from' | 'to', value: string | string[]) => {
        setBusinessHours(prevState => ({
            ...prevState,
            [day]: {
                ...prevState[day],
                [time]: value,
            },
        }));
    }, []);

    const weekDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Helpers
    const to24Hour = (time?: string): string | undefined => {
        if (!time) return undefined;
        const t = time.trim();
        if (t.toLowerCase() === '24 hours' || t.toLowerCase() === 'closed') return undefined;
        // Expect format like '9:00 AM' or '10:00 PM'
        const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return undefined;
        const hh = match[1];
        const mm = match[2];
        const mer = match[3];
        let h = parseInt(hh, 10);
        const isPM = mer.toUpperCase() === 'PM';
        if (h === 12) h = isPM ? 12 : 0; else if (isPM) h += 12;
        const hh24 = h.toString().padStart(2, '0');
        return `${hh24}:${mm}`;
    };

    const toMinutes = (time?: string): number | undefined => {
        const t24 = to24Hour(time);
        if (!t24) return undefined;
        const [hh, mm] = t24.split(':').map(Number);
        if (Number.isNaN(hh) || Number.isNaN(mm)) return undefined;
        return hh * 60 + mm;
    };

    const handleSave = async () => {
        if (!businessId) {
            showToast('No business found to update.', 'error');
            return;
        }
        // Validations
        if (!formData.businessName || formData.businessName.trim().length === 0) {
            showToast('Business name cannot be empty.', 'warning');
            return;
        }
        const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        for (const dayName of allDays) {
            const isOpen = weekDays.includes(dayName);
            if (!isOpen) continue;
            const entry = businessHours[dayName] || { from: '', to: '' };
            const is24 = formData.alwaysOpen || entry.from === '24 hours' || entry.to === '24 hours';
            if (is24) continue;
            const startMin = toMinutes(entry.from);
            const endMin = toMinutes(entry.to);
            if (startMin == null || endMin == null) {
                showToast(`Please select valid opening hours for ${dayName}.`, 'warning');
                return;
            }
            if (endMin <= startMin) {
                showToast(`Closing time must be after opening time for ${dayName}.`, 'warning');
                return;
            }
        }
        setIsSaving(true);
        try {
            // Build BusinessHours array for all 7 days
            const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const hours = allDays.map((dayName, idx) => {
                const isOpen = weekDays.includes(dayName);
                const entry = businessHours[dayName] || { from: '', to: '' };
                const is24 = formData.alwaysOpen || entry.from === '24 hours' || entry.to === '24 hours';
                return {
                    dayOfWeek: idx,
                    isOpen,
                    openTime: isOpen && !is24 ? to24Hour(entry.from) : undefined,
                    closeTime: isOpen && !is24 ? to24Hour(entry.to) : undefined,
                    is24Hours: isOpen && is24
                };
            });

            const payload = {
                name: formData.businessName,
                about: formData.about,
                businessRegistrationNumber,
                isAlwaysOpen: formData.alwaysOpen,
                serviceType: serviceType,
                location: {
                    country: formData.location.country,
                    city: formData.location.city,
                    state: formData.location.state,
                    streetAddress: formData.location.streetAddress,
                    zipCode: formData.location.zipCode,
                    hasHomeService: formData.location.homeServicesAvailable,
                    latitude: formData.location.latitude,
                    longitude: formData.location.longitude
                },
                businessHours: hours,
                categoryIds: categoryIds
            };

            await updateBusiness(businessId, payload as any);
            showToast('Business settings updated successfully.', 'success');
            // Optionally reload to reflect any canonical formatting from server
            await loadBusinessData();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to update business settings';
            showToast(msg, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.accountSettings} aria-busy={isLoading || isSaving}>
            {(isLoading || isSaving) && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}>
                        <svg viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                        </svg>
                        <span>{isSaving ? 'Saving changes...' : 'Loading data...'}</span>
                    </div>
                </div>
            )}
            <div className={styles.headerBckBTN}>
                <svg onClick={handleClick} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backButton}>
                    <rect width="38" height="38" rx="14" fill="#DBD1F9" />
                    <path d="M23 12L16 19L23 26" stroke="#6138E0" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h1 className='xH1'>Account settings</h1>
                <div style={{ marginLeft: 'auto' }}>
                    <Button
                        label={isSaving ? 'Saving...' : 'Save changes'}
                        variant="primary"
                        disabled={isSaving || isLoading || !businessId}
                        onClick={handleSave}
                    />
                </div>
            </div>

            {/* Profile Section */}
            <div className={styles.profileSection}>
                <img src="/assets/images/account-setting/coverphoto.png" alt="Cover" className={styles.coverImage} />
                <img src="/assets/images/account-setting/pf.png" alt="Logo" className={styles.logo} />
                <div className={styles.businessInfo}>
                    <InputField
                        label="Business name"
                        value={formData.businessName}
                        onChange={(value) => handleInputChange('businessName', value)}
                    />
                    <TextArea
                        label="About"
                        value={formData.about}
                        onChange={(value) => handleInputChange('about', value)}
                    />

                </div>
            </div>



            {/* Business Hours Section */}
            <div className={styles.businessHoursSection}>
                <h2 className={styles.h2}>Business hours</h2>
                <Toggle
                    label="Always open"
                    checked={formData.alwaysOpen}
                    onChange={toggleAlwaysOpen}
                />
                {weekDaysList.map(day => (
                    <div key={day} className={styles.weekDayRow}>
                        <Checkbox
                            label={day}
                            checked={weekDays.includes(day)}
                            onChange={() => handleWeekDayChange(day)}
                        />
                        <div className={styles.dropdownContainer}>
                            <div className={styles.dropdown}>
                                <Dropdown
                                    options={dayHoursList}
                                    value={businessHours[day]?.from || ''}
                                    onChange={(value) => handleBusinessHourChange(day, 'from', value)}
                                    variant={weekDays.includes(day) ? 'primary' : 'secondary'}
                                    disabled={!weekDays.includes(day)}
                                    defaultMessage='24 hours'
                                />
                            </div>
                            <div className={styles.dropdown}>
                                <Dropdown
                                    options={dayHoursList}
                                    value={businessHours[day]?.to || ''}
                                    onChange={(value) => handleBusinessHourChange(day, 'to', value)}
                                    variant={weekDays.includes(day) ? 'primary' : 'secondary'}
                                    disabled={!weekDays.includes(day)}
                                    defaultMessage='24 hours'
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Location Section */}
            <div className={styles.locationSection}>
                <div className={styles.fieldsContainer}>
                    <h2 className={styles.h2}>Location</h2>
                    <InputField
                        label="Country"
                        value={formData.location.country}
                        onChange={(value) => handleLocationChange('country', value)}
                    />
                    <InputField
                        label="State"
                        value={formData.location.state}
                        onChange={(value) => handleLocationChange('state', value)}
                    />
                    <InputField
                        label="Street address"
                        value={formData.location.streetAddress}
                        onChange={(value) => handleLocationChange('streetAddress', value)}
                    />
                    <div className={styles.cityZipRow}>
                        <InputField
                            label="City"
                            value={formData.location.city}
                            onChange={(value) => handleLocationChange('city', value)}
                        />
                        <InputField
                            label="Zip code"
                            value={formData.location.zipCode}
                            onChange={(value) => handleLocationChange('zipCode', value)}
                        />
                    </div>
                    <Toggle
                        label="Home service available"
                        checked={formData.location.homeServicesAvailable}
                        onChange={(value) => handleLocationChange('homeServicesAvailable', value)}
                    />
                </div>
                <div className={styles.mapContainer}>
                    <MapContainer
                        center={[formData.location.latitude, formData.location.longitude]}
                        zoom={13}
                        style={{ height: '400px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                            position={[formData.location.latitude, formData.location.longitude]}
                            draggable
                            eventHandlers={{
                                dragend: (e: any) => {
                                    const { lat, lng } = e.target.getLatLng();
                                    handleLocationChange('latitude', lat);
                                    handleLocationChange('longitude', lng);
                                }
                            }}
                        />
                        {(() => {
                            const MapClickHandler: React.FC = () => {
                                useMapEvents({
                                    click: (ev) => {
                                        handleLocationChange('latitude', ev.latlng.lat);
                                        handleLocationChange('longitude', ev.latlng.lng);
                                    }
                                });
                                return null;
                            };
                            return <MapClickHandler />;
                        })()}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;