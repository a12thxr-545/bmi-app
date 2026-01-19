'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        if (password.length < 8) {
            setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'เกิดข้อผิดพลาด');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <div className="auth-header">
                    <svg className="auth-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                    <h1 className="auth-title">สมัครสมาชิก</h1>
                    <p className="auth-subtitle">สร้างบัญชีใหม่เพื่อเริ่มใช้งาน</p>
                </div>

                {success ? (
                    <div className="alert alert-success text-center">
                        ✅ สมัครสมาชิกสำเร็จ! กำลังนำไปหน้าเข้าสู่ระบบ...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-error mb-4">{error}</div>}

                        <div className="form-group">
                            <label className="form-label">ชื่อ-นามสกุล</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                                placeholder="ชื่อ นามสกุล"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">อีเมล *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">รหัสผ่าน * (อย่างน้อย 8 ตัวอักษร)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">ยืนยันรหัสผ่าน *</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ width: '1rem', height: '1rem' }}></span>
                                    กำลังสมัครสมาชิก...
                                </>
                            ) : (
                                'สมัครสมาชิก'
                            )}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    มีบัญชีแล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
                </div>
            </div>
        </div>
    );
}
