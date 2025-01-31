import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './textarea.module.css';

type TextAreaProps = {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    feedback?: 'success' | 'error' | 'warning';
    feedbackMessage?: string;
    name?: string;
};

const TextArea: React.FC<TextAreaProps> = ({
    label = '',
    value = '',
    onChange = () => { },
    placeholder = '',
    disabled = false,
    required = false,
    feedback,
    feedbackMessage,
    name
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const resizeHandleRef = useRef<HTMLSpanElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [startHeight, setStartHeight] = useState(0);
    const [startY, setStartY] = useState(0);

    const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
        setIsResizing(true);
        setStartHeight(textAreaRef.current?.offsetHeight || 0);
        setStartY(e.clientY);
        e.preventDefault();
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newHeight = startHeight + (e.clientY - startY);
            if (textAreaRef.current) {
                textAreaRef.current.style.height = `${Math.max(newHeight, 50)}px`;
            }
            e.preventDefault();
        }
    }, [isResizing, startHeight, startY]);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, handleMouseMove]);

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={styles.textAreaContainer}>
            <div className={styles.textAreaWrapper}>
                <textarea
                    ref={textAreaRef}
                    className={`${styles.textArea} ${disabled ? styles.disabled : ''} ${feedback ? styles[feedback] : ''}`}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    name={name}
                />
                <label className={styles.label}>
                    {label} {required && <span className={styles.required}>*</span>}
                </label>
                <div className={styles.border}></div>
                <span
                    ref={resizeHandleRef}
                    className={styles.resizeHandle}
                    onMouseDown={handleMouseDown}
                >
                    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.6784 4.20002L4.4375 9.44092" stroke="#CFD8E9" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.77661 0.776612L1.01416 7.53906" stroke="#CFD8E9" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.1577 8.13065L8.36816 10.9202" stroke="#CFD8E9" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>
            {feedbackMessage && (
                <div className={`${styles.feedbackMessage} ${feedback ? styles[feedback] : ''}`}>
                    {feedbackMessage}
                </div>
            )}
        </div>
    );
};

export default TextArea;
