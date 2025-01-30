import React from 'react';
import PromotionForm from './PromotionForm';
interface ServiceProps {
    handleBack: () => void
}
const ServiceLevelPromo: React.FC<ServiceProps> = ({ handleBack }) => {
    const fields: any = [
        { type: 'dropdown', name: 'branch', label: 'Branch', options: ['All branches', 'Branch 1', 'Branch 2'] },
        { type: 'dropdown', name: 'service', label: 'Service', options: ['Haircut', 'Coloring', 'Styling'] },
        { type: 'number', name: 'amount', label: 'Amount' },
        { type: 'dropdown', name: 'discountType', label: 'Discount type', options: ['JOD', '%'] },
        { type: 'button', name: 'add', label: 'Add service' },
    ];

    const handleSubmit = (formData: any) => {
        console.log('Service level promo form submitted:', formData);

    };

    return (
        <PromotionForm
            title="Service level promo"
            fields={fields}
            onSubmit={handleSubmit}
            handleBack={handleBack}
        />
    );
};

export default ServiceLevelPromo;