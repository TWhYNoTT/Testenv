
import React from 'react';

import StatisticsSummary from './StatisticsSummary/StatisticsSummary';
import BookingsRevenueChart from './BookingsRevenueChart/BookingsRevenueChart';
import AppointmentStatistics from './AppointmentStatistics/AppointmentStatistics';

import styles from './Dashboard.module.css';
import RevenueChart from './RevenueChart/RevenueChart';
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker';
import BranchFilter from '../../components/BranchFilter/BranchFilter';



const Dashboard: React.FC = () => {
    const data = [10000, 15000, 35000, 30000, 30000, 15000, 40500, 37000];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];





    return (
        <div className={styles.dashboard} >

            <div className={styles.clientNameGreetingAndDateFilterContainer}>
                <h1 className={styles.clientName}>
                    Hi, AbdElrahman Mostafa
                </h1>
                <div className={styles.greetingAndDateFilter}>
                    <h3 className={styles.greetingText}>Here’s what’s happening this week</h3>
                    <DateRangePicker />
                </div>
            </div>

            <BranchFilter />

            <StatisticsSummary />
            <BookingsRevenueChart />
            <div className={styles.charts}>
                <RevenueChart data={data} labels={labels} year={2024} />
                <AppointmentStatistics />
            </div>
        </div>
    );
};

export default Dashboard;