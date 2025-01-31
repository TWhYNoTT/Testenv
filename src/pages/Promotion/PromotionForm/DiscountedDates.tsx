import React from 'react';
import PromotionForm from './PromotionForm';
interface DiscountProps {
    handleBack: () => void
}
const DiscountedDates: React.FC<DiscountProps> = ({ handleBack }) => {
    const fields: any = [
        { type: 'dropdown', name: 'branch', label: 'Branch', options: ['All branches', 'Branch 1', 'Branch 2'] },
        { type: 'dropdown', name: 'dateRange', label: 'Date range', options: ['This week', 'This month'] },
        { type: 'number', name: 'discount', label: 'Discount', options: ['%'] },
    ];

    const handleSubmit = (formData: any) => {
        console.log('Discounted dates form submitted:', formData);

    };

    return (
        <PromotionForm
            title="Discounted dates"
            fields={fields}
            onSubmit={handleSubmit}
            handleBack={handleBack}
        />
    );
};

export default DiscountedDates;