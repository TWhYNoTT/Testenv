import React, { useState } from 'react';
import Table from '../../../components/Table/Table';
import Button from '../../../components/Button/Button';
import SearchBar from '../../../components/SearchBar/SearchBar';
import styles from './UserRoles.module.css';
import UserControls from './UserControls/UserControls';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { useNavigate } from 'react-router-dom';

const UserRoles: React.FC = () => {
    const headers = ['Name', 'ID', 'Email', 'Phone', 'Role', ''];
    const initialData = [
        { Name: 'Khaled Sayed', ID: '1234', Email: 'KH@gmail.com', Phone: '123456789', Position: 'Colourist', Role: 'Administrator', originalIndex: 0, imageUrl: '/assets/images/employees/emp1.png' },
        { Name: 'Ahmad Moahmmed', ID: '4564', Email: 'AH@gmail.com', Phone: '456456789', Position: 'Junior stylist', Role: 'Administrator', originalIndex: 1, imageUrl: '/assets/images/employees/emp2.png' },
        { Name: 'Ali Ahamd', ID: '9877', Email: 'AL@gmail.com', Phone: '789456123', Position: 'Senior stylist', Role: 'Administrator', originalIndex: 2, imageUrl: '/assets/images/employees/emp1.png' },
        { Name: 'Abdo Mostafa', ID: '3258', Email: 'AB@gmail.com', Phone: '654987321', Position: 'Salon manager', Role: 'Administrator', originalIndex: 3, imageUrl: '/assets/images/employees/emp2.png' },
    ];

    const [data, setData] = useState(initialData);
    const [filteredData, setFilteredData] = useState(initialData);

    const handleSearch = (query: string) => {
        const lowercasedQuery = query.toLowerCase();
        const filtered = data.filter(user =>
            user.Name.toLowerCase().includes(lowercasedQuery) ||
            user.ID.includes(lowercasedQuery) ||
            user.Email.toLowerCase().includes(lowercasedQuery) ||
            user.Phone.toLowerCase().includes(lowercasedQuery) ||
            user.Role.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredData(filtered);
    };

    const handleAddClick = () => {

    };

    const handleEditClick = (index: number) => {

    };

    const handleDeleteClick = (index: number) => {

    };


    const handleRoleChange = (originalIndex: number, newRole: string) => {
        const updatedData = [...data];
        updatedData[originalIndex].Role = newRole;
        setData(updatedData);
    };

    const customRenderers = {
        Name: (value: string, rowIndex: number) => (
            <div className={styles.nameCell}>
                <img src={filteredData[rowIndex].imageUrl} alt={value} className={styles.avatar} />
                <span>{value}</span>
            </div>
        ),
        Role: (value: string, rowIndex: number, row: any) => (
            <div className={styles.dropdownContainer}>
                <Dropdown
                    value={value}
                    options={['Administrator', 'User', 'Manager']}
                    onChange={(newRole) => handleRoleChange(row.originalIndex, newRole as string)}
                    withBorder={true}
                />
            </div>
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
        <div className={styles.userRolesPage}>
            <div className={styles.header}>
                <div className={styles.naviHeader}>
                    <svg className={styles.bckBTN} onClick={handleBackToSettingsClick} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="38" height="38" rx="14" fill="#DBD1F9" />
                        <path d="M23 12L16 19L23 26" stroke="#6138E0" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <h2 className={`xH1`}>User roles</h2>
                </div>
                <Button label="Add employee +" onClick={handleAddClick} size="medium" />
            </div>

            <div className={styles.filters}>
                <div className={styles.searchSection}>
                    <SearchBar
                        icon={<img src="/assets/icons/magnifier.png" alt="magnifier" />}
                        placeholder="Search name, ID, email..."
                        onSearch={handleSearch}
                    />
                </div>
                <UserControls />


            </div>

            <Table headers={headers} data={filteredData} customRenderers={customRenderers} />
        </div>
    );
};

export default UserRoles;