import React from 'react';
import Toggle from '../../Toggle/Toggle';
import InputField from '../../InputField/InputField';

import styles from './Step4.module.css';

type Step4Props = {
    locationData: {
        country: string;
        state: string;
        streetAddress: string;
        city: string;
        zipCode: string;
        homeServicesAvailable: boolean;
        latitude: number;
        longitude: number;
    };
    setLocationData: React.Dispatch<React.SetStateAction<{
        country: string;
        state: string;
        streetAddress: string;
        city: string;
        zipCode: string;
        homeServicesAvailable: boolean;
        latitude: number;
        longitude: number;
    }>>;
}

const Step4: React.FC<Step4Props> = ({ locationData, setLocationData }) => {
    const handleInputChange = (name: string, value: string) => {
        setLocationData((prevData) => ({ ...prevData, [name]: value }));
    };


    return (
        <div className={styles.stepContainer}>
            <h2 className='headerText'>Location</h2>
            <div className={styles.inputfiledsContainer}>
                <InputField
                    label="Country"
                    name="country"
                    value={locationData.country}
                    onChange={(value) => handleInputChange('country', value)}
                    placeholder="Enter country"
                    type="text"
                />
                <InputField
                    label="State"
                    name="state"
                    value={locationData.state}
                    onChange={(value) => handleInputChange('state', value)}
                    placeholder="Enter state"
                    type="text"
                />
                <InputField
                    label="Street Address"
                    name="streetAddress"
                    value={locationData.streetAddress}
                    onChange={(value) => handleInputChange('streetAddress', value)}
                    placeholder="Enter street address"
                    type="text"
                />
                <div className={styles.cityZipCode}>
                    <InputField
                        label="City"
                        name="city"
                        value={locationData.city}
                        onChange={(value) => handleInputChange('city', value)}
                        placeholder="Enter city"
                        type="text"
                    />
                    <InputField
                        label="Zip Code"
                        name="zipCode"
                        value={locationData.zipCode}
                        onChange={(value) => handleInputChange('zipCode', value)}
                        placeholder="Enter zip code"
                        type="text"
                    />
                </div>


                <Toggle
                    label='Home Services Available'

                    checked={locationData.homeServicesAvailable}
                    onChange={() => setLocationData((prevData) => ({ ...prevData, homeServicesAvailable: !prevData.homeServicesAvailable }))}
                    value='homeServicesAvailable'
                    name='homeServicesAvailable'
                />

            </div>
        </div>
    );
};

export default Step4;
