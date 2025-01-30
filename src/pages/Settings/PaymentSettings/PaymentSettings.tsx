import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './PaymentSettings.module.css';
import Button from '../../../components/Button/Button';
import InputField from '../../../components/InputField/InputField';


const PaymentSettings: React.FC = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [cardInfo, setCardInfo] = useState({
        name: 'Abdo Mostafa',
        number: '4539948470743232',
        expiry: '01/27',
        cvc: '123'
    });

    const handleBackClick = () => {
        navigate('/settings');
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);

    };

    const handleInputChange = (field: string) => (value: string) => {
        setCardInfo(prevState => ({ ...prevState, [field]: value }));
    };

    return (
        <div className={styles.paymentPage}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={handleBackClick}>
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="38" height="38" rx="14" fill="#DBD1F9" />
                        <path d="M23 12L16 19L23 26" stroke="#6138E0" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h2 className={styles.title}>Payment</h2>
            </div>
            <div className={`${styles.paymentMethod} ${isEditing ? styles.isEditing : ''}`}>
                <div className={styles.methodHeader}>
                    <h3>Payment method</h3>
                    {!isEditing && (
                        <Button
                            label="Edit"
                            onClick={handleEditClick}
                            noAppearance={true}
                            size="medium"
                            backgroundColor='transparent'
                            fontColor='#6138e0'
                        />
                    )}
                </div>
                {!isEditing ? (
                    <>
                        <div className={styles.cardInfo}>
                            <p>Visa card ending in **{cardInfo.number.slice(-2)}</p>
                        </div>
                        <Button
                            label="Remove"

                            noAppearance={true}
                            size="small"

                            icon={
                                <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.7637 4.67346L12.938 17.6342C12.938 18.3814 12.3523 18.9926 11.638 18.9926H4.55157C3.838 18.9926 3.25443 18.3814 3.25443 17.6342L2.42871 4.67346" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4.57129 4.21502L4.642 2.11233C4.642 1.50106 5.03986 1 5.52486 1H10.3406C10.8263 1 11.2227 1.50106 11.2227 2.11233L11.2927 4.21502" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M1 4.30613H15.8671" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.38863 7.61224L5.89792 16.5167" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M7.64371 10.551L7.928 16.4851" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            }
                            iconPosition='right'

                            backgroundColor='transparent'
                            fontColor='#E52D42'
                        />
                    </>
                ) : (
                    <>
                        <form className={styles.editForm}>
                            <InputField
                                label="Name on Card"
                                value={cardInfo.name}
                                onChange={handleInputChange('name')}

                            />
                            <InputField
                                label="Card Number"
                                value={cardInfo.number}
                                onChange={handleInputChange('number')}

                            />
                            <div className={styles.formRow}>
                                <InputField
                                    label="Expiry Date"
                                    value={cardInfo.expiry}
                                    onChange={handleInputChange('expiry')}
                                    placeholder="MM/YY"

                                />
                                <InputField
                                    label="CVC"
                                    value={cardInfo.cvc}
                                    onChange={handleInputChange('cvc')}

                                />
                            </div>

                        </form>
                        <div className={styles.formActions}>
                            <Button
                                label="Remove"

                                noAppearance={true}
                                size="small"

                                icon={
                                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.7637 4.67346L12.938 17.6342C12.938 18.3814 12.3523 18.9926 11.638 18.9926H4.55157C3.838 18.9926 3.25443 18.3814 3.25443 17.6342L2.42871 4.67346" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4.57129 4.21502L4.642 2.11233C4.642 1.50106 5.03986 1 5.52486 1H10.3406C10.8263 1 11.2227 1.50106 11.2227 2.11233L11.2927 4.21502" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M1 4.30613H15.8671" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M5.38863 7.61224L5.89792 16.5167" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M7.64371 10.551L7.928 16.4851" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                }
                                iconPosition='right'

                                backgroundColor='transparent'
                                fontColor='#E52D42'
                            />
                            <Button
                                label="Save"
                                onClick={handleSaveClick}
                                variant="primary"
                                size="medium"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSettings;