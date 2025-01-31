import React from 'react';
import styles from './categorycard.module.css';

interface CategoryCardProps {
    image: string;
    title: string;
    selected: boolean;
    onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ image, title, selected, onClick }) => {
    return (
        <div className={`${styles.categoryCard} ${selected ? styles.selected : styles.unselected}`} onClick={onClick}>
            <img src={image} alt={title} className={styles.categoryImage} />
            <div className={styles.categoryTitleContainer}>
                <h3 className={styles.categoryTitle}>{title}</h3>
            </div>
            {selected && (
                <div className={styles.checkmark}>
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.checkmarkIcon}>
                        <path d="M14.58 29.16C22.6323 29.16 29.16 22.6323 29.16 14.58C29.16 6.52769 22.6323 0 14.58 0C6.52769 0 0 6.52769 0 14.58C0 22.6323 6.52769 29.16 14.58 29.16Z" fill="#1BD43D" />
                        <path d="M19.6426 10.9641C17.306 13.3748 14.9695 15.7855 12.633 18.1963C11.6205 17.1516 10.608 16.107 9.51758 14.9016" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default CategoryCard;
