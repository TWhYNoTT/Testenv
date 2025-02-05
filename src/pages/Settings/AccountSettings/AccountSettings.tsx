import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useBusiness } from '../../../hooks/useBusiness';
import InputField from '../../../components/InputField/InputField';
import TextArea from '../../../components/TextArea/TextArea';
import Toggle from '../../../components/Toggle/Toggle';
import Checkbox from '../../../components/Checkbox/Checkbox';
import Dropdown from '../../../components/Dropdown/Dropdown';

import 'leaflet/dist/leaflet.css';
import styles from './AccountSettings.module.css';

const AccountSettings: React.FC = () => {
    const navigate = useNavigate();
    const { checkBusinessExists } = useBusiness();
    const [isLoading, setIsLoading] = useState(false);

    // Add handleClick function
    const handleClick = () => {
        navigate('/settings');
    };

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

    useEffect(() => {
        const loadBusinessData = async () => {
            setIsLoading(true);
            try {
                const business = await checkBusinessExists();
                if (business) {
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

                    // Fix business hours parsing
                    const formattedHours: { [key: string]: { from: string, to: string } } = {};
                    business.businessHours.forEach(hour => {
                        // Convert string to number if needed
                        const dayIndex = typeof hour.dayOfWeek === 'string' ? parseInt(hour.dayOfWeek, 10) : hour.dayOfWeek;
                        const day = getDayName(dayIndex);
                        formattedHours[day] = {
                            from: hour.is24Hours ? '24 hours' : hour.openTime || 'Closed',
                            to: hour.is24Hours ? '24 hours' : hour.closeTime || 'Closed'
                        };
                    });
                    setBusinessHours(formattedHours);

                    // Fix weekdays parsing
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
        };

        loadBusinessData();
    }, []);

    const getDayName = (dayNumber: number): string => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayNumber] || days[0]; // Return Sunday as fallback if invalid index
    };

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

    const dayHoursList = [
        '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
    ];

    const handleInputChange = (name: string, value: string) => {
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };
    const toggleAlwaysOpen = () => {
        setFormData(prevData => ({ ...prevData, 'alwaysOpen': !formData.alwaysOpen }));
    };

    const handleLocationChange = (name: string, value: string | number | boolean) => {
        setFormData(prevData => ({
            ...prevData,
            location: { ...prevData.location, [name]: value }
        }));
    };

    const handleWeekDayChange = (day: string) => {
        setWeekDays(prevState => {
            if (prevState.includes(day)) {
                const newState = prevState.filter(d => d !== day);
                const { [day]: removed, ...rest } = businessHours;
                setBusinessHours(rest);
                return newState;
            } else {
                return [...prevState, day];
            }
        });
    };

    const handleBusinessHourChange = (day: string, time: 'from' | 'to', value: string | string[]) => {
        setBusinessHours(prevState => ({
            ...prevState,
            [day]: {
                ...prevState[day],
                [time]: value,
            },
        }));
    };

    const weekDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className={styles.accountSettings}>
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}>
                        <svg viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                        </svg>
                        <span>Loading data...</span>
                    </div>
                </div>
            )}
            <div className={styles.headerBckBTN}>

                <svg onClick={handleClick} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backButton}>
                    <rect width="38" height="38" rx="14" fill="#DBD1F9" />
                    <path d="M23 12L16 19L23 26" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h1 className='xH1'>Account settings</h1>
            </div>
            <div></div>
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
                    <InputField
                        label="Salon"
                        value={formData.category}
                        onChange={(value) => handleInputChange('category', value)}
                    />

                </div>
            </div>

            <div className={styles.passwordSection}>
                <h2 className={styles.h2}>Password</h2>
                <InputField
                    type="password"
                    value="••••••••"
                />
            </div>

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
                        <Marker position={[formData.location.latitude, formData.location.longitude]} />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;