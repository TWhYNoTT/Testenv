import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useServices } from '../../hooks/useServices';
import { useBranches } from '../../hooks/useBranches';
import { useToast } from '../../contexts/ToastContext';
import { Category } from '../../types/api-responses';
import { Service } from '../../services/api';
import SearchBar from '../../components/SearchBar/SearchBar';
import Button from '../../components/Button/Button';
import ServiceCard from './ServiceCard/ServiceCard';
import ServiceControls from './ServiceControls/ServiceControls'
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import styles from './Services.module.css';
import AddEditService from './AddEditService/AddEditService';
import AddEditCategory from './AddEditCategory/AddEditCategory';

const Services: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
    const [activeTap, setActiveTap] = useState<'services' | 'categories'>('services');
    const [businessCategories, setBusinessCategories] = useState<Category[]>([]);
    const [requestedCategories, setRequestedCategories] = useState<Category[]>([]);

    // Delete modal state - now handles both services and categories
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'service' | 'category'; item: Service | Category } | null>(null);

    // Category menu state
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const { getBusinessCategories, getMyRequestedCategories, removeCategoryFromBusiness } = useCategories();
    const { getServices, services, deleteService } = useServices();
    const { getBranches } = useBranches();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [branchMap, setBranchMap] = useState<Record<number, string>>({});

    const fetchCategories = useCallback(async () => {
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
    }, [getBusinessCategories, getMyRequestedCategories]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [, , branchesRes] = await Promise.all([
                fetchCategories(),
                getServices(),
                getBranches()
            ]);
            if (branchesRes && Array.isArray(branchesRes.branches)) {
                const map = Object.fromEntries(branchesRes.branches.map(b => [b.id, b.name]));
                setBranchMap(map);
            } else {
                setBranchMap({});
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchCategories, getServices, getBranches]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle click outside menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTapClick = (tap: 'services' | 'categories') => {
        setActiveTap(tap);
    };

    const handleAddService = () => {
        setEditingServiceId(null);
        setIsModalOpen(true);
    };

    const handleEditService = (serviceId: number) => {
        setEditingServiceId(serviceId);
        setIsModalOpen(true);
    };

    const handleAddCategorie = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingServiceId(null);
    };

    const handleSuccess = async () => {
        await fetchData();
    };

    // Service delete handlers
    const handleDeleteServiceClick = (serviceId: number) => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
            setItemToDelete({ type: 'service', item: service });
            setIsDeleteModalOpen(true);
        }
    };

    // Category menu and delete handlers
    const handleCategoryMenuClick = (categoryId: number) => {
        setOpenMenuId(openMenuId === categoryId ? null : categoryId);
    };

    const handleRemoveCategoryClick = (category: Category) => {
        setItemToDelete({ type: 'category', item: category });
        setIsDeleteModalOpen(true);
        setOpenMenuId(null);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            if (itemToDelete.type === 'service') {
                await deleteService(itemToDelete.item.id);
                showToast('Service deleted successfully', 'success');
                await fetchData();
            } else if (itemToDelete.type === 'category') {
                await removeCategoryFromBusiness(itemToDelete.item.id);
                showToast('Category removed successfully', 'success');
                await fetchCategories();
            }
        } catch (error) {
            console.error(`Error deleting ${itemToDelete.type}:`, error);
        } finally {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const getDeleteModalTitle = () => {
        if (!itemToDelete) return '';
        return itemToDelete.type === 'service' ? 'Service' : 'Category';
    };

    const getDeleteModalName = () => {
        if (!itemToDelete) return '';
        return itemToDelete.item.name;
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
                                id={service.id}
                                title={service.name}
                                category={service.categoryName || ''}
                                duration={`${service.minDuration} - ${service.maxDuration}`}
                                branch={branchMap[Number(service.branchId)] || ''}
                                image={service.imageUrl}
                                pricingOptions={service.pricingOptions.map(option => ({
                                    option: option.name,
                                    price: option.price,
                                    duration: option.duration
                                }))}
                                onEdit={handleEditService}
                                onDelete={handleDeleteServiceClick}
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
                                <div key={category.id} className={styles.card}>
                                    <div className={styles.categoryMenu} onClick={() => handleCategoryMenuClick(category.id)}>
                                        <svg className={styles.menuIcon} viewBox="0 0 6 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.54902 5.1C1.07843 5.1 0 4 0 2.6C0 1.1 1.07843 0 2.54902 0C3.92157 0 5 1.1 5 2.6C5 4 3.92157 5.1 2.54902 5.1Z" fill="#909FBA" />
                                            <path d="M2.54902 14.6C1.07843 14.6 0 13.4 0 12C0 10.6 1.07843 9.40002 2.54902 9.40002C3.92157 9.40002 5.09804 10.5 5.09804 12C5 13.4 3.92157 14.6 2.54902 14.6Z" fill="#909FBA" />
                                            <path d="M2.54902 24C1.07843 24 0 22.9 0 21.4C0 20 1.07843 18.8 2.54902 18.8C3.92157 18.8 5.09804 19.9 5.09804 21.4C5 22.9 3.92157 24 2.54902 24Z" fill="#909FBA" />
                                        </svg>
                                    </div>

                                    {openMenuId === category.id && (
                                        <div className={styles.categoryDropdownMenu} ref={menuRef}>
                                            <div className={styles.categoryDropdownItem} onClick={() => handleRemoveCategoryClick(category)}>
                                                <svg className={styles.icon} width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M14.4762 4.31384L13.5925 17.2745C13.5925 18.0109 13.0034 18.6 12.267 18.6H4.97663C4.24023 18.6 3.65111 18.0109 3.65111 17.2745L2.84106 4.31384" stroke="#DF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M5.19751 4.24017L5.27115 2.1046C5.27115 1.51548 5.71299 1 6.15483 1H11.0887C11.6042 1 11.9724 1.51548 11.9724 2.1046L12.046 4.24017" stroke="#DF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M1 4.24023H16.3172" stroke="#DF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M5.71289 7.18579L6.22837 16.1699" stroke="#DF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M8.21655 10.2051L8.51111 16.1699" stroke="#DF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span>Delete</span>
                                            </div>
                                        </div>
                                    )}

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

            {/* Service/Category Modals */}
            {isModalOpen && (
                activeTap === "services" ? (
                    <AddEditService
                        isOpen={isModalOpen}
                        onClose={handleClose}
                        onSuccess={handleSuccess}
                        editingServiceId={editingServiceId}
                    />
                ) : (
                    <AddEditCategory
                        isOpen={isModalOpen}
                        onClose={handleClose}
                        onSuccess={handleSuccess}
                    />
                )
            )}

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onDelete={handleConfirmDelete}
                branchName={`${getDeleteModalTitle()}: ${getDeleteModalName()}`}
            />
        </div>
    );
};

export default Services;