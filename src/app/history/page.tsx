'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface BMIRecord {
    id: string;
    weight: number;
    height: number;
    bmi: number;
    category: string;
    recordedAt: string;
}

export default function HistoryPage() {
    const { data: session, status } = useSession();
    const [records, setRecords] = useState<BMIRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 10;

    const fetchRecords = useCallback(async () => {
        try {
            const offset = (page - 1) * limit;
            const response = await fetch(`/api/bmi?limit=${limit}&offset=${offset}`);
            const data = await response.json();
            setRecords(data.records);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        if (session) {
            fetchRecords();
        }
    }, [session, fetchRecords]);

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

    const totalPages = Math.ceil(total / limit);

    const handleDelete = async (id: string) => {
        if (!confirm('คุณต้องการลบข้อมูลนี้หรือไม่?')) return;

        try {
            const response = await fetch(`/api/bmi/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchRecords();
            }
        } catch (error) {
            console.error('Error deleting record:', error);
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
                    <h1 className="page-title">📋 ประวัติการบันทึก BMI</h1>
                    <p className="page-description">
                        ดูประวัติการบันทึก BMI ทั้งหมดของคุณ
                    </p>
                </div>

                <div className="card">
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <h3 className="empty-state-title">ยังไม่มีข้อมูล</h3>
                            <p className="empty-state-description">
                                คุณยังไม่มีบันทึก BMI เริ่มบันทึกครั้งแรกได้เลย
                            </p>
                            <a href="/bmi" className="btn btn-primary">
                                บันทึก BMI
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>วันที่/เวลา</th>
                                            <th>น้ำหนัก (kg)</th>
                                            <th>ส่วนสูง (cm)</th>
                                            <th>BMI</th>
                                            <th>สถานะ</th>
                                            <th>การดำเนินการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((record) => (
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
                                                <td>
                                                    <button
                                                        onClick={() => handleDelete(record.id)}
                                                        className="btn btn-ghost btn-sm"
                                                        style={{ color: 'var(--danger)' }}
                                                    >
                                                        🗑️ ลบ
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-4">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        ← ก่อนหน้า
                                    </button>
                                    <span className="flex items-center px-4 text-secondary">
                                        หน้า {page} จาก {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        ถัดไป →
                                    </button>
                                </div>
                            )}

                            <div className="text-center text-muted text-sm mt-4">
                                ทั้งหมด {total} รายการ
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
