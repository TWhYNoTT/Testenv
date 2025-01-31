import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './AppointmentStatistics.module.css';
import Button from '../../../components/Button/Button';

ChartJS.register(ArcElement, Tooltip, Legend);

const dataValues = [64, 25, 12, 18];
const labels = ['Pending', 'Confirm', 'Rejected', 'Completed'];
const backgroundColors = ['#FFC5DB', '#A074B7', '#B97AAA', '#7C4DFF'];


const doughnutData = {
    labels,
    datasets: [
        {
            data: dataValues,
            backgroundColor: backgroundColors,
            // hoverBackgroundColor: backgroundColors,
            borderWidth: 0,
        },
    ],
};

const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
        legend: {
            display: false,
        },
    },
};

const AppointmentStatistics: React.FC = () => {
    return (
        <div className={styles.appointmentStatistics}>
            <div className={styles.header}>
                <h3 className='headerText'>Bookings statistics</h3>
                <Button label='Export' noAppearance={true} icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.66675 7.70679L9.12873 11.1909L12.5934 7.70679" stroke="#909FBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0467 17.0294C4.81074 17.698 0.404078 13.2656 1.06608 7.99875C1.51741 4.41266 4.39607 1.51803 7.96074 1.06599C13.1901 0.403367 17.5901 4.82512 16.9354 10.0872C16.4894 13.6753 13.6121 16.5747 10.0467 17.0294Z" stroke="#909FBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                } iconPosition='left' size='small' />
            </div>
            <div className={styles.chartContainer}>
                <div className={styles.chart}>
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
                <ul className={styles.legends}>
                    {labels.map((label, index) => (
                        <li key={index} className={styles.legendContainer}>
                            <span className={styles.bullet} style={{ backgroundColor: backgroundColors[index] }}></span>
                            {label} <span className={styles.percentageValue}>{dataValues[index]}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AppointmentStatistics;
