import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button/Button';
import Input from '../../../components/InputField/InputField';
import Dropdown from '../../../components/Dropdown/Dropdown';
import styles from './PromotionForm.module.css';
import { usePromotions } from '../../../hooks/usePromotions';
import { useBranches } from '../../../hooks/useBranches';
import { useServices } from '../../../hooks/useServices';
import { useToast } from '../../../contexts/ToastContext';
import { DiscountType, PromotionDto } from '../../../types/api-responses';
import { CreateServiceLevelPromoRequest, UpdateServiceLevelPromoRequest } from '../../../services/api';

interface ServiceLevelPromoProps {
    handleBack: () => void;
    editingPromotion?: PromotionDto | null;
    onSuccess?: () => void;
}

const ServiceLevelPromo: React.FC<ServiceLevelPromoProps> = ({ handleBack, editingPromotion, onSuccess }) => {
    const { createServiceLevelPromo, updateServiceLevelPromo, loading } = usePromotions();
    const { getBranches } = useBranches();
    const { getServices } = useServices();
    const { showToast } = useToast();

    const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
    const [services, setServices] = useState<{ id: number; name: string; branchId: number }[]>([]);
    const [filteredServices, setFilteredServices] = useState<{ id: number; name: string }[]>([]);

    const [formData, setFormData] = useState({
        branchId: editingPromotion?.branchId || undefined as number | undefined,
        serviceId: editingPromotion?.serviceId || undefined as number | undefined,
        minimumAmount: editingPromotion?.minimumAmount?.toString() || '',
        discountValue: editingPromotion?.discountValue?.toString() || '',
        discountType: editingPromotion?.discountType || DiscountType.Percentage,
        isActive: editingPromotion?.isActive ?? true
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [branchesResponse, servicesArray] = await Promise.all([
                    getBranches(),
                    getServices()
                ]);
                setBranches(branchesResponse.branches.map(b => ({ id: b.id, name: b.name })));
                setServices(servicesArray.map(s => ({ id: s.id, name: s.name, branchId: s.branchId })));
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, [getBranches, getServices]);

    useEffect(() => {
        if (formData.branchId) {
            const filtered = services.filter(s => s.branchId === formData.branchId);
            setFilteredServices(filtered);
        } else {
            setFilteredServices(services);
        }
    }, [formData.branchId, services]);

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.serviceId) {
            newErrors.serviceId = 'Please fill in all required fields.';
        }
        if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
            newErrors.discountValue = 'Please fill in all required fields.';
        }
        if (formData.discountType === DiscountType.Percentage && parseFloat(formData.discountValue) > 100) {
            newErrors.discountValue = 'Invalid input. Please check your entries.';
        }
        if (formData.minimumAmount && parseFloat(formData.minimumAmount) < 0) {
            newErrors.minimumAmount = 'Invalid input. Please check your entries.';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            showToast('Please fill in all required fields.', 'error');
        }
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (editingPromotion) {
                const updateData: UpdateServiceLevelPromoRequest = {
                    branchId: formData.branchId,
                    serviceId: formData.serviceId!,
                    minimumAmount: formData.minimumAmount ? parseFloat(formData.minimumAmount) : undefined,
                    discountValue: parseFloat(formData.discountValue),
                    discountType: formData.discountType,
                    isActive: formData.isActive
                };
                await updateServiceLevelPromo(editingPromotion.id, updateData);
                showToast('Promotion updated successfully.', 'success');
            } else {
                const createData: CreateServiceLevelPromoRequest = {
                    branchId: formData.branchId,
                    serviceId: formData.serviceId!,
                    minimumAmount: formData.minimumAmount ? parseFloat(formData.minimumAmount) : undefined,
                    discountValue: parseFloat(formData.discountValue),
                    discountType: formData.discountType
                };
                await createServiceLevelPromo(createData);
                showToast('Service Level Promo added successfully.', 'success');
            }
            onSuccess?.();
            handleBack();
        } catch (error) {
            console.error('Failed to save promotion:', error);
            showToast('Error adding promotion. Please try again.', 'error');
        }
    };

    const branchOptions = ['All branches', ...branches.map(b => b.name)];
    const serviceOptions = filteredServices.map(s => s.name);
    const discountTypeOptions = ['%', 'Fixed Amount'];

    const handleBranchChange = (value: string | string[]) => {
        const val = Array.isArray(value) ? value[0] : value;
        if (val === 'All branches') {
            setFormData({ ...formData, branchId: undefined, serviceId: undefined });
        } else {
            const branch = branches.find(b => b.name === val);
            setFormData({ ...formData, branchId: branch?.id, serviceId: undefined });
        }
    };

    const handleServiceChange = (value: string | string[]) => {
        const val = Array.isArray(value) ? value[0] : value;
        const service = filteredServices.find(s => s.name === val);
        setFormData({ ...formData, serviceId: service?.id });
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

    const getCurrentServiceName = () => {
        if (!formData.serviceId) return '';
        const service = services.find(s => s.id === formData.serviceId);
        return service?.name || '';
    };

    return (
        <div className={styles.promotionForm}>
            <div className={styles.bckBTNheader}>
                <svg onClick={handleBack} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backButton}>
                    <rect width="38" height="38" rx="14" fill="#DBD1F9" />
                    <path d="M23 12L16 19L23 26" stroke="#6138E0" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2 className='xH1'>{editingPromotion ? 'Edit' : 'Add'} Service Level Promo</h2>
            </div>

            <form className={styles.frm} onSubmit={handleSubmit}>
                <div className={styles.filedContainer}>
                    <Dropdown
                        defaultMessage="Select branch"
                        options={branchOptions}
                        value={getCurrentBranchName()}
                        onChange={handleBranchChange}
                    />

                    <Dropdown
                        defaultMessage="Select service"
                        options={serviceOptions}
                        value={getCurrentServiceName()}
                        onChange={handleServiceChange}
                    />
                    {errors.serviceId && <span className={styles.error}>{errors.serviceId}</span>}

                    <Input
                        type="number"
                        label="Minimum Amount (Optional)"
                        placeholder="Enter minimum purchase amount"
                        name="minimumAmount"
                        value={formData.minimumAmount}
                        onChange={(val) => setFormData({ ...formData, minimumAmount: val })}
                        feedback={errors.minimumAmount ? 'error' : undefined}
                        feedbackMessage={errors.minimumAmount}
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

export default ServiceLevelPromo;