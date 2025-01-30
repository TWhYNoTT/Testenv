import React from 'react';
import styles from './Step1.module.css';
import InputField from '../../InputField/InputField';
import TextArea from '../../TextArea/TextArea';

type Step1Props = {
    formData: {
        businessName: string;
        about: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        businessName: string;
        about: string;
    }>>;
};

const Step1: React.FC<Step1Props> = ({ formData, setFormData }) => {
    const handleInputChange = (name: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className='headerText'>Branch 1 details</h2>

            <InputField
                label='Business name'
                name='businessName'
                placeholder='Please enter your business name'
                value={formData.businessName}
                onChange={(value) => handleInputChange('businessName', value)}
            />

            <TextArea
                label='About'
                name='about'
                placeholder='Please enter the business description'
                value={formData.about}
                onChange={(value) => handleInputChange('about', value)}
            />
        </div>
    );
};

export default Step1;
