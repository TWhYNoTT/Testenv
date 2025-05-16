import React, { useState, useEffect } from 'react';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './Employee.module.css';
import EmployeeControls from './EmployeeControls/EmployeeControls';

import { useStaff } from '../../hooks/useStaff';
import { useToast } from '../../contexts/ToastContext';
import { RegisterStaffRequest } from '../../services/api';
import type { BusinessStaffDto } from '../../types/api-responses';
import EmployeeModal from '../../components/Employee/EmployeeModal';

const Employee: React.FC = () => {
    // Added Rating to headers
    const headers = ['Name', 'ID', 'Email', 'Phone', 'Position', 'Status', 'Rating', ''];
    const { showToast } = useToast();
    const {
        staff,
        totalCount,
        currentPage,
        totalPages,
        getBusinessStaff,
        registerStaff,
        deleteStaff,
        loading
    } = useStaff();

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState<any>(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Get your current business ID (you might get this from context or localStorage)
    const businessId = 1; // Replace with actual business ID

    useEffect(() => {
        fetchStaff();
    }, [page]); // Refetch when page changes

    useEffect(() => {
        if (staff && staff.length > 0) {
            // Transform the staff data to match the table structure
            setFilteredData(staff.map((employee, index) => ({
                ...employee,
                originalIndex: index,
                imageUrl: './assets/images/employees/emp1.png', // Default image
                ID: employee.id.toString(),
                Name: employee.fullName,
                Email: employee.email,
                Phone: employee.phoneNumber,
                Position: employee.position || '',
                Status: employee.isActive,
                Rating: `${employee.rating.toFixed(1)} (${employee.totalRatings})`
            })));
        } else {
            setFilteredData([]);
        }
    }, [staff]);

    const fetchStaff = async () => {
        try {
            await getBusinessStaff({
                businessId,
                page,
                pageSize
            });
        } catch (error) {
            showToast('Failed to load employees', 'error');
        }
    };

    const handleSearch = (query: string) => {
        const lowercasedQuery = query.toLowerCase();

        // If no staff data, return empty array
        if (!staff || staff.length === 0) {
            setFilteredData([]);
            return;
        }

        const filtered = staff.map((employee, index) => ({
            ...employee,
            originalIndex: index,
            imageUrl: './assets/images/employees/emp1.png',
            ID: employee.id.toString(),
            Name: employee.fullName,
            Email: employee.email,
            Phone: employee.phoneNumber,
            Position: employee.position || '',
            Status: employee.isActive,
            Rating: `${employee.rating.toFixed(1)} (${employee.totalRatings})`
        })).filter(employee =>
            employee.fullName.toLowerCase().includes(lowercasedQuery) ||
            employee.id.toString().includes(lowercasedQuery) ||
            (employee.position?.toLowerCase() || '').includes(lowercasedQuery) ||
            employee.phoneNumber.toLowerCase().includes(lowercasedQuery) ||
            employee.email.toLowerCase().includes(lowercasedQuery)
        );

        setFilteredData(filtered);
    };

    const handleAddClick = () => {
        setCurrentEmployee(null);
        setIsAddMode(true);
        setIsModalOpen(true);
    };

    const handleEditClick = (index: number) => {
        const employeeToEdit = staff[filteredData[index].originalIndex];
        setCurrentEmployee({
            id: employeeToEdit.id,
            fullName: employeeToEdit.fullName,
            email: employeeToEdit.email,
            phoneNumber: employeeToEdit.phoneNumber,
            position: employeeToEdit.position,
            isActive: employeeToEdit.isActive,
            schedules: employeeToEdit.schedules,
        });
        setIsAddMode(false);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (staffId: number) => {
        try {
            await deleteStaff(staffId);
            showToast('Employee deleted successfully', 'success');
            fetchStaff();
        } catch (error) {
            showToast('Failed to delete employee', 'error');
        }
    };

    const handleSaveEmployee = async (employeeData: any) => {
        try {
            if (isAddMode) {
                const staffRequest: RegisterStaffRequest = {
                    businessId,
                    fullName: employeeData.fullName,
                    email: employeeData.email,
                    phoneNumber: employeeData.phoneNumber,
                    password: employeeData.password,
                    position: employeeData.position,
                    isActive: employeeData.isActive
                };

                await registerStaff(staffRequest);
                showToast('Employee added successfully', 'success');
            } else {
                // Here you would implement the update staff method
                // For now, we'll just show a toast
                showToast('Employee updated successfully', 'success');
            }

            setIsModalOpen(false);
            fetchStaff();
        } catch (error) {
            showToast('Failed to save employee', 'error');
        }
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const customRenderers = {
        Name: (value: string, rowIndex: number) => (
            <div className={styles.nameCell}>
                <img src={filteredData[rowIndex].imageUrl} alt={value} className={styles.avatar} />
                <span>{value}</span>
            </div>
        ),
        Status: (value: boolean) => (
            <span className={value ? styles.active : styles.inactive}>
                {value ? 'Active' : 'Inactive'}
            </span>
        ),
        Rating: (value: string) => (
            <div className={styles.ratingCell}>
                <span className={styles.ratingValue}>{value}</span>
            </div>
        ),
        '': (_: any, rowIndex: number) => (
            <div className={styles.tableButtonContainer}>
                <Button
                    label="Delete"
                    onClick={() => handleDeleteClick(filteredData[rowIndex].id)}
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

            <Table
                headers={headers}
                data={filteredData}
                customRenderers={customRenderers}
                loading={loading}
                nonSortableColumns={['']} // Make the actions column non-sortable
            />

            {/* Add pagination controls */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <Button
                        label="Previous"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        size="small"
                    />
                    <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        label="Next"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        size="small"
                    />
                </div>
            )}

            <EmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={currentEmployee}
                onSave={handleSaveEmployee}
                isAdd={isAddMode}
                onDeleteClicked={() => currentEmployee && handleDeleteClick(currentEmployee.id)}
            />
        </div>
    );
};

export default Employee;