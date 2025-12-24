import React, { useState, useMemo } from 'react';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Calendar from '../../../components/Calendar/Calendar';
import styles from './AppointmentControls.module.css';

// Payment status enum matching backend (uses JsonStringEnumConverter)
enum PaymentStatus {
    Paid = 'Paid',
    Unpaid = 'Unpaid',
    Upcoming = 'Upcoming',
    Draft = 'Draft',
    Late = 'Late'
}

interface Branch {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface AppointmentControlsProps {
    branches?: Branch[];
    categories?: Category[];
    onBranchChange?: (branchId: number | null) => void;
    onPaymentStatusChange?: (status: string | null) => void;  // PaymentStatus enum value as string
    onCategoryChange?: (categoryId: number | null) => void;
    onDateChange?: (date: Date | null) => void;
}

const paymentStatusOptions: Array<{ label: string; value: string | null }> = [
    { label: 'All', value: null },
    { label: 'Paid', value: PaymentStatus.Paid },
    { label: 'Unpaid', value: PaymentStatus.Unpaid },
    { label: 'Upcoming', value: PaymentStatus.Upcoming },
    { label: 'Draft', value: PaymentStatus.Draft },
    { label: 'Late', value: PaymentStatus.Late }
];

const AppointmentControls: React.FC<AppointmentControlsProps> = ({
    branches = [],
    categories = [],
    onBranchChange,
    onPaymentStatusChange,
    onCategoryChange,
    onDateChange
}) => {
    const [branch, setBranch] = useState('All');
    const [payment, setPayment] = useState('All');
    const [category, setCategory] = useState('All');
    const [date, setDate] = useState<Date | null>(null);

    // Build branch options
    const branchOptions = useMemo(() => {
        return ['All', ...branches.map(b => b.name)];
    }, [branches]);

    // Build category options
    const categoryOptions = useMemo(() => {
        return ['All', ...categories.map(c => c.name)];
    }, [categories]);

    const handleBranchChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            setBranch(value);
            if (onBranchChange) {
                if (value === 'All') {
                    onBranchChange(null);
                } else {
                    const selectedBranch = branches.find(b => b.name === value);
                    onBranchChange(selectedBranch?.id ?? null);
                }
            }
        } else if (Array.isArray(value) && value.length > 0) {
            setBranch(value[0]);
        }
    };

    const handlePaymentChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            setPayment(value);
            if (onPaymentStatusChange) {
                const selectedStatus = paymentStatusOptions.find(s => s.label === value);
                onPaymentStatusChange(selectedStatus?.value ?? null);
            }
        } else if (Array.isArray(value) && value.length > 0) {
            setPayment(value[0]);
        }
    };

    const handleCategoryChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            setCategory(value);
            if (onCategoryChange) {
                if (value === 'All') {
                    onCategoryChange(null);
                } else {
                    const selectedCategory = categories.find(c => c.name === value);
                    onCategoryChange(selectedCategory?.id ?? null);
                }
            }
        } else if (Array.isArray(value) && value.length > 0) {
            setCategory(value[0]);
        }
    };

    const handleDateChange = (selectedDate: Date) => {
        setDate(selectedDate);
        if (onDateChange) {
            onDateChange(selectedDate);
        }
    };

    return (
        <div className={styles.controls}>
            {branches.length > 0 && (
                <div className={styles.controllerContainer}>
                    Branch
                    <Dropdown
                        options={branchOptions}
                        value={branch}
                        onChange={handleBranchChange}
                    />
                </div>
            )}
            <div className={styles.controllerContainer}>
                Payment
                <Dropdown
                    options={paymentStatusOptions.map(s => s.label)}
                    value={payment}
                    onChange={handlePaymentChange}
                />
            </div>
            {categories.length > 0 && (
                <div className={styles.controllerContainer}>
                    Category
                    <Dropdown
                        options={categoryOptions}
                        value={category}
                        onChange={handleCategoryChange}
                    />
                </div>
            )}
            <div className={styles.controllerContainer}>
                Date
                <Calendar
                    selectedDate={date!}
                    value={date ? 'dateselected' : 'alltime'}
                    onDateChange={handleDateChange}
                />
            </div>
        </div>
    );
};

export default AppointmentControls;
