import React, { useState, useEffect, useRef } from 'react';
import styles from './Dropdown.module.css';

type DropdownProps = {
    label?: string;
    options?: string[];
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    disabled?: boolean;
    required?: boolean;
    feedback?: 'success' | 'error' | 'warning';
    feedbackMessage?: string;
    isLoading?: boolean;
    multiple?: boolean;
    searchable?: boolean;
    defaultMessage?: string;
    variant?: 'primary' | 'secondary';
    withBorder?: boolean;
};


const Dropdown: React.FC<DropdownProps> = ({
    label,
    options = ['Option 1', 'Option 2', 'Option 3'],
    value = '',
    onChange = () => { },
    disabled = false,
    required = false,
    feedback,
    feedbackMessage,
    isLoading = false,
    multiple = false,
    searchable = false,
    defaultMessage = 'Select an option',
    variant = '',
    withBorder = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option: string) => {
        if (multiple) {
            if (Array.isArray(value)) {
                if (value.includes(option)) {
                    onChange(value.filter((v) => v !== option));
                } else {
                    onChange([...value, option]);
                }
            }
        } else {
            onChange(option);
            setIsOpen(false);
        }
    };

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const feedbackClass = feedback ? styles[feedback] : '';

    const displayValue = multiple && Array.isArray(value)
        ? value.length > 0
            ? value.join(', ')
            : defaultMessage
        : (value as string) || defaultMessage;

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            {label && <label className={styles.label}>{label} {required && '*'}</label>}
            <div className={styles.dropdown} onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}>
                <div className={`${styles.selected} ${disabled ? styles.disabled : ''} ${isOpen ? styles.isOpen : ''} ${styles[variant]} ${variant ? styles.xstyle : ''} ${withBorder ? styles.withBorder : ''}`}>
                    {isLoading ? <span className={styles.spinner}></span> : displayValue}
                </div>
                {isOpen && (
                    <div className={styles.dropdownContent}>
                        {searchable && (
                            <div className={styles.searchContainer}>
                                <span className={styles.magnifier}><img src="./assets/icons/magnifier.png" alt="magnifier" /></span>
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                        <ul className={styles.options}>
                            {filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    className={`${styles.option} ${multiple && Array.isArray(value) && value.includes(option) ? styles.selectedOption : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleSelect(option) }}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {feedbackMessage && (
                <div className={`${styles.feedbackMessage} ${feedbackClass}`}>
                    {feedbackMessage}
                </div>
            )}
        </div>
    );
};

export default Dropdown;