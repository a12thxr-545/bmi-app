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
                    <h1 className="page-title">⚖️ Record BMI</h1>
                    <p className="page-description">
                        Enter your weight and height to calculate your BMI
                    </p>
                </div>

                <BMICalculator />

                {/* BMI Reference */}
                <div className="card mt-6">
                    <div className="card-header">
                        <h3 className="card-title">📋 BMI Categories</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="badge badge-blue">Underweight</span>
                            <span className="text-secondary">&lt; 18.5</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="badge badge-green">Normal</span>
                            <span className="text-secondary">18.5 - 24.9</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="badge badge-yellow">Overweight</span>
                            <span className="text-secondary">25 - 29.9</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="badge badge-red">Obese</span>
                            <span className="text-secondary">≥ 30</span>
                        </div>
                    </div>
                </div>

                {/* Formula */}
                <div className="card mt-6">
                    <div className="card-header">
                        <h3 className="card-title">🧮 BMI Formula</h3>
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
                            BMI = Weight (kg) ÷ Height (m)²
                        </code>
                        <p className="text-muted text-sm mt-3">
                            Example: Weight 65 kg, Height 170 cm = 65 ÷ (1.7)² = 22.49
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
