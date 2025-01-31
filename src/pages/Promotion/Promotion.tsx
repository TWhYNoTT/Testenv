import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';

import Toggle from '../../components/Toggle/Toggle';
import styles from './Promotion.module.css';
import CouponsAndCodes from './PromotionForm/CouponsAndCodes';
import DiscountedDates from './PromotionForm/DiscountedDates';
import ServiceLevelPromo from './PromotionForm/ServiceLevelPromo';

type PromotionType = 'Discounted dates' | 'Service level promo' | 'Coupons and codes';

interface IPromotion {
    Name: string;
    Type: PromotionType;
    Information: string;
    Status: boolean;
    originalIndex: number;
}

const Promotion: React.FC = () => {
    const [selectedPromotion, setSelectedPromotion] = useState<PromotionType | null>(null);

    const renderPromotionForm = () => {
        switch (selectedPromotion) {
            case 'Coupons and codes':
                return <CouponsAndCodes handleBack={BackButton} />;
            case 'Discounted dates':
                return <DiscountedDates handleBack={BackButton} />;
            case 'Service level promo':
                return <ServiceLevelPromo handleBack={BackButton} />;
            default:
                return null;
        }
    };
    const BackButton = () => {
        setSelectedPromotion(null);
    };



    const headers = ['Name', 'Type', 'Information', 'Status', ''];
    const initialData: IPromotion[] = [
        { Name: 'Christmas sales', Type: 'Discounted dates', Information: '20% off November 11- December 11, 2021', Status: true, originalIndex: 0 },
        { Name: 'Hair cut bonanza', Type: 'Service level promo', Information: '200 AED off', Status: true, originalIndex: 1 },
        { Name: 'Valentines day', Type: 'Coupons and codes', Information: '30% off - code: 123h134', Status: false, originalIndex: 2 },
    ];

    const [promotions, setPromotions] = useState(initialData);
    const [filteredPromotions, setFilteredPromotions] = useState(initialData);



    const handleStatusChange = (index: number, value: boolean) => {
        const updatedPromotions = [...promotions];
        updatedPromotions[index].Status = value;
        setPromotions(updatedPromotions);
        setFilteredPromotions(updatedPromotions);
    };

    const handleEditClick = (index: number) => {

    };

    const handleDeleteClick = (index: number) => {

    };

    const customRenderers = {
        Status: (value: boolean, rowIndex: number) => (
            <Toggle
                checked={value}
                onChange={(val) => handleStatusChange(rowIndex, val)}
                messageIfChecked="Active"
                messageIfNotChecked="Inactive"
            />
        ),
        '': (_: any, rowIndex: number) => (
            <div className={styles.tableButtonContainer}>
                <Button label="Delete" onClick={() => handleDeleteClick(rowIndex)} noAppearance={true} backgroundColor="transparent" fontColor="red" />
                <Button label="Edit" onClick={() => handleEditClick(rowIndex)} noAppearance={true} backgroundColor="transparent" fontColor="var(--color-primary)" />
            </div>
        )
    };

    return (
        <>
            {selectedPromotion ? (
                renderPromotionForm()
            ) : (
                <div className={styles.promotionPage}>
                    <h2 className="xH1">Promotions</h2>

                    <div className={styles.promotionTypes}>
                        <div className={styles.promotionCard} onClick={() => setSelectedPromotion('Discounted dates')}>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.2666 16.8899V13" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M23.7335 16.8899V13" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <rect width="40" height="40" rx="14" fill="#D8CCFE" />
                                <path d="M27 14.7437C27.5333 14.7437 28 15.2802 28 15.8838V26.011C28 26.7487 27.5333 27.2853 26.9333 27.2853H13.0667C12.4667 27.2853 12 26.6817 12 26.011V15.8838C12 15.2131 12.4667 14.7437 13 14.7437H27V14.7437Z" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.2666 19.4385H27.7333" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div className={styles.details}>
                                <h3>Discounted dates</h3>
                                <p>Apply duration discounts</p>
                            </div>
                        </div>
                        <div className={styles.promotionCard} onClick={() => setSelectedPromotion('Service level promo')}>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="14" fill="#D8CCFE" />
                                <path d="M16.491 20.525C16.491 19.9133 16.491 19.3016 16.5675 18.6899C16.7969 17.0842 17.3321 15.6314 18.2496 14.2551C18.7084 13.6434 19.2436 13.0317 19.8553 12.573C19.9318 12.4965 20.0083 12.4965 20.0847 12.573C20.9258 13.3376 21.6139 14.1022 22.1492 15.0962C22.7609 16.2431 23.1432 17.4665 23.2961 18.7664C23.3726 19.1487 23.3726 19.531 23.3726 19.7604C23.3726 20.0662 23.3726 20.372 23.2961 20.6779" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17.5615 21.5187C18.8613 23.0479 19.5495 24.7301 19.7789 26.5652C19.8553 27.1769 19.7789 27.865 19.7024 28.4767C19.626 28.859 19.626 28.859 19.3201 28.859C17.638 28.7826 16.1087 28.2473 14.7324 27.3298C13.7384 26.6416 12.8973 25.7241 12.2092 24.7301C11.4446 23.5067 10.9093 22.1304 10.8329 20.6776C10.7564 19.9895 10.8329 19.3013 10.9093 18.5367C10.9093 18.4603 10.9858 18.3838 11.0623 18.3838C12.0563 18.3838 13.0503 18.5367 13.9678 18.919C15.0383 19.3778 16.0323 19.9895 16.8733 20.8306C17.1792 21.1364 17.4086 21.3658 17.5615 21.5187Z" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M26.8133 25.8006C25.437 27.2533 23.9078 28.2473 22.0727 28.6296C21.461 28.7826 20.8493 28.7826 20.1612 28.7826C19.7789 28.7826 19.7789 28.7826 19.7789 28.4003C19.6259 26.7181 19.9318 25.1889 20.6964 23.6596C21.2316 22.5892 21.9962 21.6716 22.9138 20.8306C24.0607 19.913 25.2841 19.2249 26.7369 18.919C27.425 18.7661 28.1132 18.7661 28.8013 18.7661C28.8778 18.7661 28.9542 18.8426 28.9542 18.919C29.0307 19.913 29.0307 20.907 28.8013 21.901C28.4955 23.048 28.0367 24.1184 27.3485 25.036C27.1956 25.4183 26.9662 25.6476 26.8133 25.8006Z" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            <div className={styles.details}>
                                <h3>Service level promo</h3>
                                <p>Set discounts based on per service</p>
                            </div>
                        </div>
                        <div className={styles.promotionCard} onClick={() => setSelectedPromotion('Coupons and codes')}>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="14" fill="#D8CCFE" />
                                <path d="M16.2149 23.8746L23.7755 16.2686" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0179 18.7192C17.9122 18.7192 18.6439 17.9831 18.6439 17.0835C18.6439 16.1838 17.9122 15.4478 17.0179 15.4478C16.1236 15.4478 15.392 16.1838 15.392 17.0835C15.392 17.9831 16.1236 18.7192 17.0179 18.7192Z" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.1218 24.8603C24.0161 24.8603 24.7477 24.1242 24.7477 23.2246C24.7477 22.3249 24.0161 21.5889 23.1218 21.5889C22.2275 21.5889 21.4958 22.3249 21.4958 23.2246C21.4958 24.1242 22.2275 24.8603 23.1218 24.8603Z" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M30.2186 18.8248C29.485 18.2713 28.7514 17.81 28.0178 17.2565C27.651 16.9797 27.5593 16.703 27.651 16.334C27.8344 15.3192 28.0178 14.3045 28.1095 13.4742C28.1095 12.3672 27.4676 11.8137 26.6423 11.9059C25.7253 11.9982 24.7166 12.1827 23.7996 12.3672C23.3411 12.4594 23.066 12.2749 22.7909 11.9059C22.3324 11.1679 21.7822 10.4299 21.232 9.69189C20.5901 8.76937 19.4897 8.76937 18.8478 9.69189C18.2976 10.4299 17.7474 11.0757 17.2889 11.8137C17.0138 12.2749 16.7387 12.4594 16.1885 12.3672C15.3632 12.1827 14.4462 11.9982 13.6209 11.9059C12.3371 11.7214 11.6035 12.3672 11.8786 13.7509C12.062 14.5812 12.1537 15.5037 12.3371 16.334C12.4288 16.7952 12.3371 17.072 11.9703 17.2565C11.2367 17.81 10.5031 18.2713 9.76947 18.8248C8.76076 19.5628 8.76076 20.5776 9.76947 21.3156C10.5031 21.8691 11.2367 22.3303 11.8786 22.8838C12.2454 23.1606 12.4288 23.4373 12.3371 23.8986C12.1537 24.8211 11.9703 25.7436 11.8786 26.7584C11.7869 27.7732 12.5205 28.4189 13.4375 28.2344C14.3545 28.0499 15.2715 27.9577 16.2802 27.7732C16.7387 27.6809 17.0138 27.7732 17.2889 28.1422C17.8391 28.8802 18.2976 29.6182 18.8478 30.3562C19.5814 31.371 20.5901 31.371 21.3237 30.3562C21.8739 29.6182 22.4241 28.8802 22.8826 28.1422C23.066 27.7732 23.3411 27.6809 23.7996 27.7732C24.6249 27.9577 25.5419 28.0499 26.3672 28.2344C27.7427 28.5112 28.4763 27.7732 28.2012 26.3894C28.0178 25.5591 27.9261 24.6366 27.7427 23.8064C27.651 23.3451 27.7427 23.1606 28.1095 22.8838C28.8431 22.3303 29.5767 21.8691 30.3103 21.3156C31.2273 20.5776 31.2273 19.5628 30.2186 18.8248Z" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div className={styles.details}>
                                <h3>Coupons and codes</h3>
                                <p>Generate coupon codes</p>
                            </div>
                        </div>
                    </div>


                    <Table headers={headers} data={filteredPromotions} customRenderers={customRenderers} />
                </div >
            )}

        </>
    );
};

export default Promotion;