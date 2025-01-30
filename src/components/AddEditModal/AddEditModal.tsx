import React, { useState, useEffect } from 'react';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import TextArea from '../TextArea/TextArea';
import Toggle from '../Toggle/Toggle';
import Checkbox from '../Checkbox/Checkbox';
import styles from './AddEditModal.module.css';

interface AddEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: any;
    onSave: (branch: any) => void;
    isAdd?: boolean;
    onDeleteClicked: () => void;
}

const AddEditModal: React.FC<AddEditModalProps> = ({ isOpen, onClose, initialData, onSave, onDeleteClicked, isAdd }) => {
    const [data, setData] = useState<any>(initialData || {
        Branch: '',
        Location: '',
        Status: false,
        Headquarters: false,
        Description: ''
    });

    useEffect(() => {
        setData(initialData || {
            Branch: '',
            Location: '',
            Status: false,
            Headquarters: false,
            Description: ''
        });
    }, [initialData]);

    const handleInputChange = (value: string) => {
        setData({ ...data, Branch: value });
    };

    const handleLocationChange = (value: string) => {
        setData({ ...data, Location: value });
    };

    const handleTextareaChange = (value: string) => {
        setData({ ...data, Description: value });
    };

    const handleToggleChange = (checked: boolean) => {
        setData({ ...data, Status: checked });
    };

    const handleCheckboxChangeYes = (checked: boolean) => {
        if (!data.Headquarters)
            setData({ ...data, Headquarters: checked });
    };

    const handleCheckboxChangeNo = (checked: boolean) => {
        if (data.Headquarters)
            setData({ ...data, Headquarters: !checked });
    };

    const handleSave = () => {
        onSave(data);
    };

    const handleDelete = () => {
        onDeleteClicked();
    };

    return (
        <div className={`${styles.modalBackground} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContainer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.headerCloseInputsContainer}>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                    <h2 className={`${styles.header} headerText`}>{isAdd ? 'Add Branch' : 'Edit Branch'}</h2>
                    <InputField
                        label="Branch Name"
                        name="Branch"
                        value={data.Branch}
                        onChange={handleInputChange}
                        placeholder="Branch Name"
                    />
                    <InputField
                        label="Branch Location"
                        name="Location"
                        value={data.Location}
                        onChange={handleLocationChange}
                        placeholder="Branch Location"
                    />
                    <div className={styles.toggleContainer}>

                        <Toggle
                            messageIfChecked='Active'
                            messageIfNotChecked='Inactive'
                            checked={data.Status}
                            onChange={handleToggleChange}
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
                            />


                            <Checkbox
                                variant='button'
                                label='No'
                                checked={!data.Headquarters}
                                onChange={handleCheckboxChangeNo}
                            />

                        </div>
                    </div>

                    <TextArea
                        label="Description"
                        name="Description"
                        value={data.Description}
                        onChange={handleTextareaChange}
                        placeholder="Set your location and find beauty parlors that offer various personal care treatments"
                    />
                </div>
                <div className={styles.buttonContainer}>
                    <div className={styles.deleteButton}>
                        {
                            !isAdd &&
                            <Button label="Delete branch" onClick={handleDelete} size='small'
                                icon={
                                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.7637 4.67346L12.938 17.6342C12.938 18.3814 12.3523 18.9926 11.638 18.9926H4.55157C3.838 18.9926 3.25443 18.3814 3.25443 17.6342L2.42871 4.67346" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4.57129 4.21502L4.642 2.11233C4.642 1.50106 5.03986 1 5.52486 1H10.3406C10.8263 1 11.2227 1.50106 11.2227 2.11233L11.2927 4.21502" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M1 4.30613H15.8671" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M5.38863 7.61224L5.89792 16.5167" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M7.64371 10.551L7.928 16.4851" stroke="#E52D42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
                        <Button label="Cancel" onClick={onClose} noAppearance={true} size='small' />
                        <Button label={`${isAdd ? 'Add' : 'Save'}`} onClick={handleSave} size='small' />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AddEditModal;
