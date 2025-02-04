import React from 'react';
import Toggle from '../../../components/Toggle/Toggle';
import InputField from '../../../components/InputField/InputField';
import styles from './Step4.module.css';

interface LocationData {
    country: string; // Added country field
    city: string;
    state: string;
    streetAddress: string;
    zipCode: string;
    hasHomeService: boolean;
    latitude: number;
    longitude: number;
}

interface Step4Props {
    locationData: LocationData;
    setLocationData: React.Dispatch<React.SetStateAction<LocationData>>;
    onFieldChange: (field: string, value: string) => void;
    onToggleChange: (field: string, value: boolean) => void;
    errors?: {
        country?: string; // Added country error
        city?: string;
        state?: string;
        streetAddress?: string;
        zipCode?: string;
        location?: string;
    };
}

const Step4: React.FC<Step4Props> = ({
    locationData,
    setLocationData,
    onFieldChange,
    onToggleChange,
    errors
}) => {
    const handleInputChange = (name: keyof LocationData) => (event: React.ChangeEvent<HTMLInputElement> | string) => {
        const value = typeof event === 'string' ? event : event.target.value;
        onFieldChange(name, value);
    };

    const handleHomeServiceToggle = () => {
        onToggleChange('hasHomeService', !locationData.hasHomeService);
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className='headerText'>Location</h2>
            <div className={styles.inputfiledsContainer}>
                <InputField
                    label="Country"
                    name="country"
                    value={locationData.country}
                    onChange={(e) => onFieldChange('country', e)}
                    placeholder="Enter country"
                    type="text"
                    required
                    feedback={errors?.country ? 'error' : undefined}
                    feedbackMessage={errors?.country}
                />

                <InputField
                    label="State/Emirates"
                    name="state"
                    value={locationData.state}
                    onChange={(e) => onFieldChange('state', e)}
                    placeholder="Enter state/emirate"
                    type="text"
                    required
                    feedback={errors?.state ? 'error' : undefined}
                    feedbackMessage={errors?.state}
                />

                <InputField
                    label="Street Address"
                    name="streetAddress"
                    value={locationData.streetAddress}
                    onChange={(e) => onFieldChange('streetAddress', e)}
                    placeholder="Enter street address"
                    type="text"
                    required
                    feedback={errors?.streetAddress ? 'error' : undefined}
                    feedbackMessage={errors?.streetAddress}
                />

                <div className={styles.cityZipCode}>
                    <InputField
                        label="City"
                        name="city"
                        value={locationData.city}
                        onChange={(e) => onFieldChange('city', e)}
                        placeholder="Enter city"
                        type="text"
                        required
                        feedback={errors?.city ? 'error' : undefined}
                        feedbackMessage={errors?.city}
                    />

                    <InputField
                        label="Zip Code"
                        name="zipCode"
                        value={locationData.zipCode}
                        onChange={(e) => onFieldChange('zipCode', e)}
                        placeholder="Enter zip code"
                        type="text"
                        required
                        feedback={errors?.zipCode ? 'error' : undefined}
                        feedbackMessage={errors?.zipCode}
                    />
                </div>

                <Toggle
                    label='Home Services Available'
                    checked={locationData.hasHomeService}
                    onChange={handleHomeServiceToggle}
                    name='homeServicesAvailable'
                />

                {errors?.location && (
                    <div className={styles.error}>
                        Please select a location on the map
                    </div>
                )}

                <div className={styles.mapInstructions}>
                    Click on the map to set your business location
                </div>
            </div>
        </div>
    );
};

export default Step4;