import React, { useState } from 'react';
import styles from './InputField.module.css';


type InputFieldProps = {
    label?: string,
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'password' | 'email' | 'number' | 'tel';
    disabled?: boolean;
    required?: boolean;
    feedback?: 'success' | 'error' | 'warning';
    feedbackMessage?: string;
    unit?: string;
    name?: string;
    showSpinner?: boolean;
    // forwarded HTML input attributes for better control from callers
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    pattern?: string;
    maxLength?: number;

};

const InputField: React.FC<InputFieldProps> = ({
    label = '',
    value = '',
    onChange = () => { },
    placeholder = '',
    type = 'text',
    disabled = false,
    required = false,
    feedback,
    feedbackMessage,
    unit,
    name,
    showSpinner = false,
    inputMode,
    pattern,
    maxLength,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };
    return (
        <div className={styles.inputFieldContainer}>
            <div className={styles.inputWrapper}>
                <input
                    type={type === 'password' && showPassword ? 'text' : type}
                    className={`${styles.input} ${disabled ? styles.disabled : ''} ${feedback ? styles[feedback] : ''}`}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    name={name}
                    inputMode={inputMode}
                    pattern={pattern}
                    maxLength={maxLength}
                />
                <label className={styles.label}>
                    {label} {required && <span className={styles.required}>*</span>}
                </label>
                <div className={styles.inputControllor}>
                    {type === 'password' && (
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={togglePasswordVisibility}
                            disabled={disabled}
                        >
                            {showPassword ?
                                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 12C4 12 5.6 7 12 7M12 7C18.4 7 20 12 20 12M12 7V4M18 5L16 7.5M6 5L8 7.5M15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                :
                                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 10C4 10 5.6 15 12 15M12 15C18.4 15 20 10 20 10M12 15V18M18 17L16 14.5M6 17L8 14.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            }
                        </button>
                    )}

                    {type === 'number' && !disabled && (
                        <>
                            {showSpinner && (
                                <div className={styles.spinner}>
                                    <div className={`${styles.button} ${styles.upArrow}`} onClick={() => onChange(String(Number(value) + 1))}></div>
                                    <div className={`${styles.button} ${styles.downArrow}`} onClick={() => onChange(String(Number(value) - 1))}></div>
                                </div>
                            )}
                            {unit && <span className={styles.unit}>{unit}</span>}
                        </>
                    )}
                    {feedback && (
                        <span className={`${styles.feedbackIcon} ${styles[feedback]}`}>
                            {feedback === 'success' && <span></span>}
                            {feedback === 'error' && '⚠'}
                            {feedback === 'warning' && '⚠'}
                        </span>
                    )}
                </div>
                <div className={styles.border}></div>
            </div>
            {feedbackMessage && (
                <div className={`${styles.feedbackMessage} ${feedback ? styles[feedback] : ''}`}>
                    {feedbackMessage}
                </div>
            )}
        </div>
    );
};

export default InputField;
