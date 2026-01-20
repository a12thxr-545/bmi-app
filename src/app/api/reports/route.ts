import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subWeeks, subMonths, subYears, format } from 'date-fns';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'daily';
        const dateParam = searchParams.get('date');

        const baseDate = dateParam ? new Date(dateParam) : new Date();

        let startDate: Date;
        let endDate: Date;
        let previousStartDate: Date;
        let previousEndDate: Date;
        let groupBy: 'hour' | 'day' | 'week' | 'month';
        let periodLabel: string;

        switch (type) {
            case 'daily':
                startDate = startOfDay(baseDate);
                endDate = endOfDay(baseDate);
                previousStartDate = startOfDay(subDays(baseDate, 1));
                previousEndDate = endOfDay(subDays(baseDate, 1));
                groupBy = 'hour';
                periodLabel = format(baseDate, 'd MMMM yyyy');
                break;
            case 'weekly':
                startDate = startOfWeek(baseDate, { weekStartsOn: 1 });
                endDate = endOfWeek(baseDate, { weekStartsOn: 1 });
                previousStartDate = startOfWeek(subWeeks(baseDate, 1), { weekStartsOn: 1 });
                previousEndDate = endOfWeek(subWeeks(baseDate, 1), { weekStartsOn: 1 });
                groupBy = 'day';
                periodLabel = `${format(startDate, 'd MMM')} - ${format(endDate, 'd MMM yyyy')}`;
                break;
            case 'monthly':
                startDate = startOfMonth(baseDate);
                endDate = endOfMonth(baseDate);
                previousStartDate = startOfMonth(subMonths(baseDate, 1));
                previousEndDate = endOfMonth(subMonths(baseDate, 1));
                groupBy = 'day';
                periodLabel = format(baseDate, 'MMMM yyyy');
                break;
            case 'yearly':
                startDate = startOfYear(baseDate);
                endDate = endOfYear(baseDate);
                previousStartDate = startOfYear(subYears(baseDate, 1));
                previousEndDate = endOfYear(subYears(baseDate, 1));
                groupBy = 'month';
                periodLabel = format(baseDate, 'yyyy');
                break;
            default:
                return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
        }

        // Get current period records
        const currentRecords = await prisma.bMIRecord.findMany({
            where: {
                userId: session.user.id,
                recordedAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { recordedAt: 'asc' },
        });

        // Get previous period records for comparison
        const previousRecords = await prisma.bMIRecord.findMany({
            where: {
                userId: session.user.id,
                recordedAt: {
                    gte: previousStartDate,
                    lte: previousEndDate,
                },
            },
        });

        // Calculate statistics
        const calculateStats = (records: typeof currentRecords) => {
            if (records.length === 0) {
                return { min: 0, max: 0, avg: 0, count: 0 };
            }
            const bmis = records.map(r => r.bmi);
            return {
                min: Math.min(...bmis),
                max: Math.max(...bmis),
                avg: Math.round((bmis.reduce((a, b) => a + b, 0) / bmis.length) * 100) / 100,
                count: records.length,
            };
        };

        const currentStats = calculateStats(currentRecords);
        const previousStats = calculateStats(previousRecords);

        // Calculate change
        const bmiChange = currentStats.avg && previousStats.avg
            ? Math.round((currentStats.avg - previousStats.avg) * 100) / 100
            : 0;

        // Group data for chart
        const groupedData = groupRecordsByPeriod(currentRecords, groupBy, startDate, endDate);

        // Category distribution
        const categoryDistribution = currentRecords.reduce((acc, record) => {
            acc[record.category] = (acc[record.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return NextResponse.json({
            period: {
                type,
                label: periodLabel,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            },
            statistics: {
                current: currentStats,
                previous: previousStats,
                change: bmiChange,
            },
            chartData: groupedData,
            categoryDistribution,
            records: currentRecords,
        });
    } catch (error) {
        console.error('Error generating report:', error);
        return NextResponse.json(
            { error: 'Error generating report' },
            { status: 500 }
        );
    }
}

interface BMIRecord {
    id: string;
    userId: string;
    weight: number;
    height: number;
    bmi: number;
    category: string;
    recordedAt: Date;
    createdAt: Date;
}

function groupRecordsByPeriod(
    records: BMIRecord[],
    groupBy: 'hour' | 'day' | 'week' | 'month',
    startDate: Date,
    endDate: Date
) {
    const grouped: { label: string; bmi: number | null; weight: number | null; count: number }[] = [];

    const formatMap = {
        hour: 'HH:00',
        day: 'dd/MM',
        week: "'W'w",
        month: 'MMM',
    };

    // Create all periods
    const periods: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
        periods.push(new Date(current));
        switch (groupBy) {
            case 'hour':
                current.setHours(current.getHours() + 1);
                break;
            case 'day':
                current.setDate(current.getDate() + 1);
                break;
            case 'week':
                current.setDate(current.getDate() + 7);
                break;
            case 'month':
                current.setMonth(current.getMonth() + 1);
                break;
        }
    }

    for (const period of periods) {
        const label = format(period, formatMap[groupBy]);
        const periodRecords = records.filter(r => {
            const recordDate = new Date(r.recordedAt);
            switch (groupBy) {
                case 'hour':
                    return recordDate.getHours() === period.getHours() &&
                        recordDate.getDate() === period.getDate();
                case 'day':
                    return recordDate.getDate() === period.getDate() &&
                        recordDate.getMonth() === period.getMonth();
                case 'week':
                    return Math.floor((recordDate.getTime() - period.getTime()) / (7 * 24 * 60 * 60 * 1000)) === 0;
                case 'month':
                    return recordDate.getMonth() === period.getMonth();
            }
        });

        if (periodRecords.length > 0) {
            const avgBmi = periodRecords.reduce((sum, r) => sum + r.bmi, 0) / periodRecords.length;
            const avgWeight = periodRecords.reduce((sum, r) => sum + r.weight, 0) / periodRecords.length;
            grouped.push({
                label,
                bmi: Math.round(avgBmi * 100) / 100,
                weight: Math.round(avgWeight * 100) / 100,
                count: periodRecords.length,
            });
        } else {
            grouped.push({ label, bmi: null, weight: null, count: 0 });
        }
    }

    return grouped;
}
