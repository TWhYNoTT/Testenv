import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button/Button';
import Input from '../../../components/InputField/InputField';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Calendar from '../../../components/Calendar/Calendar';
import styles from './PromotionForm.module.css';
import { usePromotions } from '../../../hooks/usePromotions';
import { useBranches } from '../../../hooks/useBranches';
import { useToast } from '../../../contexts/ToastContext';
import { DiscountType, PromotionDto } from '../../../types/api-responses';
import { CreateDiscountedDatePromoRequest, UpdateDiscountedDatePromoRequest } from '../../../services/api';

interface DiscountedDatesProps {
    handleBack: () => void;
    editingPromotion?: PromotionDto | null;
    onSuccess?: () => void;
}

const DiscountedDates: React.FC<DiscountedDatesProps> = ({ handleBack, editingPromotion, onSuccess }) => {
    const { createDiscountedDatePromo, updateDiscountedDatePromo, loading } = usePromotions();
    const { getBranches } = useBranches();
    const { showToast } = useToast();

    const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
    const [formData, setFormData] = useState({
        branchId: editingPromotion?.branchId || undefined as number | undefined,
        startDate: editingPromotion?.startDate ? new Date(editingPromotion.startDate) : undefined as Date | undefined,
        endDate: editingPromotion?.endDate ? new Date(editingPromotion.endDate) : undefined as Date | undefined,
        discountValue: editingPromotion?.discountValue?.toString() || '',
        discountType: editingPromotion?.discountType || DiscountType.Percentage,
        isActive: editingPromotion?.isActive ?? true
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await getBranches();
                setBranches(response.branches.map(b => ({ id: b.id, name: b.name })));
            } catch (error) {
                console.error('Failed to fetch branches:', error);
            }
        };
        fetchBranches();
    }, [getBranches]);

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.startDate) {
            newErrors.startDate = 'Please fill in all required fields.';
        }
        if (!formData.endDate) {
            newErrors.endDate = 'Please fill in all required fields.';
        }
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
            newErrors.endDate = 'Invalid input. Please check your entries.';
        }
        if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
            newErrors.discountValue = 'Please fill in all required fields.';
        }
        if (formData.discountType === DiscountType.Percentage && parseFloat(formData.discountValue) > 100) {
            newErrors.discountValue = 'Invalid input. Please check your entries.';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            showToast('Please fill in all required fields.', 'error');
        }
        return Object.keys(newErrors).length === 0;
    };

    const formatDateForApi = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (editingPromotion) {
                const updateData: UpdateDiscountedDatePromoRequest = {
                    branchId: formData.branchId,
                    startDate: formatDateForApi(formData.startDate!),
                    endDate: formatDateForApi(formData.endDate!),
                    discountValue: parseFloat(formData.discountValue),
                    discountType: formData.discountType,
                    isActive: formData.isActive
                };
                await updateDiscountedDatePromo(editingPromotion.id, updateData);
                showToast('Promotion updated successfully.', 'success');
            } else {
                const createData: CreateDiscountedDatePromoRequest = {
                    branchId: formData.branchId,
                    startDate: formatDateForApi(formData.startDate!),
                    endDate: formatDateForApi(formData.endDate!),
                    discountValue: parseFloat(formData.discountValue),
                    discountType: formData.discountType
                };
                await createDiscountedDatePromo(createData);
                showToast('Discounted Dates Promo added successfully.', 'success');
            }
            onSuccess?.();
            handleBack();
        } catch (error) {
            console.error('Failed to save promotion:', error);
            showToast('Error adding promotion. Please try again.', 'error');
        }
    };

    const branchOptions = ['All branches', ...branches.map(b => b.name)];
    const discountTypeOptions = ['%', 'Fixed Amount'];

    const handleBranchChange = (value: string | string[]) => {
        const val = Array.isArray(value) ? value[0] : value;
        if (val === 'All branches') {
            setFormData({ ...formData, branchId: undefined });
        } else {
            const branch = branches.find(b => b.name === val);
            setFormData({ ...formData, branchId: branch?.id });
        }
    };

    const handleDiscountTypeChange = (value: string | string[]) => {
        const val = Array.isArray(value) ? value[0] : value;
        setFormData({
            ...formData,
            discountType: val === '%' ? DiscountType.Percentage : DiscountType.FixedAmount
        });
    };

    const getCurrentBranchName = () => {
        if (!formData.branchId) return 'All branches';
        const branch = branches.find(b => b.id === formData.branchId);
        return branch?.name || 'All branches';
    };

    return (
        <div className={styles.promotionForm}>
            <div className={styles.bckBTNheader}>
                <svg onClick={handleBack} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backButton}>
                    <rect width="38" height="38" rx="14" fill="#DBD1F9" />
                    <path d="M23 12L16 19L23 26" stroke="#6138E0" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2 className='xH1'>{editingPromotion ? 'Edit' : 'Add'} Discounted Dates</h2>
            </div>

            <form className={styles.frm} onSubmit={handleSubmit}>
                <div className={styles.filedContainer}>
                    <Dropdown
                        defaultMessage="Select branch"
                        options={branchOptions}
                        value={getCurrentBranchName()}
                        onChange={handleBranchChange}
                    />

                    <Calendar
                        label="Start Date"
                        value={formData.startDate ? 'dateselected' : 'Select a date'}
                        selectedDate={formData.startDate}
                        onDateChange={(date) => setFormData({ ...formData, startDate: date })}
                        startYear={new Date().getFullYear()}
                        endYear={new Date().getFullYear() + 5}
                        message={errors.startDate}
                        leftAligned={false}
                        noBorderRadius={true}
                    />

                    <Calendar
                        label="End Date"
                        value={formData.endDate ? 'dateselected' : 'Select a date'}
                        selectedDate={formData.endDate}
                        onDateChange={(date) => setFormData({ ...formData, endDate: date })}
                        startYear={new Date().getFullYear()}
                        endYear={new Date().getFullYear() + 5}
                        message={errors.endDate}
                        leftAligned={false}
                        noBorderRadius={true}
                    />

                    <Dropdown
                        defaultMessage="Discount type"
                        options={discountTypeOptions}
                        value={formData.discountType === DiscountType.Percentage ? '%' : 'Fixed Amount'}
                        onChange={handleDiscountTypeChange}
                    />

                    <Input
                        type="number"
                        label="Discount Value"
                        placeholder="Enter discount value"
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={(val) => setFormData({ ...formData, discountValue: val })}
                        unit={formData.discountType === DiscountType.Percentage ? '%' : ''}
                        feedback={errors.discountValue ? 'error' : undefined}
                        feedbackMessage={errors.discountValue}
                    />

                    <Button
                        label={loading ? 'Saving...' : (editingPromotion ? 'Save' : 'Apply')}
                        type="submit"
                        variant="primary"
                        size='medium'
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
};

export default DiscountedDates;