import React, { useState } from 'react';
import Button from '../../../components/Button/Button';
import Input from '../../../components/InputField/InputField';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Calendar from '../../../components/Calendar/Calendar';
import styles from './PromotionForm.module.css';
import { usePromotions } from '../../../hooks/usePromotions';
import { useToast } from '../../../contexts/ToastContext';
import { DiscountType, CouponCodeType, PromotionDto } from '../../../types/api-responses';
import { CreateCouponPromoRequest, UpdateCouponPromoRequest } from '../../../services/api';

interface CouponsAndCodesProps {
    handleBack: () => void;
    editingPromotion?: PromotionDto | null;
    onSuccess?: () => void;
}

const CouponsAndCodes: React.FC<CouponsAndCodesProps> = ({ handleBack, editingPromotion, onSuccess }) => {
    const { createCouponPromo, updateCouponPromo, loading } = usePromotions();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        couponName: editingPromotion?.couponName || '',
        couponQuantity: editingPromotion?.couponQuantity?.toString() || '',
        expiryDate: editingPromotion?.expiryDate ? new Date(editingPromotion.expiryDate) : undefined as Date | undefined,
        discountValue: editingPromotion?.discountValue?.toString() || '',
        discountType: editingPromotion?.discountType || DiscountType.Percentage,
        codeType: editingPromotion?.codeType || CouponCodeType.Alphanumeric,
        isActive: editingPromotion?.isActive ?? true
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const existingCouponCode = editingPromotion?.couponCode || null;

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.couponName || formData.couponName.trim().length === 0) {
            newErrors.couponName = 'Please fill in all required fields.';
        }
        if (!formData.couponQuantity || parseInt(formData.couponQuantity) <= 0) {
            newErrors.couponQuantity = 'Please fill in all required fields.';
        }
        if (!formData.expiryDate) {
            newErrors.expiryDate = 'Please fill in all required fields.';
        }
        if (formData.expiryDate && formData.expiryDate <= new Date()) {
            newErrors.expiryDate = 'Invalid input. Please check your entries.';
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
                const updateData: UpdateCouponPromoRequest = {
                    couponName: formData.couponName,
                    couponQuantity: parseInt(formData.couponQuantity),
                    expiryDate: formatDateForApi(formData.expiryDate!),
                    discountValue: parseFloat(formData.discountValue),
                    discountType: formData.discountType,
                    codeType: formData.codeType,
                    isActive: formData.isActive
                };
                await updateCouponPromo(editingPromotion.id, updateData);
                showToast('Promotion updated successfully.', 'success');
                onSuccess?.();
                handleBack();
            } else {
                const createData: CreateCouponPromoRequest = {
                    couponName: formData.couponName,
                    couponQuantity: parseInt(formData.couponQuantity),
                    expiryDate: formatDateForApi(formData.expiryDate!),
                    discountValue: parseFloat(formData.discountValue),
                    discountType: formData.discountType,
                    codeType: formData.codeType
                };
                const result = await createCouponPromo(createData);
                setGeneratedCode(result.couponCode);
                showToast('Coupon generated successfully.', 'success');
            }
        } catch (error) {
            console.error('Failed to save promotion:', error);
            showToast('Error generating coupon. Please try again.', 'error');
        }
    };

    const handleDone = () => {
        onSuccess?.();
        handleBack();
    };

    const discountTypeOptions = ['%', 'Fixed Amount'];
    const codeTypeOptions = ['Alphanumeric', 'Numeric'];

    const handleDiscountTypeChange = (value: string | string[]) => {
        const val = Array.isArray(value) ? value[0] : value;
        setFormData({
            ...formData,
            discountType: val === '%' ? DiscountType.Percentage : DiscountType.FixedAmount
        });
    };

    const handleCodeTypeChange = (value: string | string[]) => {
        const val = Array.isArray(value) ? value[0] : value;
        setFormData({
            ...formData,
            codeType: val === 'Alphanumeric' ? CouponCodeType.Alphanumeric : CouponCodeType.Numeric
        });
    };

    return (
        <div className={styles.promotionForm}>
            <div className={styles.bckBTNheader}>
                <svg onClick={handleBack} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backButton}>
                    <rect width="38" height="38" rx="14" fill="#DBD1F9" />
                    <path d="M23 12L16 19L23 26" stroke="#6138E0" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2 className='xH1'>{editingPromotion ? 'Edit' : 'Create'} Coupon</h2>
            </div>

            <form className={styles.frm} onSubmit={handleSubmit}>
                <div className={styles.filedContainer}>
                    <Input
                        type="text"
                        label="Coupon Name"
                        placeholder="Enter coupon name"
                        name="couponName"
                        value={formData.couponName}
                        onChange={(val) => setFormData({ ...formData, couponName: val })}
                        feedback={errors.couponName ? 'error' : undefined}
                        feedbackMessage={errors.couponName}
                    />

                    <Input
                        type="number"
                        label="Coupon Quantity"
                        placeholder="Enter quantity"
                        name="couponQuantity"
                        value={formData.couponQuantity}
                        onChange={(val) => setFormData({ ...formData, couponQuantity: val })}
                        feedback={errors.couponQuantity ? 'error' : undefined}
                        feedbackMessage={errors.couponQuantity}
                    />

                    <Calendar
                        label="Expiry Date"
                        value={formData.expiryDate ? 'dateselected' : 'Select a date'}
                        selectedDate={formData.expiryDate}
                        onDateChange={(date) => setFormData({ ...formData, expiryDate: date })}
                        startYear={new Date().getFullYear()}
                        endYear={new Date().getFullYear() + 5}
                        message={errors.expiryDate}
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

                    <Dropdown
                        defaultMessage="Code type"
                        options={codeTypeOptions}
                        value={formData.codeType === CouponCodeType.Alphanumeric ? 'Alphanumeric' : 'Numeric'}
                        onChange={handleCodeTypeChange}
                        disabled={!!editingPromotion}
                    />

                    {!generatedCode && !editingPromotion && (
                        <Button
                            label={loading ? 'Generating...' : 'Generate'}
                            type="submit"
                            variant="primary"
                            size='medium'
                            disabled={loading}
                        />
                    )}

                    {editingPromotion && (
                        <Button
                            label={loading ? 'Saving...' : 'Save'}
                            type="submit"
                            variant="primary"
                            size='medium'
                            disabled={loading}
                        />
                    )}
                </div>

                {/* Show generated code after creation */}
                {generatedCode && !editingPromotion && (
                    <div className={styles.generateCode}>
                        <div className={styles.generatedCode}>
                            <p>{formData.couponName}</p>
                            <span className='xH1'>{generatedCode}</span>
                            <p>Code generated successfully!</p>
                            <Button
                                label="Done"
                                onClick={handleDone}
                                variant="primary"
                                size='medium'
                            />
                        </div>
                    </div>
                )}

                {/* Show existing coupon code when editing - same position as generated code */}
                {editingPromotion && existingCouponCode && (
                    <div className={styles.generateCode}>
                        <div className={styles.generatedCode}>
                            <p>{formData.couponName}</p>
                            <span className='xH1'>{existingCouponCode}</span>
                            <p>Coupon Code</p>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CouponsAndCodes;