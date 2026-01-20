import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import BMIChart from '@/components/BMIChart';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    // Get user's BMI records
    const records = await prisma.bMIRecord.findMany({
        where: { userId: session.user.id },
        orderBy: { recordedAt: 'desc' },
        take: 7,
    });

    const latestRecord = records[0];
    const totalRecords = await prisma.bMIRecord.count({
        where: { userId: session.user.id },
    });

    // Calculate statistics
    const allRecords = await prisma.bMIRecord.findMany({
        where: { userId: session.user.id },
    });

    let avgBMI = 0;
    let minBMI = 0;
    let maxBMI = 0;

    if (allRecords.length > 0) {
        const bmis = allRecords.map((r) => r.bmi);
        avgBMI = Math.round((bmis.reduce((a, b) => a + b, 0) / bmis.length) * 100) / 100;
        minBMI = Math.min(...bmis);
        maxBMI = Math.max(...bmis);
    }

    // Prepare chart data
    const chartData = [...records].reverse().map((r) => ({
        label: new Date(r.recordedAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short'
        }),
        bmi: r.bmi,
        weight: r.weight,
        count: 1,
    }));

    const getCategoryBadgeClass = (category: string) => {
        switch (category) {
            case 'Underweight': return 'badge-blue';
            case 'Normal': return 'badge-green';
            case 'Overweight': return 'badge-yellow';
            case 'Obese': return 'badge-red';
            default: return '';
        }
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">
                        Hello, {session.user.name || session.user.email} 👋
                    </h1>
                    <p className="page-description">
                        Welcome to your BMI Tracker
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-4 mb-6">
                    <div className="card stat-card">
                        <div className="stat-label">Latest BMI</div>
                        <div className="stat-value" style={{
                            color: latestRecord ?
                                latestRecord.category === 'Normal' ? '#22C55E' :
                                    latestRecord.category === 'Underweight' ? '#3B82F6' :
                                        latestRecord.category === 'Overweight' ? '#F59E0B' : '#EF4444'
                                : '#64748B'
                        }}>
                            {latestRecord ? latestRecord.bmi : '-'}
                        </div>
                        {latestRecord && (
                            <span className={`badge ${getCategoryBadgeClass(latestRecord.category)}`}>
                                {latestRecord.category}
                            </span>
                        )}
                    </div>

                    <div className="card stat-card">
                        <div className="stat-label">Latest Weight</div>
                        <div className="stat-value">
                            {latestRecord ? `${latestRecord.weight}` : '-'}
                        </div>
                        <span className="text-muted text-sm">kg</span>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-label">Latest Height</div>
                        <div className="stat-value">
                            {latestRecord ? `${latestRecord.height}` : '-'}
                        </div>
                        <span className="text-muted text-sm">cm</span>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-label">Total Records</div>
                        <div className="stat-value">{totalRecords}</div>
                        <span className="text-muted text-sm">records</span>
                    </div>
                </div>

                <div className="grid grid-2">
                    {/* Quick Actions */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">⚡ Quick Actions</h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Link href="/bmi" className="btn btn-primary">
                                ⚖️ Record New BMI
                            </Link>
                            <Link href="/reports" className="btn btn-secondary">
                                📊 View MIS Reports
                            </Link>
                            <Link href="/history" className="btn btn-secondary">
                                📋 View All History
                            </Link>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">📈 BMI Statistics</h3>
                        </div>
                        <div className="grid grid-3">
                            <div className="text-center">
                                <div className="stat-value text-lg">{avgBMI || '-'}</div>
                                <div className="text-muted text-sm">Average</div>
                            </div>
                            <div className="text-center">
                                <div className="stat-value text-lg" style={{ color: '#22C55E' }}>
                                    {minBMI || '-'}
                                </div>
                                <div className="text-muted text-sm">Min</div>
                            </div>
                            <div className="text-center">
                                <div className="stat-value text-lg" style={{ color: '#EF4444' }}>
                                    {maxBMI || '-'}
                                </div>
                                <div className="text-muted text-sm">Max</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BMI Chart */}
                <div className="card mt-6">
                    <div className="card-header">
                        <h3 className="card-title">📉 BMI Trend (Last 7 Days)</h3>
                        <Link href="/reports" className="btn btn-ghost btn-sm">
                            View All →
                        </Link>
                    </div>
                    {chartData.length > 0 ? (
                        <BMIChart data={chartData} showWeight />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <h3 className="empty-state-title">No Data</h3>
                            <p className="empty-state-description">
                                Start recording your BMI to see the trend graph
                            </p>
                            <Link href="/bmi" className="btn btn-primary">
                                Record BMI
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent Records */}
                {records.length > 0 && (
                    <div className="card mt-6">
                        <div className="card-header">
                            <h3 className="card-title">📋 Recent Records</h3>
                            <Link href="/history" className="btn btn-ghost btn-sm">
                                View All →
                            </Link>
                        </div>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Weight</th>
                                        <th>Height</th>
                                        <th>BMI</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.slice(0, 5).map((record) => (
                                        <tr key={record.id}>
                                            <td>
                                                {new Date(record.recordedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </td>
                                            <td>{record.weight} kg</td>
                                            <td>{record.height} cm</td>
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
            </div>
        </div>
    );
}
