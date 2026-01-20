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
        if (!confirm('Are you sure you want to delete this record?')) return;

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
                    <h1 className="page-title">📋 BMI History</h1>
                    <p className="page-description">
                        View your entire BMI history
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
                            <h3 className="empty-state-title">No data available</h3>
                            <p className="empty-state-description">
                                You have no BMI records. Start your first record now.
                            </p>
                            <a href="/bmi" className="btn btn-primary">
                                Record BMI
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date/Time</th>
                                            <th>Weight (kg)</th>
                                            <th>Height (cm)</th>
                                            <th>BMI</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((record) => (
                                            <tr key={record.id}>
                                                <td>
                                                    {new Date(record.recordedAt).toLocaleDateString('en-US', {
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
                                                        🗑️ Delete
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
                                        ← Previous
                                    </button>
                                    <span className="flex items-center px-4 text-secondary">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}

                            <div className="text-center text-muted text-sm mt-4">
                                Total {total} records
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
