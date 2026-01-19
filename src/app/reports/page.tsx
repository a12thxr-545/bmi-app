'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import BMIChart from '@/components/BMIChart';
import { format, addDays, addWeeks, addMonths, addYears, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { th } from 'date-fns/locale';

interface ReportData {
    period: {
        type: string;
        label: string;
        startDate: string;
        endDate: string;
    };
    statistics: {
        current: { min: number; max: number; avg: number; count: number };
        previous: { min: number; max: number; avg: number; count: number };
        change: number;
    };
    chartData: Array<{ label: string; bmi: number | null; weight: number | null; count: number }>;
    categoryDistribution: Record<string, number>;
    records: Array<{
        id: string;
        weight: number;
        height: number;
        bmi: number;
        category: string;
        recordedAt: string;
    }>;
}

type ReportType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function ReportsPage() {
    const { data: session, status } = useSession();
    const [reportType, setReportType] = useState<ReportType>('weekly');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchReport = useCallback(async () => {
        setLoading(true);
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const response = await fetch(`/api/reports?type=${reportType}&date=${dateStr}`);
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    }, [reportType, selectedDate]);

    useEffect(() => {
        if (session) {
            fetchReport();
        }
    }, [session, fetchReport]);

    if (status === 'loading') {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        redirect('/login');
    }

    const navigatePeriod = (direction: 'prev' | 'next') => {
        const modifier = direction === 'prev' ? -1 : 1;
        switch (reportType) {
            case 'daily':
                setSelectedDate(modifier === -1 ? subDays(selectedDate, 1) : addDays(selectedDate, 1));
                break;
            case 'weekly':
                setSelectedDate(modifier === -1 ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1));
                break;
            case 'monthly':
                setSelectedDate(modifier === -1 ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1));
                break;
            case 'yearly':
                setSelectedDate(modifier === -1 ? subYears(selectedDate, 1) : addYears(selectedDate, 1));
                break;
        }
    };

    const getCategoryBadgeClass = (category: string) => {
        switch (category) {
            case 'น้ำหนักน้อย': return 'badge-blue';
            case 'ปกติ': return 'badge-green';
            case 'น้ำหนักเกิน': return 'badge-yellow';
            case 'อ้วน': return 'badge-red';
            default: return '';
        }
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">📊 รายงาน MIS</h1>
                    <p className="page-description">
                        วิเคราะห์ข้อมูล BMI ของคุณในรูปแบบต่างๆ
                    </p>
                </div>

                {/* Report Type Tabs */}
                <div className="tabs mb-6">
                    {(['daily', 'weekly', 'monthly', 'yearly'] as ReportType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setReportType(type)}
                            className={`tab ${reportType === type ? 'active' : ''}`}
                        >
                            {type === 'daily' && '📅 รายวัน'}
                            {type === 'weekly' && '📆 รายสัปดาห์'}
                            {type === 'monthly' && '🗓️ รายเดือน'}
                            {type === 'yearly' && '📊 รายปี'}
                        </button>
                    ))}
                </div>

                {/* Date Navigation */}
                <div className="card mb-6">
                    <div className="flex items-center justify-center gap-4">
                        <button onClick={() => navigatePeriod('prev')} className="btn btn-secondary btn-icon">
                            ←
                        </button>
                        <div className="text-center">
                            <div className="font-semibold text-lg">
                                {reportData?.period.label || format(selectedDate, 'd MMMM yyyy', { locale: th })}
                            </div>
                        </div>
                        <button onClick={() => navigatePeriod('next')} className="btn btn-secondary btn-icon">
                            →
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : reportData ? (
                    <>
                        {/* Statistics Cards */}
                        <div className="grid grid-4 mb-6">
                            <div className="card stat-card">
                                <div className="stat-label">จำนวนบันทึก</div>
                                <div className="stat-value">{reportData.statistics.current.count}</div>
                                <span className="text-muted text-sm">รายการ</span>
                            </div>

                            <div className="card stat-card">
                                <div className="stat-label">BMI เฉลี่ย</div>
                                <div className="stat-value">
                                    {reportData.statistics.current.avg || '-'}
                                </div>
                                {reportData.statistics.change !== 0 && (
                                    <span className={`stat-change ${reportData.statistics.change > 0 ? 'negative' : 'positive'}`}>
                                        {reportData.statistics.change > 0 ? '↑' : '↓'} {Math.abs(reportData.statistics.change)}
                                    </span>
                                )}
                            </div>

                            <div className="card stat-card">
                                <div className="stat-label">BMI ต่ำสุด</div>
                                <div className="stat-value" style={{ color: '#22C55E' }}>
                                    {reportData.statistics.current.min || '-'}
                                </div>
                            </div>

                            <div className="card stat-card">
                                <div className="stat-label">BMI สูงสุด</div>
                                <div className="stat-value" style={{ color: '#EF4444' }}>
                                    {reportData.statistics.current.max || '-'}
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="card mb-6">
                            <div className="card-header">
                                <h3 className="card-title">📈 กราฟแนวโน้ม BMI</h3>
                            </div>
                            <BMIChart data={reportData.chartData} showWeight />
                        </div>

                        {/* Category Distribution & Comparison */}
                        <div className="grid grid-2 mb-6">
                            {/* Category Distribution */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">📊 การกระจายตัว</h3>
                                </div>
                                {Object.keys(reportData.categoryDistribution).length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {Object.entries(reportData.categoryDistribution).map(([category, count]) => (
                                            <div key={category} className="flex items-center justify-between">
                                                <span className={`badge ${getCategoryBadgeClass(category)}`}>
                                                    {category}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        style={{
                                                            width: `${(count / reportData.statistics.current.count) * 100}px`,
                                                            height: '8px',
                                                            background: 'var(--primary)',
                                                            borderRadius: '4px',
                                                        }}
                                                    />
                                                    <span className="text-secondary">{count} รายการ</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted text-center">ไม่มีข้อมูล</p>
                                )}
                            </div>

                            {/* Period Comparison */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">📉 เปรียบเทียบกับช่วงก่อนหน้า</h3>
                                </div>
                                <div className="grid grid-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-muted text-sm mb-2">ช่วงปัจจุบัน</div>
                                        <div className="stat-value text-lg">
                                            {reportData.statistics.current.avg || '-'}
                                        </div>
                                        <div className="text-muted text-sm">{reportData.statistics.current.count} รายการ</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-muted text-sm mb-2">ช่วงก่อนหน้า</div>
                                        <div className="stat-value text-lg">
                                            {reportData.statistics.previous.avg || '-'}
                                        </div>
                                        <div className="text-muted text-sm">{reportData.statistics.previous.count} รายการ</div>
                                    </div>
                                </div>
                                {reportData.statistics.change !== 0 && (
                                    <div className="text-center mt-4">
                                        <span className={`badge ${reportData.statistics.change < 0 ? 'badge-green' : 'badge-red'}`}>
                                            {reportData.statistics.change > 0 ? '+' : ''}{reportData.statistics.change} BMI
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Records Table */}
                        {reportData.records.length > 0 && (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">📋 รายละเอียดข้อมูล</h3>
                                </div>
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>วันที่/เวลา</th>
                                                <th>น้ำหนัก (kg)</th>
                                                <th>ส่วนสูง (cm)</th>
                                                <th>BMI</th>
                                                <th>สถานะ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.records.map((record) => (
                                                <tr key={record.id}>
                                                    <td>
                                                        {new Date(record.recordedAt).toLocaleDateString('th-TH', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </td>
                                                    <td>{record.weight}</td>
                                                    <td>{record.height}</td>
                                                    <td className="font-semibold">{record.bmi}</td>
                                                    <td>
                                                        <span className={`badge ${getCategoryBadgeClass(record.category)}`}>
                                                            {record.category}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <h3 className="empty-state-title">ไม่มีข้อมูล</h3>
                            <p className="empty-state-description">
                                ไม่พบข้อมูลสำหรับช่วงเวลานี้
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
