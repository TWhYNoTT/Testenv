import React from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = {
    label?: string;
    checked?: boolean;
    onChange?: (val: boolean) => void;
    value?: string;
    disabled?: boolean;
    required?: boolean;
    variant?: 'default' | 'button';
    additionalText?: string
};

const Checkbox: React.FC<CheckboxProps> = ({
    label = '',
    checked = false,
    onChange = () => { },
    value,
    disabled = false,
    required = false,
    variant = 'default',
    additionalText
}) => {

    const handleChange = () => {
        onChange(!checked);
    }


    return (
        <div className={styles.checkboxContainer}>
            <input

                type="checkbox"
                checked={checked}
                onChange={handleChange}
                value={value}
                disabled={disabled}
                className={styles.input}
            />
            <label

                className={`${styles.label}  ${additionalText ? styles.additionalTextt : ''} ${disabled ? styles.disabledLabel : ''} ${variant === 'button' ? styles.buttonLabel : ''} ${checked ? styles.checked : ''}`}
                onClick={!disabled ? handleChange : undefined}
            >
                {variant === 'default' ? <span className={`${styles.checkmark} ${checked ? styles.checkedMark : ''} ${disabled ? styles.disabled : ''}`}></span> : ''}
                <span className={styles.labelText}>{label}</span>
                {additionalText ? <span className={styles.additionalText}>{additionalText}</span> : ''}
                {required && <span className={styles.required}>*</span>}
            </label>
        </div>
    );
};

export default Checkbox;
