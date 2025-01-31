import React, { useState } from 'react';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';

import styles from './partnerRequestForm.module.css';

interface PartnerFormProps {
    toggleForm: (form: 'login' | 'register' | 'forgetPassword' | 'partner') => void;
}



const PartnerRequestForm: React.FC<PartnerFormProps> = ({ toggleForm }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [message, setMessage] = useState('');

    // const handlePartnerRequest = () => {

    // };

    return (
        <form className={styles.partnerForm} onSubmit={(e) => e.preventDefault()}>
            <h2 className={styles.partnerText}>Partner Request</h2>
            <div className={styles.partnerFields}>
                <InputField
                    label="Name"
                    value={name}
                    onChange={setName}
                    placeholder="Enter your name"
                    required
                />
                <InputField
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter your email"
                    type="email"
                    required
                />
                <InputField
                    label="Company"
                    value={company}
                    onChange={setCompany}
                    placeholder="Enter your company name"
                />
                <InputField
                    label="Message"
                    value={message}
                    onChange={setMessage}
                    placeholder="Enter your message"
                    type="text"
                />
            </div>
            <div className={styles.buttonWrpr}>
                <Button
                    type="submit"
                    label="Send Request"
                    onClick={() => { toggleForm('login') }}
                    variant="primary"
                />
            </div>
        </form>
    );
};

export default PartnerRequestForm;
