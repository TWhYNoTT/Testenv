import React, { useState } from 'react';
import Checkbox from '../Checkbox/Checkbox';
import Button from '../Button/Button';
import Modal from './Modal/Modal';
import styles from './BranchFilter.module.css';

const allBranches = [
    { id: 1, name: 'Devanza', city: 'Dubai' },
    { id: 2, name: 'Devanza', city: 'Abu Dhabi' },
    { id: 3, name: 'Devanza', city: 'Dubai' },
    { id: 4, name: 'Devanza', city: 'Jordan, Amman' },
    { id: 5, name: 'Devanza', city: 'Germany' },
    { id: 6, name: 'Devanza', city: 'Dubai' },
    { id: 7, name: 'Devanza', city: 'Dubai' },
    { id: 8, name: 'Branch 1', city: 'City 1' },
    { id: 9, name: 'Branch 2', city: 'City 2' },
    { id: 10, name: 'Branch 3', city: 'City 3' },
    { id: 11, name: 'Branch 4', city: 'City 4' },
    { id: 12, name: 'Branch 5', city: 'City 5' },
    { id: 13, name: 'Branch 6', city: 'City 6' },
    { id: 14, name: 'Branch 7', city: 'City 7' },
    { id: 15, name: 'Branch 8', city: 'City 8' },
    { id: 16, name: 'Branch 9', city: 'City 9' },
    { id: 17, name: 'Branch 10', city: 'City 10' },
    { id: 18, name: 'Branch 11', city: 'City 11' },
    { id: 19, name: 'Branch 12', city: 'City 12' },
];

const BranchFilter: React.FC = () => {
    const initialVisibleBranches = allBranches.slice(0, 7);
    const additionalBranches = allBranches.slice(7);


    const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

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
                <div className={styles.plusButton}>
                    <span className={styles.plusSpan}>+{additionalBranches.length} Branches</span>

                    <Button label="Filter" variant="primary" onClick={openModal} size='medium' />

                </div>
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
