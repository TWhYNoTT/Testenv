import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Plugin, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TooltipItem } from 'chart.js';
import Button from '../../../components/Button/Button';

import styles from './BookingsRevenueChart.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const roundedBarPlugin: Plugin<'bar'> = {
    id: 'roundedBarPlugin',
    afterDatasetsDraw: (chart) => {
        const ctx = chart.ctx;

        chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);

            meta.data.forEach((bar) => {
                const { x, y, height } = bar.getProps(['x', 'y', 'height'], true);
                const radius = 4;

                ctx.save();
                ctx.beginPath();

                const halfWidth = 5;
                const top = y;
                const bottom = y + height;
                const left = x - halfWidth;
                const right = x + halfWidth;

                ctx.moveTo(left + radius, top);
                ctx.lineTo(right - radius, top);
                ctx.arcTo(right, top, right, top + radius, radius);
                ctx.lineTo(right, bottom - radius);
                ctx.arcTo(right, bottom, right - radius, bottom, radius);
                ctx.lineTo(left + radius, bottom);
                ctx.arcTo(left, bottom, left, bottom - radius, radius);
                ctx.lineTo(left, top + radius);
                ctx.arcTo(left, top, left + radius, top, radius);

                ctx.closePath();
                ctx.clip();

                const backgroundColor = ['#6138E0', '#B15EAA'];
                const color = Array.isArray(backgroundColor) ? backgroundColor[datasetIndex] : backgroundColor;
                ctx.fillStyle = color as string;
                ctx.fill();

                ctx.restore();
            });
        });
    },
};

const data = {
    labels: ['May 1', 'May 4', 'May 7', 'May 15', 'May 19', 'May 23', 'May 28', 'May 31', 'Oct 30'],
    datasets: [
        {
            label: 'Bookings',
            borderRadius: 18,
            data: [65, 59, 80, 81, 56, 55, 40, 45, 100],
            hoverBorderColor: '#6138E0',
            backgroundColor: 'transparent',
            hoverBackgroundColor: 'transparent',
            barThickness: 15,
            maxBarThickness: 40,
        },
        {
            label: 'Amount',
            borderRadius: 18,
            data: [28, 48, 40, 19, 86, 27, 90, 34, 48],
            hoverBorderColor: '#B15EAA',
            backgroundColor: 'transparent',
            hoverBackgroundColor: 'transparent',
            barThickness: 15,
            maxBarThickness: 40,
        },
    ],
};

const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                display: true,
            },
            border: {
                display: false,
            },
        },
        y: {
            grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
                display: true,
                padding: 15,
                callback: (value: number | string, index: number, values: any[]) => {
                    return index % 2 === 0 ? value : '';
                },
            },
            border: {
                display: false,
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems: TooltipItem<'bar'>[]) => {
                    return `${tooltipItems[0].label}`;
                },
                label: (tooltipItem: TooltipItem<'bar'>) => {
                    return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                },
                labelColor: (tooltipItem: TooltipItem<'bar'>) => {
                    return {
                        borderColor: `${tooltipItem.dataset.hoverBorderColor}`,
                        backgroundColor: `${tooltipItem.dataset.hoverBorderColor}`,
                        borderWidth: 1,
                        borderRadius: 1,
                    };
                },
            },
            backgroundColor: 'rgba(0,0,0,0.7)',
            titleFont: { size: 16 },
            bodyFont: { size: 14 },
            footerFont: { size: 12 },
        },
    },
    layout: {},
    font: {
        family: 'Arial, sans-serif',
    },
};

