import React from 'react';
import styles from './Step2.module.css';
import CategoryCard from '../../CategoryCard/CategoryCard';
import Checkbox from '../../Checkbox/Checkbox';

type Step2Props = {
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    selectedServiceType: string;
    setSelectedServiceType: React.Dispatch<React.SetStateAction<string>>;
};

const categoriesData = [
    { title: 'Facials', image: './assets/images/categories/facials.png' },
    { title: 'Massage', image: './assets/images/categories/massage.png' },
    { title: 'Manicure pedicure', image: './assets/images/categories/manicure-pedicure.png' },
    { title: 'Hair', image: './assets/images/categories/hair.png' },
    { title: 'Waxing', image: './assets/images/categories/waxing.png' },
    { title: 'Make up', image: './assets/images/categories/make-up.png' },
];

const Step2: React.FC<Step2Props> = ({ selectedCategories, setSelectedCategories, selectedServiceType, setSelectedServiceType }) => {
    const handleCardClick = (title: string) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(title)
                ? prevSelected.filter((item) => item !== title)
                : [...prevSelected, title]
        );
    };

    const handleServiceTypeChange = (value: string) => {
        setSelectedServiceType(value);
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className='headerText'>Business type</h2>
            <p className='descriptionText'>Do you offer services to:</p>
            <div className={styles.checkboxGroup}>
                <Checkbox
                    label="Men only"
                    checked={selectedServiceType === 'Men only'}
                    onChange={() => handleServiceTypeChange('Men only')}
                    variant="button"
                />
                <Checkbox
                    label="Women only"
                    checked={selectedServiceType === 'Women only'}
                    onChange={() => handleServiceTypeChange('Women only')}
                    variant="button"
                />
                <Checkbox
                    label="Everyone"
                    checked={selectedServiceType === 'Everyone'}
                    onChange={() => handleServiceTypeChange('Everyone')}
                    variant="button"
                />
            </div>
            <p className='descriptionText'>Categories</p>
            <div className={styles.categoriesGrid}>
                {categoriesData.map((category) => (
                    <CategoryCard
                        key={category.title}
                        title={category.title}
                        image={category.image}
                        selected={selectedCategories.includes(category.title)}
                        onClick={() => handleCardClick(category.title)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Step2;
