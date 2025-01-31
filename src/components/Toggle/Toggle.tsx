import React from 'react';
import styles from './Toggle.module.css';

type ToggleProps = {
    label?: string;
    checked?: boolean;
    onChange?: (val: boolean) => void;
    value?: string;
    disabled?: boolean;
    required?: boolean;
    name?: string
    messageIfChecked?: string
    messageIfNotChecked?: string
};

const Toggle: React.FC<ToggleProps> = ({
    label = '',
    checked = false,
    onChange = () => { },
    value = '',
    disabled = false,
    required = false,
    name = '',
    messageIfChecked = '',
    messageIfNotChecked = ''
}) => {
    const handleChange = () => {
        onChange(!checked);
    }


    return (
        <div className={styles.toggleContainer}>
            <label className={styles.toggle}>
                <input

                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    value={value}
                    disabled={disabled}
                    className={styles.input}
                    name={name}
                />
                <span className={`${styles.slider} ${checked ? styles.checked : ''} ${disabled ? styles.disabled : ''}`}></span>
            </label>
            <label onClick={handleChange} className={`${styles.label} ${disabled ? styles.disabledLabel : ''}`} >
                {label} {required && <span className={styles.required}>*</span>}
                {checked && messageIfChecked}
                {!checked && messageIfNotChecked}
            </label>
        </div>
    );
};

export default Toggle;
