import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import TextArea from '../TextArea/TextArea';
import Toggle from '../Toggle/Toggle';
import Checkbox from '../Checkbox/Checkbox';
import styles from './BranchAddEditModal.module.css';
import useNavigationPrompt from '../../hooks/useNavigationPrompt';

// Fix for default marker icon in Leaflet with webpack
// Using CDN URLs to avoid bundler issues with static image assets
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface BranchFormData {
    Branch: string;
    StreetAddress: string;
    City: string;
    State: string;
    Country: string;
    PhoneNumber: string;
    Latitude?: number;
    Longitude?: number;
    Status: boolean;
    Headquarters: boolean;
    Description: string;
}

interface BranchAddEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: BranchFormData;
    onSave: (branch: BranchFormData) => void;
    isAdd?: boolean;
    onDeleteClicked: () => void;
    loading?: boolean;
    onDirtyChange?: (dirty: boolean) => void;
}

// Component to handle map clicks and update marker position
interface LocationMarkerProps {
    position: [number, number];
    onPositionChange: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, onPositionChange }) => {
    const map = useMapEvents({
        click(e) {
            onPositionChange(e.latlng.lat, e.latlng.lng);
        },
    });

    return position ? <Marker position={position} /> : null;
};

// Component to recenter map when position changes
interface MapCenterProps {
    position: [number, number];
}

const MapCenter: React.FC<MapCenterProps> = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom());
        }
    }, [position, map]);

    return null;
};

