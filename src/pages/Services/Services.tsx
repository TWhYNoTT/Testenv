import React, { useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import Button from '../../components/Button/Button';
import ServiceCard from './ServiceCard/ServiceCard';
import ServiceControls from './ServiceControls/ServiceControls'
import styles from './Services.module.css';
import AddEditService from './AddEditService/AddEditService';
import AddEditCategory from './AddEditCategory/AddEditCategory';

const Services: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTap, setActiveTap] = useState<'services' | 'categories'>('services');

    const handleTapClick = (tap: 'services' | 'categories') => {
        setActiveTap(tap);
    };

    const handleAddService = () => {
        setIsModalOpen(true);
    };
    const handleAddCategorie = () => {
        setIsModalOpen(true);
    };


    const servicesData = [
        {
            title: 'Permanent Hair Colour',
            category: 'Hairstyling',
            duration: '1h 15min - 1h 35min',
            branch: 'Marina branch',
            image: './assets/images/services/hair.png',
            pricingOptions: [
                { option: 'Black', price: 120, duration: '35min' },
                { option: 'Pink', price: 90, duration: '35min' },
                { option: 'Red', price: 80, duration: '35min' },
            ],
        },
        {
            title: 'Nail treatments',
            category: 'Manicure pedicure',
            duration: '1h 15min - 1h 35min',
            branch: 'Marina branch',
            image: './assets/images/services/nails.png',
            pricingOptions: [
                { option: 'Standard', price: 100, duration: '30min' },
                { option: 'Deluxe', price: 150, duration: '45min' },
            ],
        },
    ];



    return (
        <div className={styles.servicesPage}>
            <div className={styles.header}>
                <h1 className='xH1'>Services</h1>
                {activeTap === "services" &&
                    <Button
                        label="Add service +"
                        variant="primary"
                        size="medium"
                        onClick={handleAddService}
                    />}
                {activeTap === "categories" &&
                    <Button
                        label="Add categorie +"
                        variant="primary"
                        size="medium"
                        onClick={handleAddCategorie}
                    />}
            </div>

            <div className={styles.filters}>
                <div className={styles.searchSection}>
                    <SearchBar icon={<img src="./assets/icons/magnifier.png" alt="magnifier" />} placeholder="Search service name, category..." />
                </div>
                <ServiceControls />
            </div>
            <div className={styles.tapsContainer}>
                <div className={styles.taps}>
                    <div
                        className={`${styles.tap} ${activeTap === 'services' ? styles.active : ''}`}
                        onClick={() => handleTapClick('services')}
                    >
                        Services
                    </div>
                    <div
                        className={`${styles.tap} ${activeTap === 'categories' ? styles.active : ''}`}
                        onClick={() => handleTapClick('categories')}
                    >
                        Categories
                    </div>
                </div>
                <div
                    className={`${styles.activeLine} ${activeTap === 'services' ? styles.servicesLine : styles.categoriesLine}`}
                />
            </div>

            {activeTap === "services" && <>
                <div className={styles.servicesList}>
                    {servicesData.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>
                {isModalOpen && (
                    <AddEditService

                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </>
            }
            {activeTap === "categories" && <>

                <div className={styles.categoriesContainer}>
                    <div className={styles.addedCategories}>
                        <h3 className={styles.h3}>Added categories</h3>

                        <div className={styles.cardsContainer}>
                            <div className={styles.card}>
                                <img className={styles.img} src="./assets/images/categories/facials.png" alt="facials" />
                                <span className={styles.categoryName}>Facials</span>
                            </div>

                            <div className={styles.card}>
                                <img className={styles.img} src="./assets/images/categories/manicure-pedicure.png" alt="facials" />
                                <span className={styles.categoryName}>Manicure pedicure</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.pendingCategories}>
                        <h3 className={styles.h3}>Pending for approval</h3>
                        <div className={styles.cardsContainer}>
                            <div className={styles.card}>
                                <img className={styles.img} src="./assets/images/categories/hairtranspaplants.png" alt="hair transpaplants" />
                                <span className={styles.categoryName}>Hair transpaplants</span>
                            </div>
                        </div>
                    </div>
                </div>
                {isModalOpen && (

                    <AddEditCategory

                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </>
            }
        </div>
    );
};

export default Services;