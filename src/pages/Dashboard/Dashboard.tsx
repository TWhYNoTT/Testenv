import React, { useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useToast } from '../../contexts/ToastContext';

import StatisticsSummary from './StatisticsSummary/StatisticsSummary';
import BookingsRevenueChart from './BookingsRevenueChart/BookingsRevenueChart';
import AppointmentStatistics from './AppointmentStatistics/AppointmentStatistics';

import styles from './Dashboard.module.css';
import RevenueChart from './RevenueChart/RevenueChart';
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker';
import BranchFilter from '../../components/BranchFilter/BranchFilter';
import { useDashboard } from '../../hooks/useDashboard';
import Button from '../../components/Button/Button';

const Dashboard: React.FC = () => {
    const { user } = useUser();
    const { showToast } = useToast();
    const {
        loading,
        range,
        setRange,
        selectedDate,
        setSelectedDate,
        summary,
        bookingsRevenue,
        revenueSeries,
        appointmentStats,
        refresh,
        lastSuccessfulLoad,
    } = useDashboard({ range: 'last30days' });

    // Show a success toast whenever the dashboard successfully finishes loading
    // (covers both navigation initial load and manual refresh)
    useEffect(() => {
        if (lastSuccessfulLoad != null) {
            showToast('Dashboard updated successfully.', 'success');
        }
    }, [lastSuccessfulLoad, showToast]);

    return (
        <div className={styles.dashboard} aria-busy={loading}>

            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}>
                        <svg viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                        </svg>
                        <span>Loading data...</span>
                    </div>
                </div>
            )}

            <div className={styles.clientNameGreetingAndDateFilterContainer}>
                <h1 className={styles.clientName}>
                    Hi, {user?.fullName || 'User'}
                </h1>
                <div className={styles.greetingAndDateFilter}>
                    <h3 className={styles.greetingText}>Here’s what’s happening this week</h3>
                    {/* Temporary: keep DateRangePicker UI, but we'll wire state in a later pass */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <DateRangePicker />
                        <Button
                            label={loading ? 'Refreshing…' : 'Refresh'}
                            size="small"
                            variant="secondary"
                            disabled={loading}
                            onClick={async () => { await refresh(); }}
                        />
                    </div>
                </div>
            </div>

            <BranchFilter />

            <StatisticsSummary
                totalAppointments={summary.totalAppointments}
                employees={summary.employees}
                activeBranches={summary.activeBranches}
            />
            <BookingsRevenueChart
                labels={bookingsRevenue.labels}
                bookings={bookingsRevenue.bookings}
                amounts={bookingsRevenue.amounts}
                totalRevenue={bookingsRevenue.totalRevenue}
                reservationRate={bookingsRevenue.reservationRate}
            />
            <div className={styles.charts}>
                <RevenueChart data={revenueSeries.data} labels={revenueSeries.labels} year={revenueSeries.year} />
                <AppointmentStatistics labels={appointmentStats.labels} values={appointmentStats.values} />
            </div>
        </div>
    );
};

export default Dashboard;