import React, { useState } from 'react';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Calendar from '../../../components/Calendar/Calendar';


import styles from './AppointmentControls.module.css';

const AppointmentControls: React.FC = () => {
    const [branch, setBranch] = useState('All');
    const [payment, setPayment] = useState('All');
    const [date, setDate] = useState<Date | null>(null);


    const handleBranchChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            setBranch(value);
        } else if (Array.isArray(value) && value.length > 0) {
            setBranch(value[0]);
        }
    };

    const handlePaymentChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            setPayment(value);
        } else if (Array.isArray(value) && value.length > 0) {
            setPayment(value[0]);
        }
    };

    const handleDateChange = (date: Date) => setDate(date);

    return (
        <div className={styles.controls}>
            <div className={styles.controllerContainer}>
                Branch
                <Dropdown

                    options={['All', 'Branch 1', 'Branch 2', 'Branch 3']}
                    value={branch}
                    onChange={handleBranchChange}
                />
            </div>
            <div className={styles.controllerContainer}>
                Payment
                <Dropdown

                    options={['All', 'Paid', 'Unpaid']}
                    value={payment}
                    onChange={handlePaymentChange}
                />
            </div>
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
