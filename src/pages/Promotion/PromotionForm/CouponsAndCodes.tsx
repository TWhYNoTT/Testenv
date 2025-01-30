import React from 'react';
import PromotionForm from './PromotionForm';
interface CouponProps {
    handleBack: () => void
}
const CouponsAndCodes: React.FC<CouponProps> = ({ handleBack }) => {

    const fields: any = [
        { type: 'text', name: 'couponName', label: 'Coupon name' },
        { type: 'number', name: 'couponQty', label: 'Coupon QTY' },
        { type: 'text', name: 'expiryDate', label: 'Expiry date' },
        { type: 'number', name: 'discountType', label: 'Discount', options: ['%'] },
        { type: 'dropdown', name: 'codeType', label: 'Code type', options: ['Alphanumeric', 'Numeric'] },
    ];

    const handleSubmit = (formData: any) => {
        console.log('Coupon form submitted:', formData);

    };

    const generateCode = () => {

        return Math.random().toString(36).substr(2, 6).toUpperCase();
    };

    return (
        <PromotionForm
            title="Coupons and codes"
            fields={fields}
            onSubmit={handleSubmit}
            generateCode={generateCode}
            handleBack={handleBack}
        />
    );
};

export default CouponsAndCodes;