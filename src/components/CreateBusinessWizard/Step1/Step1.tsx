import React from 'react';
import styles from './Step1.module.css';
import InputField from '../../../components/InputField/InputField';
import TextArea from '../../../components/TextArea/TextArea';

interface FormData {
    businessName: string;
    about: string;
    businessRegistrationNumber: string;
}

interface Step1Props {
    formData: FormData;
    setFormData: (data: Partial<FormData>) => void;  // Changed this type
    errors?: {
        businessName?: string;
        about?: string;

    };
}

const Step1: React.FC<Step1Props> = ({ formData, setFormData, errors }) => {
    const handleInputChange = (name: keyof FormData) => (value: string) => {
        setFormData({
            [name]: value
        });
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className='headerText'>Branch details</h2>

            <InputField
                label='Business name'
                name='businessName'
                placeholder='Please enter your business name'
                value={formData.businessName}
                onChange={(value) => handleInputChange('businessName')(value)}
                required
                feedback={errors?.businessName ? 'error' : undefined}
                feedbackMessage={errors?.businessName}
            />

            <InputField
                label='Business Registration Number'
                name='businessRegistrationNumber'
                placeholder='Please enter registration number'
                value={formData.businessRegistrationNumber}
                onChange={(value) => handleInputChange('businessRegistrationNumber')(value)}
                required
            />

            <TextArea
                label='About'
                name='about'
                placeholder='Please enter the business description'
                value={formData.about}
                onChange={(value) => handleInputChange('about')(value)}
                required
                feedback={errors?.about ? 'error' : undefined}
                feedbackMessage={errors?.about}
            />
        </div>
    );
};

export default Step1;