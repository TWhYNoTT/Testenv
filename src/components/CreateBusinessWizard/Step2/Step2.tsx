import React, { useEffect, useState } from 'react';
import styles from './Step2.module.css';
import CategoryCard from '../../../components/CategoryCard/CategoryCard';
import Checkbox from '../../../components/Checkbox/Checkbox';
import { ServiceType } from '../../../types/enums';
import { useCategories } from '../../../hooks/useCategories';

type Step2Props = {
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    selectedServiceType: ServiceType;
    setSelectedServiceType: React.Dispatch<React.SetStateAction<ServiceType>>;
    errors?: {
        categories?: string;
        serviceType?: string;
    };
};

interface Category {
    id: string;  // Change this to string to ensure consistency
    name: string;
    imageUrl: string;
}

const Step2: React.FC<Step2Props> = ({
    selectedCategories,
    setSelectedCategories,
    selectedServiceType,
    setSelectedServiceType,
    errors
}) => {
    const { getCategories, loading, error } = useCategories();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                // Transform the API response categories to match our local interface
                const transformedCategories = response.categories.map(cat => ({
                    id: String(cat.id),
                    name: cat.name,
                    imageUrl: cat.imageUrl
                }));
                setCategories(transformedCategories);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchCategories();
    }, []);

    const handleCardClick = (categoryId: string) => {
        console.log('Clicked category:', categoryId);
        const newCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];

        setSelectedCategories(newCategories);
    };

    const handleServiceTypeChange = (type: ServiceType) => {
        setSelectedServiceType(type);
    };

    if (loading) {
        return <div className={styles.loading}>Loading categories...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
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

            {errors?.serviceType && (
                <div className={styles.error}>{errors.serviceType}</div>
            )}

            <p className='descriptionText'>Categories</p>
            <div className={styles.categoriesGrid}>
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        title={category.name}
                        image={category.imageUrl}
                        selected={selectedCategories.includes(String(category.id))}
                        onClick={() => handleCardClick(String(category.id))}
                    />
                ))}
            </div>

            {errors?.categories && (
                <div className={styles.error}>{errors.categories}</div>
            )}
        </div>
    );
};

export default Step2;