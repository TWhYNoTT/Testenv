import React, { useState, useEffect, useCallback } from 'react';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import Toggle from '../../components/Toggle/Toggle';
import BranchAddEditModal from '../../components/BranchAddEditModal/BranchAddEditModal';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import styles from './Branches.module.css';
import { useNavigate } from 'react-router-dom';
import { useBranches } from '../../hooks/useBranches';
import { useToast } from '../../contexts/ToastContext';
import type { BranchDto } from '../../types/api-responses';

interface BranchTableData {
    Branch: string;
    Location: string;
    'Date joined': string;
    Status: boolean;
    originalIndex: number;
    id: number;
    primaryHeadQuarter: boolean;
    description: string;
    // New expanded address fields
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    phoneNumber: string;
    latitude?: number;
    longitude?: number;
}

const Branches: React.FC = () => {
    const headers = ['Branch', 'Location', 'Date joined', 'Status', ''];
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { getBranches, createBranch, updateBranch, deleteBranch, loading } = useBranches();

    const [isAdd, setIsAdd] = useState(true);
    const [data, setData] = useState<BranchTableData[]>([]);
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [hasUnsavedModalChanges, setHasUnsavedModalChanges] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<BranchTableData | null>(null);

    // Load branches on component mount
    const loadBranches = useCallback(async () => {
        try {
            const response = await getBranches();
            const mappedData: BranchTableData[] = response.branches.map((branch: BranchDto, index: number) => ({
                Branch: branch.name,
                Location: `${branch.streetAddress}, ${branch.city}, ${branch.state}`,
                'Date joined': new Date(branch.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                Status: branch.active,
                originalIndex: index,
                id: branch.id,
                primaryHeadQuarter: branch.primaryHeadQuarter,
                description: branch.description,
                // Map new fields
                streetAddress: branch.streetAddress || '',
                city: branch.city || '',
                state: branch.state || '',
                country: branch.country || '',
                phoneNumber: branch.phoneNumber || '',
                latitude: branch.latitude,
                longitude: branch.longitude
            }));
            setData(mappedData);
        } catch (err) {
            showToast('Failed to load branches', 'error');
        }
    }, [getBranches, showToast]);

    useEffect(() => {
        loadBranches();
    }, [loadBranches]);

    const handleToggleChange = async (index: number, value: boolean) => {
        try {
            const branch = data[index];
            await updateBranch(branch.id, {
                id: branch.id,
                name: branch.Branch,
                streetAddress: branch.streetAddress,
                city: branch.city,
                state: branch.state,
                country: branch.country,
                phoneNumber: branch.phoneNumber,
                latitude: branch.latitude,
                longitude: branch.longitude,
                primaryHeadQuarter: branch.primaryHeadQuarter,
                active: value,
                description: branch.description
            });

            const newData = [...data];
            newData[index].Status = value;
            setData(newData);
            showToast('Branch status updated successfully', 'success');
        } catch (err) {
            showToast('Failed to update branch status', 'error');
        }
    };

    const handleAddClick = () => {
        setIsAdd(true);
        setCurrentBranch(null);
        setIsAddEditModalOpen(true);
    };

    const handleEditClick = (index: number) => {
        setIsAdd(false);
        setCurrentBranch(data[index]);
        setIsAddEditModalOpen(true);
    };

    const handleDeleteClick = (index: number) => {
        setCurrentBranch(data[index]);
        setIsAddEditModalOpen(false);
        setIsDeleteModalOpen(true);
    };

    const handleSaveBranch = async (branch: any) => {
        try {
            if (isAdd) {
                // Add new branch
                await createBranch({
                    name: branch.Branch,
                    streetAddress: branch.StreetAddress,
                    city: branch.City,
                    state: branch.State,
                    country: branch.Country,
                    phoneNumber: branch.PhoneNumber,
                    latitude: branch.Latitude,
                    longitude: branch.Longitude,
                    primaryHeadQuarter: branch.Headquarters || false,
                    active: branch.Status ?? true,
                    description: branch.Description || ''
                });
                showToast('Branch created successfully', 'success');
            } else {
                // Update existing branch
                if (currentBranch) {
                    await updateBranch(currentBranch.id, {
                        id: currentBranch.id,
                        name: branch.Branch,
                        streetAddress: branch.StreetAddress,
                        city: branch.City,
                        state: branch.State,
                        country: branch.Country,
                        phoneNumber: branch.PhoneNumber,
                        latitude: branch.Latitude,
                        longitude: branch.Longitude,
                        primaryHeadQuarter: branch.Headquarters || false,
                        active: branch.Status,
                        description: branch.Description || ''
                    });
                    showToast('Branch updated successfully', 'success');
                }
            }

            // Reload branches to get fresh data
            await loadBranches();
            setIsAddEditModalOpen(false);
        } catch (err) {
            showToast(`Failed to ${isAdd ? 'create' : 'update'} branch`, 'error');
        }
    };

    const handleDeleteBranch = async () => {
        try {
            if (currentBranch) {
                await deleteBranch(currentBranch.id);
                showToast('Branch deleted successfully', 'success');

                // Reload branches to get fresh data
                await loadBranches();
                setIsDeleteModalOpen(false);
            }
        } catch (err) {
            showToast('Failed to delete branch', 'error');
        }
    };

    const customRenderers = {
        Status: (value: any, rowIndex: number) => (
            <Toggle
                checked={value}
                onChange={(val) => handleToggleChange(rowIndex, val)}
                messageIfChecked="Active"
                messageIfNotChecked="Inactive"
            />
        ),
        '': (_: any, rowIndex: number) => (
            <div className={styles.tableButtonContainer}>
                <Button
                    label="Delete"
                    onClick={() => handleDeleteClick(rowIndex)}
                    noAppearance={true}
                    backgroundColor="transparent"
                    fontColor="red"
                />
                <Button
                    label="Edit"
                    onClick={() => handleEditClick(rowIndex)}
                    noAppearance={true}
                    backgroundColor="transparent"
                    fontColor="var(--color-primary)"
                />
            </div>
        )
    };

    const handleBackToSettingsClick = () => {
        if (isAddEditModalOpen && hasUnsavedModalChanges) {
            const confirmLeave = window.confirm('You have unsaved changes. Do you want to discard them?');
            if (!confirmLeave) return;
        }
        navigate('/settings');
    };

    // Prepare modal data for the new BranchAddEditModal
    const getModalData = () => {
        if (!currentBranch) {
            return {
                Branch: '',
                StreetAddress: '',
                City: '',
                State: '',
                Country: '',
                PhoneNumber: '',
                Status: true,
                Headquarters: false,
                Description: '',
                Latitude: undefined,
                Longitude: undefined
            };
        }

        return {
            Branch: currentBranch.Branch,
            StreetAddress: currentBranch.streetAddress,
            City: currentBranch.city,
            State: currentBranch.state,
            Country: currentBranch.country,
            PhoneNumber: currentBranch.phoneNumber,
            Status: currentBranch.Status,
            Headquarters: currentBranch.primaryHeadQuarter,
            Description: currentBranch.description,
            Latitude: currentBranch.latitude,
            Longitude: currentBranch.longitude
        };
    };

    return (
        <div className={styles.branches}>
            <div className={styles.naviHeaderAdd}>
                <div className={styles.naviHeader}>
                    <svg
                        className={styles.backToDash}
                        onClick={handleBackToSettingsClick}
                        width="38"
                        height="38"
                        viewBox="0 0 38 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect width="38" height="38" rx="14" fill="#DBD1F9" />
                        <path
                            d="M23 12L16 19L23 26"
                            stroke="#6138E0"
                            strokeWidth="2"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <h2 className={`${styles.header} headerText`}>Branches</h2>
                </div>
                <Button label="Add branch +" onClick={handleAddClick} size="small" />
            </div>

            <Table
                headers={headers}
                data={data}
                customRenderers={customRenderers}
                loading={loading}
                nonSortableColumns={['Status', '']}
            />

            {isAddEditModalOpen && (
                <BranchAddEditModal
                    isOpen={isAddEditModalOpen}
                    onClose={() => setIsAddEditModalOpen(false)}
                    onSave={handleSaveBranch}
                    initialData={getModalData()}
                    isAdd={isAdd}
                    loading={loading}
                    onDirtyChange={setHasUnsavedModalChanges}
                    onDeleteClicked={() => {
                        setIsAddEditModalOpen(false);
                        setIsDeleteModalOpen(true);
                    }}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDeleteBranch}
                    branchName={currentBranch?.Branch || ''}
                />
            )}
        </div>
    );
};

export default Branches;