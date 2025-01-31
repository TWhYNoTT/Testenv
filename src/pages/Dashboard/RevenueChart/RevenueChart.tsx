import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
    Plugin,
} from 'chart.js';
import styles from './RevenueChart.module.css';
import Button from '../../../components/Button/Button';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface RevenueChartProps {
    data: number[];
    labels: string[];
    year: number;
}

const verticalLinePlugin: Plugin<'line'> = {
    id: 'verticalLine',
    afterDatasetsDraw: (chart) => {
        const activeElements = chart.tooltip?.getActiveElements();
        if (activeElements && activeElements.length) {
            const ctx = chart.ctx;
            ctx.save();
            const activePoint = activeElements[0];
            const { x, y } = activePoint.element;
            const bottomY = chart.scales.y.bottom;

            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(x, y);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#6200EE';
            ctx.stroke();
            ctx.restore();
        }
    },
};

const customTooltip = (context: any) => {
    const tooltipModel = context.tooltip;
    let tooltipEl = document.getElementById('chartjs-tooltip');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.className = styles.chartjsTooltip;
        document.body.appendChild(tooltipEl);
    }

    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = '0';
        return;
    }

    const position = context.chart.canvas.getBoundingClientRect();
    const value = tooltipModel.dataPoints[0].formattedValue;
    const label = tooltipModel.title[0];
    const year = context.chart.data.datasets[0].data[0].year;

    const tooltipContent = document.createElement('div');
    tooltipContent.innerHTML = `<div class="${styles.tooltipTitle}">${label} ${year}</div><div class="${styles.tooltipValue}">$${value}</div>`;

    tooltipEl.innerHTML = tooltipContent.outerHTML;
    tooltipEl.style.opacity = '1';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
    tooltipEl.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY - 40}px`;
    tooltipEl.style.pointerEvents = 'none';
};

const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: false,
            external: customTooltip,
        },
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: false,
            },
            ticks: {
                color: '#8884d8',
                font: {
                    family: 'Avenir, sans-serif',
                    weight: 'bold',
                },

                // callback: function (value: string | number) {
                //     return this.getLabelForValue(value as number).toUpperCase();
                // },
            },
            border: {
                display: false,
            },
            offset: true,
        },
        y: {
            display: false,
            min: 0,
        },
    },
    layout: {
        padding: 0,
    },
    hover: {
        mode: 'index',
        intersect: false,
    },
};


const RevenueChart: React.FC<RevenueChartProps> = ({ data, labels, year }) => {
    const maxY = Math.max(...data) * 1.2;

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Revenue',
                data: data.map((amount, index) => ({ x: labels[index], y: amount, year })),
                borderColor: '#6200EE',
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
                    gradient.addColorStop(0, '#6138e03d');
                    gradient.addColorStop(1, '#6138e000');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 8,
                pointHoverBorderWidth: 2,
                pointHoverBorderColor: '#FFFFFF',
                pointHoverBackgroundColor: '#6200EE',
                borderWidth: 2,
            },
        ],
    };

    const dynamicOptions = {
        ...options,
        scales: {
            ...(options.scales || {}),
            y: {
                ...((options.scales && options.scales.y) || {}),
                min: 0,
                max: maxY,
            },
        },
    };

    return (
        <div className={styles.chartContainer}>
            <div className={styles.header}>
                <h2 className='headerText'>Revenue statistics</h2>
                <Button label='Export' noAppearance={true} icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.66675 7.70679L9.12873 11.1909L12.5934 7.70679" stroke="#909FBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0467 17.0294C4.81074 17.698 0.404078 13.2656 1.06608 7.99875C1.51741 4.41266 4.39607 1.51803 7.96074 1.06599C13.1901 0.403367 17.5901 4.82512 16.9354 10.0872C16.4894 13.6753 13.6121 16.5747 10.0467 17.0294Z" stroke="#909FBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                } iconPosition='left' size='small' />
            </div>
            <div>
                <Line data={chartData} options={dynamicOptions} plugins={[verticalLinePlugin]} />
            </div>
        </div>
    );
};

export default RevenueChart;
