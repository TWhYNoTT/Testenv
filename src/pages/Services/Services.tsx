import React, { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useServices } from '../../hooks/useServices';
import { Category } from '../../types/api-responses';
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
    const [businessCategories, setBusinessCategories] = useState<Category[]>([]);
    const [requestedCategories, setRequestedCategories] = useState<Category[]>([]);
    const { getBusinessCategories, getMyRequestedCategories } = useCategories();
    const { getServices, services } = useServices();
    const [isLoading, setIsLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const [businessCats, requestedCats] = await Promise.all([
                getBusinessCategories(),
                getMyRequestedCategories()
            ]);
            setBusinessCategories(businessCats.categories);
            setRequestedCategories(requestedCats.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchCategories(),
                getServices()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTapClick = (tap: 'services' | 'categories') => {
        setActiveTap(tap);
    };

    const handleAddService = () => {
        setIsModalOpen(true);
    };
    const handleAddCategorie = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleSuccess = async () => {
        await fetchData(); // Only refetch when operation was successful
    };

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

            {activeTap === "services" && (
                <div className={styles.servicesListContainer}>
                    {isLoading && (
                        <div className={styles.loadingOverlay}>
                            <div className={styles.spinner}>
                                <svg viewBox="0 0 50 50">
                                    <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                </svg>
                                <span>Loading data...</span>
                            </div>
                        </div>
                    )}
                    <div className={styles.servicesList}>
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id}
                                title={service.name}
                                category={service.categoryName || ''}
                                duration={`${service.minDuration} - ${service.maxDuration}`}
                                branch="Marina branch"
                                image={service.imageUrl}
                                pricingOptions={service.pricingOptions.map(option => ({
                                    option: option.name,
                                    price: option.price,
                                    duration: option.duration
                                }))}
                            />
                        ))}
                    </div>
                </div>
            )}

            {activeTap === "categories" && (
                <div className={styles.categoriesContainer}>
                    {isLoading && (
                        <div className={styles.loadingOverlay}>
                            <div className={styles.spinner}>
                                <svg viewBox="0 0 50 50">
                                    <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                </svg>
                                <span>Loading data...</span>
                            </div>
                        </div>
                    )}
                    <div className={styles.addedCategories}>
                        <h3 className={styles.h3}>Added categories</h3>
                        <div className={styles.cardsContainer}>
                            {businessCategories.map((category) => (
                                <div key={Math.random()} className={styles.card}>
                                    <img
                                        className={styles.img}
                                        src={category.imageUrl}
                                        alt={category.name}
                                    />
                                    <span className={styles.categoryName}>{category.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.pendingCategories}>
                        <h3 className={styles.h3}>Pending for approval</h3>
                        <div className={styles.cardsContainer}>
                            {requestedCategories.map((category) => (
                                <div key={category.id} className={styles.card}>
                                    <img
                                        className={styles.img}
                                        src={category.imageUrl}
                                        alt={category.name}
                                    />
                                    <span className={styles.categoryName}>{category.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                activeTap === "services" ? (
                    <AddEditService
                        isOpen={isModalOpen}
                        onClose={handleClose}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <AddEditCategory
                        isOpen={isModalOpen}
                        onClose={handleClose}
                        onSuccess={handleSuccess}
                    />
                )
            )}
        </div>
    );
};

export default Services;