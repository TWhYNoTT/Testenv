import React, { useState, useEffect, useCallback } from 'react';
import Checkbox from '../Checkbox/Checkbox';
import Button from '../Button/Button';
import Modal from './Modal/Modal';
import styles from './BranchFilter.module.css';
import { useBranches } from '../../hooks/useBranches';
import { useToast } from '../../contexts/ToastContext';
import type { BranchDto } from '../../types/api-responses';

interface FilterBranch {
    id: number;
    name: string;
    city: string;
}

const BranchFilter: React.FC = () => {
    const { showToast } = useToast();
    const { getBranches, loading } = useBranches();

    const [allBranches, setAllBranches] = useState<FilterBranch[]>([]);
    const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    // Load branches on component mount
    const loadBranches = useCallback(async () => {
        try {
            const response = await getBranches();
            const mappedBranches: FilterBranch[] = response.branches
                .filter(branch => branch.active) // Only show active branches
                .map((branch: BranchDto) => ({
                    id: branch.id,
                    name: branch.name,
                    city: branch.city
                }));
            setAllBranches(mappedBranches);
        } catch (err) {
            showToast('Failed to load branches', 'error');
        }
    }, [getBranches, showToast]);

    useEffect(() => {
        loadBranches();
    }, [loadBranches]);

    const initialVisibleBranches = allBranches.slice(0, 7);
    const additionalBranches = allBranches.slice(7);

    const toggleBranch = (branchId: number) => {
        setSelectedBranches((prev) =>
            prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
        );
    };

    const selectAllBranches = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedBranches(allBranches.map(branch => branch.id));
        } else {
            setSelectedBranches([]);
        }
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    // Show loading state or no branches message
    if (loading) {
        return (
            <div className={styles.branchFilterContainer}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <span>Loading branches...</span>
                </div>
            </div>
        );
    }

    if (allBranches.length === 0) {
        return (
            <div className={styles.branchFilterContainer}>
                <div>No active branches available</div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.branchFilterContainer}>
                {initialVisibleBranches.map((branch) => (
                    <Checkbox
                        key={branch.id}
                        label={branch.name}
                        additionalText={branch.city}
                        checked={selectedBranches.includes(branch.id)}
                        onChange={() => toggleBranch(branch.id)}
                        variant="button"
                    />
                ))}
                {additionalBranches.length > 0 && (
                    <div className={styles.plusButton}>
                        <span className={styles.plusSpan}>+{additionalBranches.length} Branches</span>
                        <Button label="Filter" variant="primary" onClick={openModal} size='medium' />
                    </div>
                )}
            </div>
            <Modal isOpen={modalOpen} onClose={closeModal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Filter Branches</h2>
                    <h3 className={styles.modalTitleDesc}>Get accurate results by filtering out store branches</h3>
                </div>
                <div className={styles.modalBody}>
                    {allBranches.map((branch) => (
                        <Checkbox
                            key={branch.id}
                            label={`${branch.city}, ${branch.name}`}
                            checked={selectedBranches.includes(branch.id)}
                            onChange={() => toggleBranch(branch.id)}
                            variant="button"
                        />
                    ))}
                </div>
                <div className={styles.modalFooter}>
                    <Checkbox
                        label="Select All Branches"
                        checked={selectedBranches.length === allBranches.length}
                        onChange={() => selectAllBranches(selectedBranches.length !== allBranches.length)}
                        variant="button"
                    />
                    <div>
                        <Button label="Filter Branches" variant="primary" onClick={closeModal} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BranchFilter;