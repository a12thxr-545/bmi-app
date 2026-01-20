'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                identifier,
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
            setError('An error occurred during login');
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
                    <h1 className="auth-title">Login</h1>
                    <p className="auth-subtitle">Welcome back to BMI Tracker</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-error mb-4">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Email or Username</label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="form-input"
                            placeholder="your@email.com or username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
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
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Don&apos;t have an account? <Link href="/register">Sign Up</Link>
                </div>

                {/* Student Info Card */}
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                    borderRadius: '12px',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        🎓 67162110483-9
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-secondary)'
                        }}>
                            <span style={{ opacity: 0.7 }}>👤</span>
                            <span>Username:</span>
                            <code style={{
                                background: 'rgba(99, 102, 241, 0.15)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                fontWeight: '600',
                                color: 'var(--text)'
                            }}>arthur</code>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-secondary)'
                        }}>
                            <span style={{ opacity: 0.7 }}>🔑</span>
                            <span>Password:</span>
                            <code style={{
                                background: 'rgba(99, 102, 241, 0.15)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                fontWeight: '600',
                                color: 'var(--text)'
                            }}>54567890</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

