import React, { useState } from 'react';
import CategoryCard from '../CategoryCard/CategoryCard';
import styles from './categories.module.css';

const categoriesData = [
    { title: 'Facials', image: './assets/images/categories/facials.png' },
    { title: 'Massage', image: './assets/images/categories/massage.png' },
    { title: 'Manicure pedicure', image: './assets/images/categories/manicure-pedicure.png' },
    { title: 'Hair', image: './assets/images/categories/hair.png' },
    { title: 'Waxing', image: './assets/images/categories/waxing.png' },
    { title: 'Make up', image: './assets/images/categories/make-up.png' },
];

const Categories: React.FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleCardClick = (title: string) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(title)
                ? prevSelected.filter((item) => item !== title)
                : [...prevSelected, title]
        );
    };

    return (
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
    );
};

export default Categories;