'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navLinks = [
        { href: '/dashboard', label: 'แดชบอร์ด', icon: '📊' },
        { href: '/bmi', label: 'บันทึก BMI', icon: '⚖️' },
        { href: '/history', label: 'ประวัติ', icon: '📋' },
        { href: '/reports', label: 'รายงาน', icon: '📈' },
    ];

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link href={session ? '/dashboard' : '/'} className="navbar-brand">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                    BMI Tracker
                </Link>

                {session ? (
                    <div className="navbar-nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span className="text-sm text-secondary">
                                {session.user.name || session.user.email}
                            </span>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="btn btn-ghost btn-sm"
                            >
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="navbar-nav">
                        <Link href="/login" className="btn btn-ghost">
                            เข้าสู่ระบบ
                        </Link>
                        <Link href="/register" className="btn btn-primary">
                            สมัครสมาชิก
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