const BranchAddEditModal: React.FC<BranchAddEditModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave,
    onDeleteClicked,
    isAdd,
    loading = false,
    onDirtyChange
}) => {
    const defaultPosition: [number, number] = [25.2048, 55.2708]; // Dubai as default

    const [data, setData] = useState<BranchFormData>(initialData || {
        Branch: '',
        StreetAddress: '',
        City: '',
        State: '',
        Country: '',
        PhoneNumber: '',
        Status: true,
        Headquarters: false,
        Description: ''
    });

    const [errors, setErrors] = useState<{
        Branch?: string;
        StreetAddress?: string;
        City?: string;
        State?: string;
        Country?: string;
        PhoneNumber?: string;
    }>({});
    const [dirty, setDirty] = useState<boolean>(false);
    const [markerPosition, setMarkerPosition] = useState<[number, number]>(
        data.Latitude && data.Longitude
            ? [data.Latitude, data.Longitude]
            : defaultPosition
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Handle marker position change
    const handlePositionChange = useCallback(async (lat: number, lng: number) => {
        setMarkerPosition([lat, lng]);
        setData(prev => ({
            ...prev,
            Latitude: lat,
            Longitude: lng,
        }));
        setDirty(true);
        if (onDirtyChange) onDirtyChange(true);

        // Reverse geocode to get address using Nominatim
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const result = await response.json();

            if (result && result.address) {
                const addr = result.address;
                const streetAddress = [addr.house_number, addr.road].filter(Boolean).join(' ');

                setData(prev => ({
                    ...prev,
                    StreetAddress: streetAddress || prev.StreetAddress,
                    City: addr.city || addr.town || addr.village || prev.City,
                    State: addr.state || prev.State,
                    Country: addr.country || prev.Country,
                }));

                // Clear relevant errors
                setErrors(prev => ({
                    ...prev,
                    StreetAddress: undefined,
                    City: undefined,
                    State: undefined,
                    Country: undefined,
                }));
            }
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
        }
    }, [onDirtyChange]);

    // Handle address search
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=1`
            );
            const results = await response.json();

            if (results && results.length > 0) {
                const result = results[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);

                setMarkerPosition([lat, lng]);

                const addr = result.address;
                const streetAddress = [addr?.house_number, addr?.road].filter(Boolean).join(' ');

                setData(prev => ({
                    ...prev,
                    Latitude: lat,
                    Longitude: lng,
                    StreetAddress: streetAddress || prev.StreetAddress,
                    City: addr?.city || addr?.town || addr?.village || prev.City,
                    State: addr?.state || prev.State,
                    Country: addr?.country || prev.Country,
                }));

                setDirty(true);
                if (onDirtyChange) onDirtyChange(true);

                // Clear relevant errors
                setErrors(prev => ({
                    ...prev,
                    StreetAddress: undefined,
                    City: undefined,
                    State: undefined,
                    Country: undefined,
                }));
            }
        } catch (error) {
            console.error('Address search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Initialize form only when modal opens
    useEffect(() => {
        if (!isOpen) return;
        const initData = initialData || {
            Branch: '',
            StreetAddress: '',
            City: '',
            State: '',
            Country: '',
            PhoneNumber: '',
            Status: true,
            Headquarters: false,
            Description: ''
        };
        setData(initData);
        setMarkerPosition(
            initData.Latitude && initData.Longitude
                ? [initData.Latitude, initData.Longitude]
                : defaultPosition
        );
        setDirty(false);
        setErrors({});
        setSearchQuery('');
        if (onDirtyChange) onDirtyChange(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Validation helpers
    const validateBranch = (val: string): string | undefined => {
        const cleaned = val.trim();
        if (cleaned.length < 3) return 'Branch Name must be at least 3 characters and up to 100 alphanumeric characters.';
        if (cleaned.length > 100) return 'Branch Name must be at least 3 characters and up to 100 alphanumeric characters.';
        if (!/^[A-Za-z0-9 ]+$/.test(cleaned)) return 'Branch Name must be at least 3 characters and up to 100 alphanumeric characters.';
        return undefined;
    };

    const validateStreetAddress = (val: string): string | undefined => {
        const cleaned = val.trim();
        if (cleaned.length < 5) return 'Street address must be at least 5 characters.';
        if (cleaned.length > 200) return 'Street address cannot exceed 200 characters.';
        if (!/^[A-Za-z0-9 \-#.,/'"]+$/.test(cleaned)) return 'Invalid entry. Please check your input.';
        return undefined;
    };

    const validateCity = (val: string): string | undefined => {
        const cleaned = val.trim();
        if (cleaned.length < 2) return 'City is required';
        if (cleaned.length > 100) return 'City cannot exceed 100 characters.';
        if (!/^[A-Za-z \-']+$/.test(cleaned)) return 'Invalid entry. Please check your input.';
        return undefined;
    };

    const validateState = (val: string): string | undefined => {
        const cleaned = val.trim();
        if (cleaned.length < 2) return 'State is required';
        if (cleaned.length > 100) return 'State cannot exceed 100 characters.';
        if (!/^[A-Za-z \-']+$/.test(cleaned)) return 'Invalid entry. Please check your input.';
        return undefined;
    };

    const validateCountry = (val: string): string | undefined => {
        const cleaned = val.trim();
        if (cleaned.length < 2) return 'Country is required';
        if (cleaned.length > 100) return 'Country cannot exceed 100 characters.';
        if (!/^[A-Za-z \-']+$/.test(cleaned)) return 'Invalid entry. Please check your input.';
        return undefined;
    };

    const validatePhoneNumber = (val: string): string | undefined => {
        const cleaned = val.trim();
        if (cleaned.length === 0) return 'Branch phone number is required.';
        if (cleaned.length > 15) return 'Phone number cannot exceed 15 digits.';
        if (!/^\+?[0-9]{7,15}$/.test(cleaned)) return 'Invalid phone number. Please enter a valid number.';
        return undefined;
    };

    const handleInputChange = (field: keyof BranchFormData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
        setDirty(true);
        if (onDirtyChange) onDirtyChange(true);
    };

    const handleBranchChange = (value: string) => {
        const sanitized = value.replace(/[^A-Za-z0-9 ]/g, '');
        handleInputChange('Branch', sanitized);
        setErrors(prev => ({ ...prev, Branch: validateBranch(sanitized) }));
    };

    const handleStreetAddressChange = (value: string) => {
        const sanitized = value.replace(/[^A-Za-z0-9 \-#.,/'"]/g, '');
        handleInputChange('StreetAddress', sanitized);
        setErrors(prev => ({ ...prev, StreetAddress: validateStreetAddress(sanitized) }));
    };

    const handleCityChange = (value: string) => {
        const sanitized = value.replace(/[^A-Za-z \-']/g, '');
        handleInputChange('City', sanitized);
        setErrors(prev => ({ ...prev, City: validateCity(sanitized) }));
    };

    const handleStateChange = (value: string) => {
        const sanitized = value.replace(/[^A-Za-z \-']/g, '');
        handleInputChange('State', sanitized);
        setErrors(prev => ({ ...prev, State: validateState(sanitized) }));
    };

    const handleCountryChange = (value: string) => {
        const sanitized = value.replace(/[^A-Za-z \-']/g, '');
        handleInputChange('Country', sanitized);
        setErrors(prev => ({ ...prev, Country: validateCountry(sanitized) }));
    };

    const handlePhoneNumberChange = (value: string) => {
        const sanitized = value.replace(/[^0-9+]/g, '');
        handleInputChange('PhoneNumber', sanitized);
        setErrors(prev => ({ ...prev, PhoneNumber: validatePhoneNumber(sanitized) }));
    };

    const handleTextareaChange = (value: string) => {
        setData(prev => ({ ...prev, Description: value }));
        setDirty(true);
        if (onDirtyChange) onDirtyChange(true);
    };

    const handleToggleChange = (checked: boolean) => {
        setData(prev => ({ ...prev, Status: checked }));
        setDirty(true);
        if (onDirtyChange) onDirtyChange(true);
    };

    const handleCheckboxChangeYes = (checked: boolean) => {
        if (!data.Headquarters) {
            setData(prev => ({ ...prev, Headquarters: checked }));
            setDirty(true);
            if (onDirtyChange) onDirtyChange(true);
        }
    };

    const handleCheckboxChangeNo = (checked: boolean) => {
        if (data.Headquarters) {
            setData(prev => ({ ...prev, Headquarters: !checked }));
            setDirty(true);
            if (onDirtyChange) onDirtyChange(true);
        }
    };

    const isFormValid = useMemo(() => {
        const branchErr = validateBranch(data.Branch || '');
        const streetErr = validateStreetAddress(data.StreetAddress || '');
        const cityErr = validateCity(data.City || '');
        const stateErr = validateState(data.State || '');
        const countryErr = validateCountry(data.Country || '');
        const phoneErr = validatePhoneNumber(data.PhoneNumber || '');
        return !branchErr && !streetErr && !cityErr && !stateErr && !countryErr && !phoneErr;
    }, [data.Branch, data.StreetAddress, data.City, data.State, data.Country, data.PhoneNumber]);

    const handleSave = () => {
        const branchErr = validateBranch(data.Branch || '');
        const streetErr = validateStreetAddress(data.StreetAddress || '');
        const cityErr = validateCity(data.City || '');
        const stateErr = validateState(data.State || '');
        const countryErr = validateCountry(data.Country || '');
        const phoneErr = validatePhoneNumber(data.PhoneNumber || '');

        setErrors({
            Branch: branchErr,
            StreetAddress: streetErr,
            City: cityErr,
            State: stateErr,
            Country: countryErr,
            PhoneNumber: phoneErr,
        });

        if (branchErr || streetErr || cityErr || stateErr || countryErr || phoneErr) return;

        onSave(data);
        setDirty(false);
        if (onDirtyChange) onDirtyChange(false);
    };

    const handleDelete = () => {
        onDeleteClicked();
    };

    const handleClose = () => {
        if (dirty) {
            const confirmClose = window.confirm('You have unsaved changes. Do you want to discard them?');
            if (!confirmClose) return;
        }
        onClose();
    };

    // Prompt on browser/tab close when unsaved changes exist
    useEffect(() => {
        const beforeUnload = (e: BeforeUnloadEvent) => {
            if (!dirty) return;
            e.preventDefault();
            e.returnValue = '';
        };
        if (isOpen && dirty) {
            window.addEventListener('beforeunload', beforeUnload);
        }
        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        };
    }, [isOpen, dirty]);

    // In-app navigation prompt when modal has unsaved changes
    useNavigationPrompt(isOpen && dirty, 'You have unsaved changes. Do you want to discard them?');

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={`${styles.modalBackground} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContainer} ${isOpen ? styles.open : ''}`}>
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.loadingContent}>
                            <div className={styles.spinner}></div>
                            <span>Saving branch...</span>
                        </div>
                    </div>
                )}

                <div className={styles.headerCloseInputsContainer}>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        disabled={loading}
                    >
                        &times;
                    </button>
                    <h2 className={`${styles.header} headerText`}>
                        {isAdd ? 'Add Branch' : 'Edit Branch'}
                    </h2>

                    {/* Branch Name */}
                    <InputField
                        label="Branch Name"
                        name="Branch"
                        value={data.Branch}
                        onChange={handleBranchChange}
                        placeholder="Branch Name"
                        disabled={loading}
                        feedback={errors.Branch ? 'error' : undefined}
                        feedbackMessage={errors.Branch}
                        required
                    />

                    {/* Map Section */}
                    <div className={styles.mapSection}>
                        <label className={styles.sectionLabel}>Location</label>
                        <p className={styles.mapHint}>
                            Search for an address or click on the map to set the branch location.
                        </p>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                className={styles.mapSearchInput}
                                placeholder="Search for an address..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading || isSearching}
                            />
                            <button
                                className={styles.searchButton}
                                onClick={handleSearch}
                                disabled={loading || isSearching || !searchQuery.trim()}
                            >
                                {isSearching ? (
                                    <div className={styles.searchSpinner}></div>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className={styles.mapContainer}>
                            <MapContainer
                                center={markerPosition}
                                zoom={15}
                                style={{ height: '100%', width: '100%' }}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker
                                    position={markerPosition}
                                    onPositionChange={handlePositionChange}
                                />
                                <MapCenter position={markerPosition} />
                            </MapContainer>
                        </div>
                    </div>

                    {/* Address Fields */}
                    <div className={styles.addressSection}>
                        <label className={styles.sectionLabel}>Address Details</label>

                        <InputField
                            label="Street Address"
                            name="StreetAddress"
                            value={data.StreetAddress}
                            onChange={handleStreetAddressChange}
                            placeholder="123 Main Street"
                            disabled={loading}
                            feedback={errors.StreetAddress ? 'error' : undefined}
                            feedbackMessage={errors.StreetAddress}
                            required
                        />

                        <div className={styles.addressRow}>
                            <InputField
                                label="City"
                                name="City"
                                value={data.City}
                                onChange={handleCityChange}
                                placeholder="City"
                                disabled={loading}
                                feedback={errors.City ? 'error' : undefined}
                                feedbackMessage={errors.City}
                                required
                            />
                            <InputField
                                label="State"
                                name="State"
                                value={data.State}
                                onChange={handleStateChange}
                                placeholder="State"
                                disabled={loading}
                                feedback={errors.State ? 'error' : undefined}
                                feedbackMessage={errors.State}
                                required
                            />
                        </div>

                        <InputField
                            label="Country"
                            name="Country"
                            value={data.Country}
                            onChange={handleCountryChange}
                            placeholder="Country"
                            disabled={loading}
                            feedback={errors.Country ? 'error' : undefined}
                            feedbackMessage={errors.Country}
                            required
                        />
                    </div>

                    {/* Phone Number - Internal Use */}
                    <div className={styles.phoneSection}>
                        <InputField
                            label="Branch Phone Number"
                            name="PhoneNumber"
                            type="tel"
                            value={data.PhoneNumber}
                            onChange={handlePhoneNumberChange}
                            placeholder="+1234567890"
                            disabled={loading}
                            feedback={errors.PhoneNumber ? 'error' : undefined}
                            feedbackMessage={errors.PhoneNumber}
                            required
                            maxLength={15}
                        />
                        <p className={styles.phoneHint}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="12" cy="8" r="1" fill="currentColor" />
                            </svg>
                            This phone number is for internal use only and will not be displayed to customers.
                        </p>
                    </div>

                    {/* Status Toggle */}
                    <div className={styles.toggleContainer}>
                        <Toggle
                            messageIfChecked='Active'
                            messageIfNotChecked='Inactive'
                            checked={data.Status}
                            onChange={handleToggleChange}
                            disabled={loading}
                        />
                    </div>

                    {/* Headquarters Checkbox */}
                    <div className={styles.checkboxMainContainer}>
                        <label>This is your primary Headquarters?</label>
                        <div className={styles.checkboxContainer}>
                            <Checkbox
                                variant='button'
                                label='Yes'
                                checked={data.Headquarters}
                                onChange={handleCheckboxChangeYes}
                                disabled={loading}
                            />
                            <Checkbox
                                variant='button'
                                label='No'
                                checked={!data.Headquarters}
                                onChange={handleCheckboxChangeNo}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <TextArea
                        label="Description"
                        name="Description"
                        value={data.Description}
                        onChange={handleTextareaChange}
                        placeholder="Set your location and find beauty parlors that offer various personal care treatments"
                        disabled={loading}
                    />
                </div>

                {/* Action Buttons */}
                <div className={styles.buttonContainer}>
                    <div className={styles.deleteButton}>
                        {!isAdd && (
                            <Button
                                label="Delete branch"
                                onClick={handleDelete}
                                size='small'
                                disabled={loading}
                                icon={
                                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.7637 4.67346L12.938 17.6342C12.938 18.3814 12.3523 18.9926 11.638 18.9926H4.55157C3.838 18.9926 3.25443 18.3814 3.25443 17.6342L2.42871 4.67346" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4.57129 4.21502L4.642 2.11233C4.642 1.50106 5.03986 1 5.52486 1H10.3406C10.8263 1 11.2227 1.50106 11.2227 2.11233L11.2927 4.21502" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 4.30613H15.8671" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5.38863 7.61224L5.89792 16.5167" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7.64371 10.551L7.928 16.4851" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                                iconPosition='left'
                                noAppearance={true}
                                backgroundColor='transparent'
                                fontColor='#E52D42'
                            />
                        )}
                    </div>
                    <div className={styles.cancelAddSave}>
                        <Button
                            label="Cancel"
                            onClick={handleClose}
                            noAppearance={true}
                            size='small'
                            disabled={loading}
                        />
                        <Button
                            label={`${isAdd ? 'Add' : 'Save'}`}
                            onClick={handleSave}
                            size='small'
                            disabled={loading || !isFormValid}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchAddEditModal;
