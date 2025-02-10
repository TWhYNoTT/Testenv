import React, { useState, useEffect, ChangeEvent } from "react";
import { useCategories } from "../../../hooks/useCategories";
import { useToast } from "../../../contexts/ToastContext";
import InputField from "../../../components/InputField/InputField";
import Button from "../../../components/Button/Button";
import styles from './AddEditCategory.module.css';

interface AddEditProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface CategoryEntry {
    name: string;
    image: File | null;
    error?: string;
    isSubmitting?: boolean;
}

const AddEditCategory: React.FC<AddEditProps> = ({ onClose, onSuccess, isOpen }) => {
    const [categories, setCategories] = useState<CategoryEntry[]>([
        { name: '', image: null }
    ]);
    const { requestCategory, loading } = useCategories();
    const { showToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleAddCategory = () => {
        setCategories([...categories, { name: '', image: null }]);
    };

    const handleCategoryChange = (index: number, field: 'name' | 'image', value: string | File | null) => {
        const newCategories = [...categories];
        if (field === 'name') {
            newCategories[index].name = value as string;
        } else {
            newCategories[index].image = value as File;
        }
        setCategories(newCategories);
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            handleCategoryChange(index, 'image', file);
        }
    };

    const handleDeleteCategory = (index: number) => {
        const newCategories = categories.filter((_, i) => i !== index);
        setCategories(newCategories);
    };

    const formatErrorMessage = (error: any) => {
        if (error.details && typeof error.details === 'object') {
            // Extract validation messages from the details object
            return Object.entries(error.details)
                .map(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        return messages[0]; // Take the first error message for each field
                    }
                    return messages;
                })
                .join(', ');
        }
        return error.message || 'An unknown error occurred';
    };

    const handleSubmit = async () => {
        const validCategories = categories.filter(cat => cat.name.trim());
        if (validCategories.length === 0) return;

        // Mark all valid categories as submitting
        setCategories(prev => prev.map(cat =>
            cat.name.trim() ? { ...cat, isSubmitting: true, error: undefined } : cat
        ));

        const results = await Promise.allSettled(
            validCategories.map(category =>
                requestCategory({
                    name: category.name,
                    image: category.image || undefined
                })
            )
        );

        // Process results and update categories
        const updatedCategories = [...categories];
        let successCount = 0;

        results.forEach((result, index) => {
            const categoryIndex = updatedCategories.findIndex(
                cat => cat.name === validCategories[index].name
            );

            if (result.status === 'fulfilled') {
                // Remove successful categories
                if (categoryIndex !== -1) {
                    updatedCategories.splice(categoryIndex, 1);
                }
                successCount++;
            } else {
                // Update failed categories with error message
                if (categoryIndex !== -1) {
                    const error = result.reason;
                    console.log('Full error response:', {
                        message: error.message,
                        response: error.response,
                        status: error.status,
                        details: error.details
                    });

                    updatedCategories[categoryIndex] = {
                        ...updatedCategories[categoryIndex],
                        isSubmitting: false,
                        error: formatErrorMessage(error)
                    };
                }
            }
        });

        setCategories(updatedCategories);

        // Show summary toast message
        if (successCount > 0) {
            showToast(`Successfully created ${successCount} categories`, 'success');
            if (successCount === validCategories.length) {
                await onSuccess();
                onClose();
            }
        }
    };

    return (
        <div className={`${styles.modalBackground} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContainer} ${isOpen ? styles.open : ''}`}>
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}>
                            <svg viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                            </svg>
                            <span>Creating categories...</span>
                        </div>
                    </div>
                )}
                <div className={styles.progressWrappar}>
                    <button onClick={onClose} className={styles.closeButton} >&times;</button>
                    <h2 className={`${styles.header} headerText`}>
                        Add category
                    </h2>
                </div>
                <div className={styles.headerCloseInputsContainer}>
                    {categories.map((category, index) => (
                        <div key={index} className={styles.categoryEntry}>
                            <div className={styles.categoryHeader}>
                                {categories.length > 1 && (
                                    <div className={styles.deleteButtonContainer}>
                                        <Button
                                            label="Delete"
                                            onClick={() => handleDeleteCategory(index)}
                                            noAppearance={true}
                                            backgroundColor="transparent"
                                            size="small"
                                            fontColor="#ff4444"
                                            icon={
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M7.08331 4.14167L7.26665 3.05001C7.39998 2.25834 7.49998 1.66667 8.90831 1.66667H11.0916C12.5 1.66667 12.6083 2.29167 12.7333 3.05834L12.9166 4.14167" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15.7084 7.61667L15.1667 16.0083C15.075 17.3167 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3167 4.83335 16.0083L4.29169 7.61667" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }
                                        />
                                    </div>
                                )}
                                <div className={styles.uploadphoto}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, index)}
                                        id={`categoryImage-${index}`}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor={`categoryImage-${index}`} style={{ cursor: 'pointer' }} className={styles.uploadphotolbl}>
                                        {category.image ? (
                                            <img
                                                className={styles.img}
                                                src={URL.createObjectURL(category.image)}
                                                alt="category preview"
                                            />
                                        ) : (
                                            <>
                                                <img className={styles.img} src="./assets/icons/uploadphoto1.png" alt="upload" />
                                                <span className={styles.desc}>Upload category photo</span>
                                            </>
                                        )}
                                    </label>
                                </div>

                            </div>
                            <InputField
                                label="Category name"
                                name={`categoryName-${index}`}
                                value={category.name}
                                onChange={(value) => handleCategoryChange(index, 'name', value)}
                                placeholder="Category name"
                                required
                            />
                            {category.error && (
                                <div className={styles.errorMessage}>
                                    {category.error}
                                </div>
                            )}
                            {category.isSubmitting && (
                                <div className={styles.submittingIndicator}>
                                    Submitting...
                                </div>
                            )}
                        </div>
                    ))}

                    <div className={styles.addBtn}>
                        <Button
                            label="Add category"
                            onClick={handleAddCategory}
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
                        <Button
                            label='Done'
                            size='medium'
                            onClick={handleSubmit}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditCategory;

