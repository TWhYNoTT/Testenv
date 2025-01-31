import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
    label?: string;
    backgroundColor?: string;
    fontColor?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'ghost' | 'disabled';
    size?: 'small' | 'medium' | 'large';
    iconPosition?: 'left' | 'right';
    noAppearance?: boolean;
    type?: 'button' | 'submit' | 'reset';
};

const Button: React.FC<ButtonProps> = ({
    label = '',
    onClick,
    icon,
    disabled = false,
    variant,
    size,
    iconPosition = 'right',
    backgroundColor,
    fontColor,
    noAppearance,
    type = 'button'
}) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${variant ? styles[variant] : ''} ${noAppearance ? styles.noAppearance : ''} ${size ? styles[size] : ''}`}
            onClick={onClick}
            disabled={disabled}
            aria-disabled={disabled}
            style={variant ? {} : (backgroundColor ? { backgroundColor: backgroundColor, color: fontColor } : {})}
        >
            {icon && iconPosition === 'left' && <span className={styles.icon}>{icon}</span>}
            {label}
            {icon && iconPosition === 'right' && <span className={styles.icon}>{icon}</span>}
        </button>
    );
};

export default Button;
