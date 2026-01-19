'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch {
            setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
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
                    <h1 className="auth-title">เข้าสู่ระบบ</h1>
                    <p className="auth-subtitle">ยินดีต้อนรับกลับสู่ BMI Tracker</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-error mb-4">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">อีเมล</label>
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
                        <label className="form-label">รหัสผ่าน</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                                กำลังเข้าสู่ระบบ...
                            </>
                        ) : (
                            'เข้าสู่ระบบ'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
                </div>
            </div>
        </div>
    );
}
