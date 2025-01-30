import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './Employee.module.css';
import EmployeeControls from './EmployeeControls/EmployeeControls';

const Employee: React.FC = () => {
    const headers = ['Name', 'ID', 'Email', 'Phone', 'Position', ''];
    const initialData = [
        { Name: 'Khaled Sayed', ID: '1234', Email: 'KH@gmail.com', Phone: '123456789', Position: 'Colourist', originalIndex: 0, imageUrl: './assets/images/employees/emp1.png' },
        { Name: 'Ahmad Moahmmed', ID: '4564', Email: 'AH@gmail.com', Phone: '456456789', Position: 'Junior stylist', originalIndex: 1, imageUrl: './assets/images/employees/emp2.png' },
        { Name: 'Ali Ahamd', ID: '9877', Email: 'AL@gmail.com', Phone: '789456123', Position: 'Senior stylist', originalIndex: 2, imageUrl: './assets/images/employees/emp1.png' },
        { Name: 'Abdo Mostafa', ID: '3258', Email: 'AB@gmail.com', Phone: '654987321', Position: 'Salon manager', originalIndex: 3, imageUrl: './assets/images/employees/emp2.png' },
    ];

    const [data] = useState(initialData);
    const [filteredData, setFilteredData] = useState(initialData);

    const handleSearch = (query: string) => {
        const lowercasedQuery = query.toLowerCase();
        const filtered = data.filter(employee =>
            employee.Name.toLowerCase().includes(lowercasedQuery) ||
            employee.ID.includes(lowercasedQuery) ||
            employee.Position.toLowerCase().includes(lowercasedQuery) ||
            employee.Phone.toLowerCase().includes(lowercasedQuery) ||
            employee.Email.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredData(filtered);
    };

    const handleAddClick = () => {

    };

    const handleEditClick = (index: number) => {

    };

    const handleDeleteClick = (index: number) => {

    };

    const customRenderers = {
        Name: (value: string, rowIndex: number) => (
            <div className={styles.nameCell}>
                <img src={filteredData[rowIndex].imageUrl} alt={value} className={styles.avatar} />
                <span>{value}</span>
            </div>
        ),
        '': (_: any, rowIndex: number) => (
            <div className={styles.tableButtonContainer}>
                <Button label="Delete" onClick={() => handleDeleteClick(rowIndex)} noAppearance={true} backgroundColor="transparent" fontColor="red" />
                <Button label="Edit" onClick={() => handleEditClick(rowIndex)} noAppearance={true} backgroundColor="transparent" fontColor="var(--color-primary)" />
            </div>
        )
    };

    return (
        <div className={styles.employeePage}>
            <div className={styles.header}>
                <h2 className={`xH1`}>Employees</h2>
                <Button label="Add employee +" onClick={handleAddClick} size="medium" />
            </div>

            <div className={styles.filters}>
                <div className={styles.searchSection}>
                    <SearchBar
                        icon={<img src="./assets/icons/magnifier.png" alt="magnifier" />}
                        placeholder="Search name, ID, email..."
                        onSearch={handleSearch}
                    />
                </div>
                <EmployeeControls />
            </div>

            <Table headers={headers} data={filteredData} customRenderers={customRenderers} />
        </div>
    );
};

export default Employee;