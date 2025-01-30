import React from 'react';
import styles from './Step2.module.css';
import CategoryCard from '../../CategoryCard/CategoryCard';
import Checkbox from '../../Checkbox/Checkbox';
import { ServiceType } from '../../../types/enums';
import { CategoryResponse } from '../../../types/business';

interface Step2Props {
    selectedCategories: number[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;
    selectedServiceType: ServiceType;
    setSelectedServiceType: React.Dispatch<React.SetStateAction<ServiceType>>;
    categories: CategoryResponse[];
    isLoading: boolean;
}

const Step2: React.FC<Step2Props> = ({
    selectedCategories,
    setSelectedCategories,
    selectedServiceType,
    setSelectedServiceType,
    categories,
    isLoading
}) => {
    const handleCardClick = (categoryId: number) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter((id) => id !== categoryId)
                : [...prevSelected, categoryId]
        );
    };

    const handleServiceTypeChange = (serviceType: ServiceType) => {
        setSelectedServiceType(serviceType);
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading categories...</div>;
    }

    return (
        <div className={styles.stepContainer}>
            <h2 className='headerText'>Business type</h2>
            <p className='descriptionText'>Do you offer services to:</p>

            <div className={styles.checkboxGroup}>
                <Checkbox
                    label="Men only"
                    checked={selectedServiceType === ServiceType.MenOnly}
                    onChange={() => handleServiceTypeChange(ServiceType.MenOnly)}
                    variant="button"
                />
                <Checkbox
                    label="Women only"
                    checked={selectedServiceType === ServiceType.WomenOnly}
                    onChange={() => handleServiceTypeChange(ServiceType.WomenOnly)}
                    variant="button"
                />
                <Checkbox
                    label="Everyone"
                    checked={selectedServiceType === ServiceType.Everyone}
                    onChange={() => handleServiceTypeChange(ServiceType.Everyone)}
                    variant="button"
                />
            </div>

            <p className='descriptionText'>Categories</p>
            <div className={styles.categoriesGrid}>
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        title={category.name}
                        image={category.imageUrl || '/placeholder-image.png'}
                        selected={selectedCategories.includes(category.id)}
                        onClick={() => handleCardClick(category.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Step2;