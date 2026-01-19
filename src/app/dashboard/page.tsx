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
        label: new Date(r.recordedAt).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short'
        }),
        bmi: r.bmi,
        weight: r.weight,
        count: 1,
    }));

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
                    <h1 className="page-title">
                        สวัสดี, {session.user.name || session.user.email} 👋
                    </h1>
                    <p className="page-description">
                        ยินดีต้อนรับสู่ BMI Tracker ของคุณ
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-4 mb-6">
                    <div className="card stat-card">
                        <div className="stat-label">BMI ล่าสุด</div>
                        <div className="stat-value" style={{
                            color: latestRecord ?
                                latestRecord.category === 'ปกติ' ? '#22C55E' :
                                    latestRecord.category === 'น้ำหนักน้อย' ? '#3B82F6' :
                                        latestRecord.category === 'น้ำหนักเกิน' ? '#F59E0B' : '#EF4444'
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
                        <div className="stat-label">น้ำหนักล่าสุด</div>
                        <div className="stat-value">
                            {latestRecord ? `${latestRecord.weight}` : '-'}
                        </div>
                        <span className="text-muted text-sm">กิโลกรัม</span>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-label">ส่วนสูงล่าสุด</div>
                        <div className="stat-value">
                            {latestRecord ? `${latestRecord.height}` : '-'}
                        </div>
                        <span className="text-muted text-sm">เซนติเมตร</span>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-label">จำนวนบันทึก</div>
                        <div className="stat-value">{totalRecords}</div>
                        <span className="text-muted text-sm">รายการ</span>
                    </div>
                </div>

                <div className="grid grid-2">
                    {/* Quick Actions */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">⚡ การดำเนินการด่วน</h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Link href="/bmi" className="btn btn-primary">
                                ⚖️ บันทึก BMI ใหม่
                            </Link>
                            <Link href="/reports" className="btn btn-secondary">
                                📊 ดูรายงาน MIS
                            </Link>
                            <Link href="/history" className="btn btn-secondary">
                                📋 ดูประวัติทั้งหมด
                            </Link>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">📈 สถิติ BMI</h3>
                        </div>
                        <div className="grid grid-3">
                            <div className="text-center">
                                <div className="stat-value text-lg">{avgBMI || '-'}</div>
                                <div className="text-muted text-sm">เฉลี่ย</div>
                            </div>
                            <div className="text-center">
                                <div className="stat-value text-lg" style={{ color: '#22C55E' }}>
                                    {minBMI || '-'}
                                </div>
                                <div className="text-muted text-sm">ต่ำสุด</div>
                            </div>
                            <div className="text-center">
                                <div className="stat-value text-lg" style={{ color: '#EF4444' }}>
                                    {maxBMI || '-'}
                                </div>
                                <div className="text-muted text-sm">สูงสุด</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BMI Chart */}
                <div className="card mt-6">
                    <div className="card-header">
                        <h3 className="card-title">📉 แนวโน้ม BMI (7 วันล่าสุด)</h3>
                        <Link href="/reports" className="btn btn-ghost btn-sm">
                            ดูทั้งหมด →
                        </Link>
                    </div>
                    {chartData.length > 0 ? (
                        <BMIChart data={chartData} showWeight />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <h3 className="empty-state-title">ยังไม่มีข้อมูล</h3>
                            <p className="empty-state-description">
                                เริ่มบันทึก BMI ครั้งแรกของคุณเพื่อดูกราฟแนวโน้ม
                            </p>
                            <Link href="/bmi" className="btn btn-primary">
                                บันทึก BMI
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent Records */}
                {records.length > 0 && (
                    <div className="card mt-6">
                        <div className="card-header">
                            <h3 className="card-title">📋 บันทึกล่าสุด</h3>
                            <Link href="/history" className="btn btn-ghost btn-sm">
                                ดูทั้งหมด →
                            </Link>
                        </div>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>วันที่</th>
                                        <th>น้ำหนัก</th>
                                        <th>ส่วนสูง</th>
                                        <th>BMI</th>
                                        <th>สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.slice(0, 5).map((record) => (
                                        <tr key={record.id}>
                                            <td>
                                                {new Date(record.recordedAt).toLocaleDateString('th-TH', {
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
