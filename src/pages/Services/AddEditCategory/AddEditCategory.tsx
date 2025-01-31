import React from "react";
import InputField from "../../../components/InputField/InputField";

import Button from "../../../components/Button/Button";



import styles from './AddEditCategory.module.css';




interface AddEditProps {
    isOpen: boolean;
    onClose: () => void;

}



const AddEditCategory: React.FC<AddEditProps> = ({ onClose, isOpen }) => {








    return (
        <div className={`${styles.modalBackground} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContainer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.progressWrappar}>
                    <button onClick={onClose} className={styles.closeButton} >&times;</button>

                    <h2 className={`${styles.header} headerText`}>
                        Add category

                    </h2>
                </div>
                <div className={styles.headerCloseInputsContainer}>

                    <div className={styles.uploadphoto}>
                        <img className={styles.img} src="./assets/icons/uploadphoto1.png" alt="upload" />
                        <span className={styles.desc}>Upload category photo</span>
                    </div>

                    <InputField
                        label="Category name"
                        name="categoryName"
                        placeholder="Category name"
                    />
                    <div className={styles.addBtn}>
                        <Button
                            label="Add category"
                            noAppearance={true}
                            backgroundColor="transparent"
                            iconPosition="left"
                            size="medium"
                            fontColor="#6138e0"
                            icon={
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0753 19L9.92529 1" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M1 10.075L19 9.92505" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>


                            }
                        />
                    </div>
                    <div className={styles.buttonContainer}>

                        <Button label='Back' size='medium' noAppearance={true} variant='disabled' />
                        <Button label='Done' size='medium' />

                    </div>
                </div>
            </div>
        </div >
    );
};

export default AddEditCategory;