const BookingsRevenueChart: React.FC = () => {
    return (
        <div className={styles.chartContainer}>
            <div className={styles.header}>
                <h2 className='headerText'>Bookings & Revenue</h2>
                <Button label='Export' noAppearance={true} icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.66675 7.70679L9.12873 11.1909L12.5934 7.70679" stroke="#909FBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0467 17.0294C4.81074 17.698 0.404078 13.2656 1.06608 7.99875C1.51741 4.41266 4.39607 1.51803 7.96074 1.06599C13.1901 0.403367 17.5901 4.82512 16.9354 10.0872C16.4894 13.6753 13.6121 16.5747 10.0467 17.0294Z" stroke="#909FBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                } iconPosition='left' size='small' />
            </div>
            <div className={styles.detailsContainer}>
                <div className={styles.textContainer}>
                    <span>
                        <h3 className='headerText' >375,911<span>AED</span></h3>
                        <p className={styles.subText}>Total revenue</p>
                    </span>
                    <span>
                        <h3 className='headerText' >0.5%</h3>
                        <p className={styles.subText}>Reservation rate</p>
                    </span>
                </div>

                <svg width="209" height="44" viewBox="0 0 209 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_502_571)">
                        <rect width="107" height="44" rx="20" fill="#F8F9FC" />
                        <rect x="117" width="92" height="44" rx="20" fill="#F8F9FC" />
                        <circle cx="19.5" cy="21.5" r="5.5" fill="#6138E0" />
                        <circle cx="136.5" cy="21.5" r="5.5" fill="#B15EAA" />
                        <path d="M34.056 16.504H36.648C37 16.504 37.344 16.54 37.68 16.612C38.016 16.684 38.316 16.804 38.58 16.972C38.844 17.132 39.056 17.344 39.216 17.608C39.384 17.872 39.468 18.2 39.468 18.592C39.468 19.088 39.332 19.5 39.06 19.828C38.796 20.148 38.436 20.376 37.98 20.512V20.536C38.252 20.56 38.504 20.632 38.736 20.752C38.976 20.864 39.18 21.012 39.348 21.196C39.524 21.38 39.66 21.596 39.756 21.844C39.852 22.084 39.9 22.344 39.9 22.624C39.9 23.096 39.8 23.484 39.6 23.788C39.408 24.092 39.152 24.336 38.832 24.52C38.52 24.696 38.164 24.82 37.764 24.892C37.372 24.964 36.98 25 36.588 25H34.056V16.504ZM35.064 20.104H36.456C36.696 20.104 36.928 20.088 37.152 20.056C37.384 20.024 37.592 19.96 37.776 19.864C37.96 19.76 38.108 19.62 38.22 19.444C38.332 19.26 38.388 19.02 38.388 18.724C38.388 18.46 38.336 18.248 38.232 18.088C38.128 17.92 37.988 17.788 37.812 17.692C37.644 17.596 37.448 17.532 37.224 17.5C37.008 17.46 36.788 17.44 36.564 17.44H35.064V20.104ZM35.064 24.064H36.768C37.016 24.064 37.26 24.04 37.5 23.992C37.748 23.936 37.968 23.852 38.16 23.74C38.36 23.62 38.52 23.468 38.64 23.284C38.76 23.092 38.82 22.86 38.82 22.588C38.82 22.292 38.76 22.044 38.64 21.844C38.528 21.644 38.376 21.484 38.184 21.364C38 21.244 37.784 21.16 37.536 21.112C37.296 21.064 37.048 21.04 36.792 21.04H35.064V24.064ZM41.1226 22.192C41.1226 21.752 41.1986 21.352 41.3506 20.992C41.5026 20.632 41.7106 20.324 41.9746 20.068C42.2386 19.804 42.5546 19.6 42.9226 19.456C43.2906 19.312 43.6906 19.24 44.1226 19.24C44.5546 19.24 44.9546 19.312 45.3226 19.456C45.6906 19.6 46.0066 19.804 46.2706 20.068C46.5346 20.324 46.7426 20.632 46.8946 20.992C47.0466 21.352 47.1226 21.752 47.1226 22.192C47.1226 22.632 47.0466 23.032 46.8946 23.392C46.7426 23.752 46.5346 24.064 46.2706 24.328C46.0066 24.584 45.6906 24.784 45.3226 24.928C44.9546 25.072 44.5546 25.144 44.1226 25.144C43.6906 25.144 43.2906 25.072 42.9226 24.928C42.5546 24.784 42.2386 24.584 41.9746 24.328C41.7106 24.064 41.5026 23.752 41.3506 23.392C41.1986 23.032 41.1226 22.632 41.1226 22.192ZM42.1306 22.192C42.1306 22.488 42.1746 22.764 42.2626 23.02C42.3586 23.268 42.4946 23.488 42.6706 23.68C42.8466 23.864 43.0546 24.012 43.2946 24.124C43.5426 24.228 43.8186 24.28 44.1226 24.28C44.4266 24.28 44.6986 24.228 44.9386 24.124C45.1866 24.012 45.3986 23.864 45.5746 23.68C45.7506 23.488 45.8826 23.268 45.9706 23.02C46.0666 22.764 46.1146 22.488 46.1146 22.192C46.1146 21.896 46.0666 21.624 45.9706 21.376C45.8826 21.12 45.7506 20.9 45.5746 20.716C45.3986 20.524 45.1866 20.376 44.9386 20.272C44.6986 20.16 44.4266 20.104 44.1226 20.104C43.8186 20.104 43.5426 20.16 43.2946 20.272C43.0546 20.376 42.8466 20.524 42.6706 20.716C42.4946 20.9 42.3586 21.12 42.2626 21.376C42.1746 21.624 42.1306 21.896 42.1306 22.192ZM48.2476 22.192C48.2476 21.752 48.3236 21.352 48.4756 20.992C48.6276 20.632 48.8356 20.324 49.0996 20.068C49.3636 19.804 49.6796 19.6 50.0476 19.456C50.4156 19.312 50.8156 19.24 51.2476 19.24C51.6796 19.24 52.0796 19.312 52.4476 19.456C52.8156 19.6 53.1316 19.804 53.3956 20.068C53.6596 20.324 53.8676 20.632 54.0196 20.992C54.1716 21.352 54.2476 21.752 54.2476 22.192C54.2476 22.632 54.1716 23.032 54.0196 23.392C53.8676 23.752 53.6596 24.064 53.3956 24.328C53.1316 24.584 52.8156 24.784 52.4476 24.928C52.0796 25.072 51.6796 25.144 51.2476 25.144C50.8156 25.144 50.4156 25.072 50.0476 24.928C49.6796 24.784 49.3636 24.584 49.0996 24.328C48.8356 24.064 48.6276 23.752 48.4756 23.392C48.3236 23.032 48.2476 22.632 48.2476 22.192ZM49.2556 22.192C49.2556 22.488 49.2996 22.764 49.3876 23.02C49.4836 23.268 49.6196 23.488 49.7956 23.68C49.9716 23.864 50.1796 24.012 50.4196 24.124C50.6676 24.228 50.9436 24.28 51.2476 24.28C51.5516 24.28 51.8236 24.228 52.0636 24.124C52.3116 24.012 52.5236 23.864 52.6996 23.68C52.8756 23.488 53.0076 23.268 53.0956 23.02C53.1916 22.764 53.2396 22.488 53.2396 22.192C53.2396 21.896 53.1916 21.624 53.0956 21.376C53.0076 21.12 52.8756 20.9 52.6996 20.716C52.5236 20.524 52.3116 20.376 52.0636 20.272C51.8236 20.16 51.5516 20.104 51.2476 20.104C50.9436 20.104 50.6676 20.16 50.4196 20.272C50.1796 20.376 49.9716 20.524 49.7956 20.716C49.6196 20.9 49.4836 21.12 49.3876 21.376C49.2996 21.624 49.2556 21.896 49.2556 22.192ZM55.6966 15.928H56.6326V21.856L59.1886 19.384H60.5206L57.8086 21.94L60.7966 25H59.4166L56.6326 22.048V25H55.6966V15.928ZM61.7806 19.384H62.7166V25H61.7806V19.384ZM61.5646 17.188C61.5646 17.004 61.6286 16.844 61.7566 16.708C61.8926 16.572 62.0566 16.504 62.2486 16.504C62.4406 16.504 62.6006 16.572 62.7286 16.708C62.8646 16.844 62.9326 17.004 62.9326 17.188C62.9326 17.388 62.8686 17.552 62.7406 17.68C62.6126 17.808 62.4486 17.872 62.2486 17.872C62.0486 17.872 61.8846 17.808 61.7566 17.68C61.6286 17.552 61.5646 17.388 61.5646 17.188ZM64.5794 20.716C64.5794 20.46 64.5714 20.22 64.5554 19.996C64.5394 19.772 64.5314 19.568 64.5314 19.384H65.4194C65.4194 19.536 65.4234 19.688 65.4314 19.84C65.4394 19.992 65.4434 20.148 65.4434 20.308H65.4674C65.5314 20.172 65.6194 20.04 65.7314 19.912C65.8514 19.784 65.9914 19.672 66.1514 19.576C66.3114 19.472 66.4914 19.392 66.6914 19.336C66.8914 19.272 67.1074 19.24 67.3394 19.24C67.7074 19.24 68.0234 19.296 68.2874 19.408C68.5594 19.52 68.7834 19.676 68.9594 19.876C69.1354 20.076 69.2634 20.32 69.3434 20.608C69.4314 20.888 69.4754 21.196 69.4754 21.532V25H68.5394V21.628C68.5394 21.156 68.4354 20.784 68.2274 20.512C68.0194 20.24 67.6954 20.104 67.2554 20.104C66.9514 20.104 66.6874 20.156 66.4634 20.26C66.2474 20.364 66.0674 20.512 65.9234 20.704C65.7874 20.896 65.6834 21.124 65.6114 21.388C65.5474 21.652 65.5154 21.944 65.5154 22.264V25H64.5794V20.716ZM76.8514 24.748C76.8514 25.772 76.5874 26.548 76.0594 27.076C75.5394 27.612 74.7834 27.88 73.7914 27.88C73.2394 27.88 72.7394 27.8 72.2914 27.64C71.8514 27.48 71.4314 27.204 71.0314 26.812L71.7034 26.044C71.9994 26.364 72.3114 26.604 72.6394 26.764C72.9754 26.932 73.3594 27.016 73.7914 27.016C74.2074 27.016 74.5514 26.952 74.8234 26.824C75.1034 26.704 75.3234 26.536 75.4834 26.32C75.6434 26.112 75.7554 25.872 75.8194 25.6C75.8834 25.328 75.9154 25.044 75.9154 24.748V24.028H75.8914C75.6674 24.388 75.3754 24.652 75.0154 24.82C74.6554 24.988 74.2874 25.072 73.9114 25.072C73.4714 25.072 73.0674 25 72.6994 24.856C72.3314 24.712 72.0154 24.512 71.7514 24.256C71.4874 24 71.2834 23.696 71.1394 23.344C70.9954 22.992 70.9234 22.608 70.9234 22.192C70.9234 21.736 70.9954 21.324 71.1394 20.956C71.2834 20.588 71.4834 20.28 71.7394 20.032C72.0034 19.776 72.3194 19.58 72.6874 19.444C73.0554 19.308 73.4634 19.24 73.9114 19.24C74.1034 19.24 74.2954 19.264 74.4874 19.312C74.6794 19.352 74.8634 19.42 75.0394 19.516C75.2234 19.604 75.3874 19.72 75.5314 19.864C75.6754 20 75.7954 20.16 75.8914 20.344H75.9154V19.384H76.8514V24.748ZM71.9314 22.192C71.9314 22.48 71.9834 22.748 72.0874 22.996C72.1914 23.236 72.3314 23.448 72.5074 23.632C72.6914 23.808 72.9034 23.948 73.1434 24.052C73.3834 24.156 73.6394 24.208 73.9114 24.208C74.2314 24.208 74.5154 24.152 74.7634 24.04C75.0114 23.928 75.2194 23.78 75.3874 23.596C75.5634 23.404 75.6954 23.188 75.7834 22.948C75.8714 22.7 75.9154 22.44 75.9154 22.168C75.9154 21.864 75.8674 21.588 75.7714 21.34C75.6754 21.084 75.5394 20.864 75.3634 20.68C75.1874 20.496 74.9754 20.356 74.7274 20.26C74.4794 20.156 74.2074 20.104 73.9114 20.104C73.6154 20.104 73.3434 20.16 73.0954 20.272C72.8554 20.376 72.6474 20.524 72.4714 20.716C72.3034 20.9 72.1714 21.12 72.0754 21.376C71.9794 21.624 71.9314 21.896 71.9314 22.192ZM78.7033 23.524C78.8873 23.756 79.0873 23.94 79.3033 24.076C79.5273 24.212 79.8073 24.28 80.1433 24.28C80.2873 24.28 80.4313 24.264 80.5753 24.232C80.7273 24.2 80.8633 24.148 80.9833 24.076C81.1033 24.004 81.1993 23.916 81.2713 23.812C81.3433 23.7 81.3793 23.568 81.3793 23.416C81.3793 23.264 81.3433 23.14 81.2713 23.044C81.2073 22.948 81.1193 22.868 81.0073 22.804C80.8953 22.732 80.7673 22.676 80.6233 22.636C80.4793 22.596 80.3313 22.56 80.1793 22.528C79.9153 22.472 79.6633 22.408 79.4233 22.336C79.1833 22.264 78.9713 22.172 78.7873 22.06C78.6113 21.94 78.4673 21.788 78.3553 21.604C78.2513 21.42 78.1993 21.184 78.1993 20.896C78.1993 20.624 78.2593 20.384 78.3793 20.176C78.4993 19.968 78.6593 19.796 78.8593 19.66C79.0593 19.524 79.2833 19.42 79.5313 19.348C79.7793 19.276 80.0353 19.24 80.2993 19.24C80.6993 19.24 81.0673 19.32 81.4033 19.48C81.7473 19.64 82.0153 19.9 82.2073 20.26L81.4273 20.776C81.3073 20.576 81.1473 20.416 80.9473 20.296C80.7553 20.168 80.5193 20.104 80.2393 20.104C80.1113 20.104 79.9793 20.12 79.8433 20.152C79.7153 20.184 79.5993 20.232 79.4953 20.296C79.3913 20.36 79.3033 20.444 79.2313 20.548C79.1673 20.644 79.1353 20.756 79.1353 20.884C79.1353 21.004 79.1713 21.108 79.2433 21.196C79.3233 21.276 79.4273 21.348 79.5553 21.412C79.6913 21.476 79.8433 21.532 80.0113 21.58C80.1873 21.628 80.3673 21.668 80.5513 21.7C80.7993 21.748 81.0353 21.812 81.2593 21.892C81.4833 21.964 81.6793 22.064 81.8473 22.192C82.0153 22.32 82.1473 22.48 82.2433 22.672C82.3393 22.864 82.3873 23.1 82.3873 23.38C82.3873 23.7 82.3233 23.972 82.1953 24.196C82.0673 24.42 81.8953 24.604 81.6793 24.748C81.4713 24.884 81.2313 24.984 80.9593 25.048C80.6953 25.112 80.4233 25.144 80.1433 25.144C79.6633 25.144 79.2473 25.072 78.8953 24.928C78.5513 24.776 78.2393 24.5 77.9593 24.1L78.7033 23.524Z" fill="#333333" />
                        <path d="M153.816 16.504H154.764L158.376 25H157.2L156.336 22.912H152.088L151.212 25H150.072L153.816 16.504ZM154.272 17.8H154.248L152.484 21.976H155.952L154.272 17.8ZM159.337 20.716C159.337 20.46 159.329 20.22 159.313 19.996C159.297 19.772 159.289 19.568 159.289 19.384H160.177C160.177 19.536 160.181 19.688 160.189 19.84C160.197 19.992 160.201 20.148 160.201 20.308H160.225C160.289 20.172 160.377 20.04 160.489 19.912C160.609 19.784 160.749 19.672 160.909 19.576C161.069 19.472 161.249 19.392 161.449 19.336C161.649 19.272 161.865 19.24 162.097 19.24C162.401 19.24 162.653 19.28 162.853 19.36C163.061 19.432 163.233 19.524 163.369 19.636C163.505 19.74 163.609 19.856 163.681 19.984C163.761 20.104 163.825 20.212 163.873 20.308C164.081 19.972 164.321 19.712 164.593 19.528C164.865 19.336 165.217 19.24 165.649 19.24C166.049 19.24 166.385 19.296 166.657 19.408C166.929 19.512 167.149 19.668 167.317 19.876C167.485 20.076 167.605 20.324 167.677 20.62C167.749 20.908 167.785 21.232 167.785 21.592V25H166.849V21.64C166.849 21.448 166.829 21.26 166.789 21.076C166.749 20.892 166.677 20.728 166.573 20.584C166.469 20.44 166.329 20.324 166.153 20.236C165.977 20.148 165.753 20.104 165.481 20.104C165.281 20.104 165.093 20.144 164.917 20.224C164.741 20.304 164.585 20.416 164.449 20.56C164.321 20.704 164.217 20.88 164.137 21.088C164.065 21.288 164.029 21.512 164.029 21.76V25H163.093V21.82C163.093 21.196 163.009 20.756 162.841 20.5C162.673 20.236 162.397 20.104 162.013 20.104C161.709 20.104 161.445 20.156 161.221 20.26C161.005 20.364 160.825 20.512 160.681 20.704C160.545 20.896 160.441 21.124 160.369 21.388C160.305 21.652 160.273 21.944 160.273 22.264V25H159.337V20.716ZM169.232 22.192C169.232 21.752 169.308 21.352 169.46 20.992C169.612 20.632 169.82 20.324 170.084 20.068C170.348 19.804 170.664 19.6 171.032 19.456C171.4 19.312 171.8 19.24 172.232 19.24C172.664 19.24 173.064 19.312 173.432 19.456C173.8 19.6 174.116 19.804 174.38 20.068C174.644 20.324 174.852 20.632 175.004 20.992C175.156 21.352 175.232 21.752 175.232 22.192C175.232 22.632 175.156 23.032 175.004 23.392C174.852 23.752 174.644 24.064 174.38 24.328C174.116 24.584 173.8 24.784 173.432 24.928C173.064 25.072 172.664 25.144 172.232 25.144C171.8 25.144 171.4 25.072 171.032 24.928C170.664 24.784 170.348 24.584 170.084 24.328C169.82 24.064 169.612 23.752 169.46 23.392C169.308 23.032 169.232 22.632 169.232 22.192ZM170.24 22.192C170.24 22.488 170.284 22.764 170.372 23.02C170.468 23.268 170.604 23.488 170.78 23.68C170.956 23.864 171.164 24.012 171.404 24.124C171.652 24.228 171.928 24.28 172.232 24.28C172.536 24.28 172.808 24.228 173.048 24.124C173.296 24.012 173.508 23.864 173.684 23.68C173.86 23.488 173.992 23.268 174.08 23.02C174.176 22.764 174.224 22.488 174.224 22.192C174.224 21.896 174.176 21.624 174.08 21.376C173.992 21.12 173.86 20.9 173.684 20.716C173.508 20.524 173.296 20.376 173.048 20.272C172.808 20.16 172.536 20.104 172.232 20.104C171.928 20.104 171.652 20.16 171.404 20.272C171.164 20.376 170.956 20.524 170.78 20.716C170.604 20.9 170.468 21.12 170.372 21.376C170.284 21.624 170.24 21.896 170.24 22.192ZM181.577 23.668C181.577 23.924 181.585 24.164 181.601 24.388C181.617 24.612 181.625 24.816 181.625 25H180.737C180.737 24.848 180.733 24.696 180.725 24.544C180.717 24.392 180.713 24.236 180.713 24.076H180.689C180.625 24.212 180.533 24.344 180.413 24.472C180.301 24.6 180.165 24.716 180.005 24.82C179.845 24.916 179.665 24.992 179.465 25.048C179.265 25.112 179.049 25.144 178.817 25.144C178.449 25.144 178.129 25.088 177.857 24.976C177.593 24.864 177.373 24.708 177.197 24.508C177.021 24.308 176.889 24.068 176.801 23.788C176.721 23.5 176.681 23.188 176.681 22.852V19.384H177.617V22.756C177.617 23.228 177.721 23.6 177.929 23.872C178.137 24.144 178.461 24.28 178.901 24.28C179.205 24.28 179.465 24.228 179.681 24.124C179.905 24.02 180.085 23.872 180.221 23.68C180.365 23.488 180.469 23.26 180.533 22.996C180.605 22.732 180.641 22.44 180.641 22.12V19.384H181.577V23.668ZM183.349 20.716C183.349 20.46 183.341 20.22 183.325 19.996C183.309 19.772 183.301 19.568 183.301 19.384H184.189C184.189 19.536 184.193 19.688 184.201 19.84C184.209 19.992 184.213 20.148 184.213 20.308H184.237C184.301 20.172 184.389 20.04 184.501 19.912C184.621 19.784 184.761 19.672 184.921 19.576C185.081 19.472 185.261 19.392 185.461 19.336C185.661 19.272 185.877 19.24 186.109 19.24C186.477 19.24 186.793 19.296 187.057 19.408C187.329 19.52 187.553 19.676 187.729 19.876C187.905 20.076 188.033 20.32 188.113 20.608C188.201 20.888 188.245 21.196 188.245 21.532V25H187.309V21.628C187.309 21.156 187.205 20.784 186.997 20.512C186.789 20.24 186.465 20.104 186.025 20.104C185.721 20.104 185.457 20.156 185.233 20.26C185.017 20.364 184.837 20.512 184.693 20.704C184.557 20.896 184.453 21.124 184.381 21.388C184.317 21.652 184.285 21.944 184.285 22.264V25H183.349V20.716ZM193.089 20.176H191.433V22.984C191.433 23.168 191.437 23.34 191.445 23.5C191.453 23.652 191.485 23.788 191.541 23.908C191.597 24.02 191.681 24.112 191.793 24.184C191.905 24.248 192.065 24.28 192.273 24.28C192.409 24.28 192.549 24.264 192.693 24.232C192.837 24.2 192.973 24.152 193.101 24.088L193.137 24.94C192.977 25.012 192.797 25.064 192.597 25.096C192.405 25.128 192.221 25.144 192.045 25.144C191.709 25.144 191.441 25.1 191.241 25.012C191.041 24.924 190.885 24.8 190.773 24.64C190.661 24.48 190.585 24.284 190.545 24.052C190.513 23.812 190.497 23.548 190.497 23.26V20.176H189.273V19.384H190.497V17.788H191.433V19.384H193.089V20.176Z" fill="#333333" />
                    </g>
                </svg>
            </div>
            <div >
                <Bar data={data} options={options} plugins={[roundedBarPlugin]} />
            </div>
        </div>
    );
};

export default BookingsRevenueChart;
