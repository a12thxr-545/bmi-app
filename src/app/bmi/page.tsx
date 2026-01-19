import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import BMICalculator from '@/components/BMICalculator';

export default async function BMIPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '500px' }}>
                <div className="page-header text-center">
                    <h1 className="page-title">⚖️ บันทึก BMI</h1>
                    <p className="page-description">
                        กรอกน้ำหนักและส่วนสูงเพื่อคำนวณค่า BMI ของคุณ
                    </p>
                </div>

                <BMICalculator />

                {/* BMI Reference */}
                <div className="card mt-6">
                    <div className="card-header">
                        <h3 className="card-title">📋 เกณฑ์ค่า BMI</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="badge badge-blue">น้ำหนักน้อย</span>
                            <span className="text-secondary">&lt; 18.5</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="badge badge-green">ปกติ</span>
                            <span className="text-secondary">18.5 - 24.9</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="badge badge-yellow">น้ำหนักเกิน</span>
                            <span className="text-secondary">25 - 29.9</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="badge badge-red">อ้วน</span>
                            <span className="text-secondary">≥ 30</span>
                        </div>
                    </div>
                </div>

                {/* Formula */}
                <div className="card mt-6">
                    <div className="card-header">
                        <h3 className="card-title">🧮 สูตรคำนวณ BMI</h3>
                    </div>
                    <div className="text-center">
                        <code style={{
                            display: 'inline-block',
                            padding: '1rem 2rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '1.125rem',
                            fontFamily: 'monospace',
                        }}>
                            BMI = น้ำหนัก (kg) ÷ ส่วนสูง (m)²
                        </code>
                        <p className="text-muted text-sm mt-3">
                            ตัวอย่าง: น้ำหนัก 65 kg, ส่วนสูง 170 cm = 65 ÷ (1.7)² = 22.49
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
