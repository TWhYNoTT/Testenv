import React from 'react';
import styles from './StatisticsSummary.module.css';

interface Props {
    totalAppointments: number;
    employees: number;
    activeBranches: number;
}

const StatisticsSummary: React.FC<Props> = ({ totalAppointments, employees, activeBranches }) => {
    return (
        <div className={styles.statisticsSummary}>
            <div className={styles.card}>
                <div className={styles.icon}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="14" fill="#D8CCFE" />
                        <path d="M16.2666 14.8899V11" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M23.7335 14.8899V11" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M27 12.7438C27.5333 12.7438 28 13.2803 28 13.8839V24.0111C28 24.7489 27.5333 25.2854 26.9333 25.2854H13.0667C12.4667 25.2854 12 24.6818 12 24.0111V13.8839C12 13.2132 12.4667 12.7438 13 12.7438H27V12.7438Z" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M12.2666 17.4385H27.7333" stroke="#6138E0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>


                </div>
                <div className={styles.info}>
                    <p>Total Appointments</p>
                    <h2>{totalAppointments}</h2>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.icon}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="14" fill="#DEEAFF" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20 28.4102C24.95 28.4102 29 24.3359 29 19.3561C29 14.3764 24.95 10.302 20 10.302C15.05 10.302 11 14.3764 11 19.3561C11 24.3359 15.05 28.4102 20 28.4102Z" stroke="#051E48" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.9999 20.5634C21.5749 20.5634 22.8499 19.2807 22.8499 17.6962C22.8499 16.1118 21.5749 14.8291 19.9999 14.8291C18.4249 14.8291 17.1499 16.1118 17.1499 17.6962C17.1499 19.2807 18.4249 20.5634 19.9999 20.5634Z" stroke="#051E48" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M26.5251 25.5431C26.5251 23.355 22.1751 22.2987 20.0001 22.2987C17.8251 22.2987 13.4751 23.355 13.4751 25.5431" stroke="#051E48" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M26.5251 25.5431C26.5251 23.355 22.1751 22.2987 20.0001 22.2987C17.8251 22.2987 13.4751 23.355 13.4751 25.5431" stroke="#051E48" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </div>
                <div className={styles.info}>
                    <p>Employees</p>
                    <h2>{employees}</h2>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.icon}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="14" fill="#FFDEDD" />
                        <path d="M20.5443 27.7737C20.234 28.0859 19.7686 28.0859 19.5359 27.7737L11.2359 18.4094C11.0031 18.0972 10.9256 17.4729 11.0807 17.0827L13.7181 12.0104C13.9508 11.6202 14.4938 11.308 14.8817 11.308H25.1985C25.6639 11.308 26.1294 11.6202 26.3621 12.0104L28.9995 17.0827C29.2322 17.4729 29.1546 18.0192 28.8443 18.3313L20.5443 27.7737Z" stroke="#E8453F" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14.6489 16.4584H25.5087" stroke="#E8453F" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <div className={styles.info}>
                    <p>Active branches</p>
                    <h2>{activeBranches}</h2>
                </div>
            </div>
        </div>
    );
};

export default StatisticsSummary;