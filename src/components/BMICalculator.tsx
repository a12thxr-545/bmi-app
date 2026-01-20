'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BMIResult {
    bmi: number;
    category: string;
    color: string;
    advice: string;
}

export default function BMICalculator() {
    const router = useRouter();
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<BMIResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/bmi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    weight: parseFloat(weight),
                    height: parseFloat(height),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }

            setResult(data.bmiResult);

            // Refresh the page data after 2 seconds
            setTimeout(() => {
                router.refresh();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
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

    const resetForm = () => {
        setWeight('');
        setHeight('');
        setResult(null);
        setError('');
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">⚖️ Calculate BMI</h3>
            </div>

            {result ? (
                <div className="bmi-gauge">
                    <div className="bmi-value" style={{ color: result.color }}>
                        {result.bmi}
                    </div>
                    <div
                        className={`bmi-category badge ${getCategoryBadgeClass(result.category)}`}
                        style={{ marginTop: '1rem' }}
                    >
                        {result.category}
                    </div>
                    <p className="text-secondary mt-4 text-center" style={{ maxWidth: '300px' }}>
                        {result.advice}
                    </p>
                    <button onClick={resetForm} className="btn btn-secondary mt-6">
                        Record New
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-error mb-4">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Weight (kg)</label>
                        <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="500"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="form-input"
                            placeholder="e.g. 65.5"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Height (cm)</label>
                        <input
                            type="number"
                            step="0.1"
                            min="50"
                            max="300"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="form-input"
                            placeholder="e.g. 170"
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
                                Saving...
                            </>
                        ) : (
                            'Save and Calculate BMI'
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
