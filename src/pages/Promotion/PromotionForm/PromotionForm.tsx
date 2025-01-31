import React, { useState } from 'react';
import Button from '../../../components/Button/Button';
import Input from '../../../components/InputField/InputField';
import Dropdown from '../../../components/Dropdown/Dropdown';

import styles from './PromotionForm.module.css';

interface Field {
    type: 'text' | 'number' | 'date' | 'dropdown' | 'button';
    name: string;
    label: string;
    options?: string[];
}

interface PromotionFormProps {
    title: string;
    fields: Field[];
    onSubmit: (formData: any) => void;
    generateCode?: () => string;
    handleBack: () => void
}

const PromotionForm: React.FC<PromotionFormProps> = ({ title, fields, onSubmit, generateCode, handleBack }) => {
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);

    const handleInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleGenerateCode = () => {
        if (generateCode) {
            const code = generateCode();
            setGeneratedCode(code);
            setFormData({ ...formData, generatedCode: code });
        }
    };

    return (
        <div className={styles.promotionForm}>
            <div className={styles.bckBTNheader}>
                <svg onClick={handleBack} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backButton}>
                    <rect width="38" height="38" rx="14" fill="#DBD1F9" />
                    <path d="M23 12L16 19L23 26" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h2 className='xH1'>{title}</h2>
            </div>

            <form className={styles.frm} onSubmit={handleSubmit}>
                <div className={styles.filedContainer} >
                    {fields.map((field) => (
                        <>
                            {field.type === 'dropdown' || field.type === 'date' || field.type === 'button' ? (field.type === 'button' ?
                                <Button
                                    label={field.label}
                                    noAppearance={true}
                                    backgroundColor="transparent"
                                    iconPosition="left"
                                    size="medium"
                                    fontColor="#6138e0"
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.0753 19L9.92529 1" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M1 10.075L19 9.92505" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>


                                    }
                                />
                                :
                                <Dropdown key={field.name}
                                    defaultMessage={field.label}
                                    options={field.options || ['Date 1', 'Date 2', 'Date 3']}
                                    value={formData[field.name] || ''}
                                    onChange={(value) => handleInputChange(field.name, value as string)}
                                />
                            ) : (
                                <Input key={field.name}
                                    type={field.type}
                                    label={field.label}
                                    placeholder={field.label}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={(val) => handleInputChange(field.name, val)}
                                    unit={field.options !== undefined ? field.options[0] : ''}
                                />
                            )}
                        </>
                    ))}
                    {generateCode ?
                        (<Button label="Generate" onClick={handleGenerateCode} variant="primary" size='medium' />)
                        :
                        (<Button label="Apply" type="submit" variant="primary" size='medium' />)}

                </div>
                {generateCode && (
                    <div className={styles.generateCode}>

                        {generatedCode && (
                            <div className={styles.generatedCode}>
                                <p>Ramadan deals</p>
                                <span className='xH1'>{generatedCode}</span>
                                <p>Code generated</p>
                            </div>
                        )}

                    </div>
                )}

            </form>
        </div>
    );
};

export default PromotionForm;