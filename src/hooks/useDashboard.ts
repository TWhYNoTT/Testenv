// src/hooks/useDashboard.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/api';
import { useUser } from '../contexts/UserContext';
import type { DashboardSummaryResponse } from '../types/api-responses';

export type DateRangeKey = 'alltime' | 'last7days' | 'last30days' | 'dateselected';

export interface DashboardSummary {
    totalAppointments: number;
    employees: number;
    activeBranches: number;
}

export interface BookingsRevenueData {
    labels: string[]; // e.g., ['Oct 01', 'Oct 02', ...]
    bookings: number[]; // booking counts per day
    amounts: number[]; // revenue per day (AED)
    totalRevenue: number; // sum of period
    reservationRate: number; // paid / total for period
}

export interface RevenueSeriesData {
    labels: string[]; // month names
    data: number[]; // revenue per month
    year: number;
}

export interface AppointmentStatsData {
    labels: string[]; // status labels
    values: number[]; // percentages per status (0-100)
}

interface UseDashboardOptions {
    date?: Date | null;
    range?: DateRangeKey;
}

const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};

const endOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
};

const formatDayLabel = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const useDashboard = (opts?: UseDashboardOptions) => {
    const { user } = useUser();

    const [range, setRange] = useState<DateRangeKey>(opts?.range || 'last30days');
    const [selectedDate, setSelectedDate] = useState<Date | null>(opts?.date || null);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [summary, setSummary] = useState<DashboardSummary>({ totalAppointments: 0, employees: 0, activeBranches: 0 });
    const [bookingsRevenue, setBookingsRevenue] = useState<BookingsRevenueData>({ labels: [], bookings: [], amounts: [], totalRevenue: 0, reservationRate: 0 });
    const [revenueSeries, setRevenueSeries] = useState<RevenueSeriesData>({ labels: monthLabels, data: Array(12).fill(0), year: new Date().getFullYear() });
    const [appointmentStats, setAppointmentStats] = useState<AppointmentStatsData>({ labels: ['Pending', 'Confirm', 'Rejected', 'Completed'], values: [0, 0, 0, 0] });
    const [lastSuccessfulLoad, setLastSuccessfulLoad] = useState<number | null>(null);

    const computeRange = useMemo(() => {
        const now = new Date();
        let start: Date | null = null;
        let end: Date | null = null;

        switch (range) {
            case 'last7days':
                end = endOfDay(now);
                start = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
                break;
            case 'last30days':
                end = endOfDay(now);
                start = startOfDay(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));
                break;
            case 'dateselected':
                if (selectedDate) {
                    start = startOfDay(selectedDate);
                    end = endOfDay(selectedDate);
                }
                break;
            case 'alltime':
            default:
                start = null;
                end = null;
                break;
        }
        return { start, end };
    }, [range, selectedDate]);

    const load = useCallback(async (): Promise<boolean> => {
        if (!user?.businessId) return false;
        setLoading(true);
        setError(null);
        try {
            const start = computeRange.start?.toISOString();
            const end = computeRange.end?.toISOString();
            const res: DashboardSummaryResponse = await apiService.getDashboardSummary(start, end);

            setSummary({
                totalAppointments: res.totalAppointments,
                employees: res.employees,
                activeBranches: res.activeBranches
            });

            setBookingsRevenue({
                labels: res.bookingsRevenue.labels,
                bookings: res.bookingsRevenue.bookings,
                amounts: res.bookingsRevenue.amounts.map(Number),
                totalRevenue: Number(res.bookingsRevenue.totalRevenue),
                reservationRate: Number(res.bookingsRevenue.reservationRate)
            });

            setRevenueSeries({
                labels: res.revenueSeries.labels,
                data: res.revenueSeries.data.map(Number),
                year: res.revenueSeries.year
            });

            setAppointmentStats({
                labels: res.appointmentStats.labels,
                values: res.appointmentStats.values
            });
            setLastSuccessfulLoad(Date.now());
            return true;
        } catch (e: any) {
            setError(e?.message || 'Failed to load dashboard');
            return false;
        } finally {
            setLoading(false);
        }
    }, [user?.businessId, computeRange]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        // state
        loading,
        error,
        // filters
        range,
        setRange,
        selectedDate,
        setSelectedDate,
        // data
        summary,
        bookingsRevenue,
        revenueSeries,
        appointmentStats,
        lastSuccessfulLoad,
        // actions
        refresh: load,
    } as const;
};
