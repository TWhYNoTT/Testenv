import React, { useState, useEffect, useMemo } from 'react';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import TextArea from '../TextArea/TextArea';
import Toggle from '../Toggle/Toggle';
import Checkbox from '../Checkbox/Checkbox';
import styles from './AddEditModal.module.css';
import useNavigationPrompt from '../../hooks/useNavigationPrompt';

interface AddEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: any;
    onSave: (branch: any) => void;
    isAdd?: boolean;
    onDeleteClicked: () => void;
    loading?: boolean;
    onDirtyChange?: (dirty: boolean) => void;
}

const AddEditModal: React.FC<AddEditModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave,
    onDeleteClicked,
    isAdd,
    loading = false,
    onDirtyChange
}) => {
    const [data, setData] = useState<any>(initialData || {
        Branch: '',
        Location: '',
        Status: false,
        Headquarters: false,
        Description: ''
    });

    const [errors, setErrors] = useState<{ Branch?: string; Location?: string }>({});
    const [dirty, setDirty] = useState<boolean>(false);

    // Initialize form only when modal opens (avoid resetting on parent re-renders)
    useEffect(() => {
        if (!isOpen) return;
        setData(initialData || {
            Branch: '',
            Location: '',
            Status: false,
            Headquarters: false,
            Description: ''
        });
        setDirty(false);
        setErrors({});
        if (onDirtyChange) onDirtyChange(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Validation helpers
    const validateBranch = (val: string): string | undefined => {
        const cleaned = val.trim();
        if (cleaned.length < 3) return 'Branch Name must be at least 3 characters and up to 100 alphanumeric characters.';
        if (cleaned.length > 100) return 'Branch Name must be at least 3 characters and up to 100 alphanumeric characters.';
        // allow letters, numbers, and spaces only
        if (!/^[A-Za-z0-9 ]+$/.test(cleaned)) return 'Branch Name must be at least 3 characters and up to 100 alphanumeric characters.';
        return undefined;
    };

    const validateAddress = (val: string): string | undefined => {
        const cleaned = val.trim();
        if (cleaned.length < 10) return 'Address must be at least 10 characters and up to 255 characters.';
        if (cleaned.length > 255) return 'Address must be at least 10 characters and up to 255 characters.';
        // allow alphanumeric, spaces, and limited special chars: , . - # / '
        if (!/^[A-Za-z0-9 \-#.,/'"]+$/.test(cleaned)) return 'Address must be at least 10 characters and up to 255 characters.';
        return undefined;
    };

    const handleInputChange = (value: string) => {
        // sanitize to allowed characters (alphanumeric and spaces)
        const sanitized = value.replace(/[^A-Za-z0-9 ]/g, '');
        const next = { ...data, Branch: sanitized };
        setData(next);
        setDirty(true);
        if (onDirtyChange) onDirtyChange(true);
        setErrors((prev) => ({ ...prev, Branch: validateBranch(sanitized) }));
    };

    const handleLocationChange = (value: string) => {
        // sanitize to alphanumeric, spaces, and , . - # / '
        const sanitized = value.replace(/[^A-Za-z0-9 \-#.,/'"]/g, '');
        const next = { ...data, Location: sanitized };
        setData(next);
        setDirty(true);
        if (onDirtyChange) onDirtyChange(true);
        setErrors((prev) => ({ ...prev, Location: validateAddress(sanitized) }));
    };

    const handleTextareaChange = (value: string) => {
        setData({ ...data, Description: value });
        setDirty(true);
        if (onDirtyChange) onDirtyChange(true);
    };

    const handleToggleChange = (checked: boolean) => {
        setData({ ...data, Status: checked });
        setDirty(true);
        if (onDirtyChange) onDirtyChange(true);
    };

    const handleCheckboxChangeYes = (checked: boolean) => {
        if (!data.Headquarters) {
            setData({ ...data, Headquarters: checked });
            setDirty(true);
            if (onDirtyChange) onDirtyChange(true);
        }
    };

    const handleCheckboxChangeNo = (checked: boolean) => {
        if (data.Headquarters) {
            setData({ ...data, Headquarters: !checked });
            setDirty(true);
            if (onDirtyChange) onDirtyChange(true);
        }
    };

    const isFormValid = useMemo(() => {
        const branchErr = validateBranch(data.Branch || '');
        const addrErr = validateAddress(data.Location || '');
        return !branchErr && !addrErr;
    }, [data.Branch, data.Location]);

    const handleSave = () => {
        // ensure errors updated before submit
        const branchErr = validateBranch(data.Branch || '');
        const addrErr = validateAddress(data.Location || '');
        setErrors({ Branch: branchErr, Location: addrErr });
        if (branchErr || addrErr) return;
        onSave(data);
        setDirty(false);
        if (onDirtyChange) onDirtyChange(false);
    };

    const handleDelete = () => {
        onDeleteClicked();
    };

    const handleClose = () => {
        if (dirty) {
            const confirmClose = window.confirm('You have unsaved changes. Do you want to discard them?');
            if (!confirmClose) return;
        }
        onClose();
    };

    // Prompt on browser/tab close when unsaved changes exist
    useEffect(() => {
        const beforeUnload = (e: BeforeUnloadEvent) => {
            if (!dirty) return;
            e.preventDefault();
            e.returnValue = '';
        };
        if (isOpen && dirty) {
            window.addEventListener('beforeunload', beforeUnload);
        }
        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        };
    }, [isOpen, dirty]);

    // In-app navigation prompt when modal has unsaved changes
    useNavigationPrompt(isOpen && dirty, 'You have unsaved changes. Do you want to discard them?');

    return (
        <div className={`${styles.modalBackground} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContainer} ${isOpen ? styles.open : ''}`}>
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.loadingContent}>
                            <div className={styles.spinner}></div>
                            <span>Saving branch...</span>
                        </div>
                    </div>
                )}

                <div className={styles.headerCloseInputsContainer}>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        disabled={loading}
                    >
                        &times;
                    </button>
                    <h2 className={`${styles.header} headerText`}>
                        {isAdd ? 'Add Branch' : 'Edit Branch'}
                    </h2>
                    <InputField
                        label="Branch Name"
                        name="Branch"
                        value={data.Branch}
                        onChange={handleInputChange}
                        placeholder="Branch Name"
                        disabled={loading}
                        feedback={errors.Branch ? 'error' : undefined}
                        feedbackMessage={errors.Branch}
                    />
                    <InputField
                        label="Branch Location"
                        name="Location"
                        value={data.Location}
                        onChange={handleLocationChange}
                        placeholder="Branch Location"
                        disabled={loading}
                        feedback={errors.Location ? 'error' : undefined}
                        feedbackMessage={errors.Location}
                    />
                    <div className={styles.toggleContainer}>
                        <Toggle
                            messageIfChecked='Active'
                            messageIfNotChecked='Inactive'
                            checked={data.Status}
                            onChange={handleToggleChange}
                            disabled={loading}
                        />
                    </div>
                    <div className={styles.checkboxMainContainer}>
                        <label>This is your primary Headquarters?</label>
                        <div className={styles.checkboxContainer}>
                            <Checkbox
                                variant='button'
                                label='Yes'
                                checked={data.Headquarters}
                                onChange={handleCheckboxChangeYes}
                                disabled={loading}
                            />
                            <Checkbox
                                variant='button'
                                label='No'
                                checked={!data.Headquarters}
                                onChange={handleCheckboxChangeNo}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <TextArea
                        label="Description"
                        name="Description"
                        value={data.Description}
                        onChange={handleTextareaChange}
                        placeholder="Set your location and find beauty parlors that offer various personal care treatments"
                        disabled={loading}
                    />
                </div>
                <div className={styles.buttonContainer}>
                    <div className={styles.deleteButton}>
                        {
                            !isAdd &&
                            <Button
                                label="Delete branch"
                                onClick={handleDelete}
                                size='small'
                                disabled={loading}
                                icon={
                                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.7637 4.67346L12.938 17.6342C12.938 18.3814 12.3523 18.9926 11.638 18.9926H4.55157C3.838 18.9926 3.25443 18.3814 3.25443 17.6342L2.42871 4.67346" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4.57129 4.21502L4.642 2.11233C4.642 1.50106 5.03986 1 5.52486 1H10.3406C10.8263 1 11.2227 1.50106 11.2227 2.11233L11.2927 4.21502" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 4.30613H15.8671" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5.38863 7.61224L5.89792 16.5167" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7.64371 10.551L7.928 16.4851" stroke="#E52D42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                                iconPosition='left'
                                noAppearance={true}
                                backgroundColor='transparent'
                                fontColor='#E52D42'
                            />
                        }
                    </div>
                    <div className={styles.cancelAddSave}>
                        <Button
                            label="Cancel"
                            onClick={handleClose}
                            noAppearance={true}
                            size='small'
                            disabled={loading}
                        />
                        <Button
                            label={`${isAdd ? 'Add' : 'Save'}`}
                            onClick={handleSave}
                            size='small'
                            disabled={loading || !isFormValid}
                        />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AddEditModal;