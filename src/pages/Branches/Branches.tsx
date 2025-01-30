import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import Toggle from '../../components/Toggle/Toggle';
import AddEditModal from '../../components/AddEditModal/AddEditModal';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import styles from './Branches.module.css';
import { useNavigate } from 'react-router-dom';

const Branches: React.FC = () => {
    const headers = ['Branch', 'Location', 'Date joined', 'Status', ''];
    const initialData = [
        { Branch: 'Devaza HQ', Location: 'Dubai Marina', 'Date joined': 'November 11, 2021', Status: true, originalIndex: 0 },
        { Branch: 'Devaza', Location: 'Dubai Mall', 'Date joined': 'November 11, 2021', Status: false, originalIndex: 1 },
        { Branch: 'Devaza', Location: 'Abu Dhabi', 'Date joined': 'November 11, 2021', Status: true, originalIndex: 2 },
        { Branch: 'Devaza', Location: 'Germany', 'Date joined': 'November 11, 2021', Status: false, originalIndex: 3 }
    ];

    const [isAdd, setIsAdd] = useState(true);
    const [data, setData] = useState(initialData);
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const handleToggleChange = (index: number, value: boolean) => {
        const newData = [...data];
        const originalIndex = newData[index].originalIndex;
        newData[originalIndex].Status = value;
        setData(newData);
    };

    const handleAddClick = () => {
        setIsAdd(true);
        setCurrentBranch(null);
        setIsAddEditModalOpen(true);
    };

    const handleEditClick = (index: number) => {
        const originalIndex = data[index].originalIndex;
        setIsAdd(false);
        setCurrentIndex(originalIndex);
        setCurrentBranch(data[originalIndex]);
        setIsAddEditModalOpen(true);
    };

    const handleDeleteClick = (index: number) => {
        const originalIndex = data[index].originalIndex;
        setCurrentIndex(originalIndex);
        setCurrentBranch(data[originalIndex]);
        setIsAddEditModalOpen(false);
        setIsDeleteModalOpen(true);
    };

    const handleSaveBranch = (branch: any) => {
        const newData = [...data];
        const dateJoined = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        if (currentBranch) {
            newData[currentIndex!] = { ...branch, 'Date joined': currentBranch['Date joined'], originalIndex: currentIndex };
        } else {
            newData.push({ ...branch, 'Date joined': dateJoined, originalIndex: newData.length });
        }

        setData(newData);
        setIsAddEditModalOpen(false);
    };

    const handleDeleteBranch = () => {
        const newData = data.filter((_, index) => index !== currentIndex);
        setData(newData.map((item, index) => ({ ...item, originalIndex: index })));
        setIsDeleteModalOpen(false);
    };

    const customRenderers = {
        Status: (value: any, rowIndex: number) => (
            <Toggle checked={value} onChange={(val) => handleToggleChange(rowIndex, val)} messageIfChecked="Active" messageIfNotChecked="Inactive" />
        ),
        '': (_: any, rowIndex: number) => (
            <div className={styles.tableButtonContainer}>
                <Button label="Delete" onClick={() => handleDeleteClick(rowIndex)} noAppearance={true} backgroundColor="transparent" fontColor="red" />
                <Button label="Edit" onClick={() => handleEditClick(rowIndex)} noAppearance={true} backgroundColor="transparent" fontColor="var(--color-primary)" />
            </div>
        )
    };

    const navigate = useNavigate();

    const handleBackToSettingsClick = () => {
        navigate('/settings');
    };

    return (
        <div className={styles.branches}>
            <div className={styles.naviHeaderAdd}>
                <div className={styles.naviHeader}>
                    <svg className={styles.backToDash} onClick={handleBackToSettingsClick} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="38" height="38" rx="14" fill="#DBD1F9" />
                        <path d="M23 12L16 19L23 26" stroke="#6138E0" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className={`${styles.header} headerText`}>Branches</h2>
                </div>
                <Button label="Add branch +" onClick={handleAddClick} size="small" />
            </div>

            <Table headers={headers} data={data} customRenderers={customRenderers} />
            {isAddEditModalOpen &&
                <AddEditModal
                    isOpen={isAddEditModalOpen}
                    onClose={() => setIsAddEditModalOpen(false)}
                    onSave={handleSaveBranch}
                    initialData={currentBranch}
                    isAdd={isAdd}
                    onDeleteClicked={() => { handleDeleteClick(currentIndex!) }}
                />
            }
            {isDeleteModalOpen &&
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDeleteBranch}
                    branchName={currentBranch?.Branch || ''}
                />
            }
        </div>
    );
};

export default Branches;
