export interface BMIResult {
    bmi: number;
    category: string;
    color: string;
    advice: string;
}

export function calculateBMI(weight: number, heightCm: number): BMIResult {
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    const roundedBMI = Math.round(bmi * 100) / 100;

    let category: string;
    let color: string;
    let advice: string;

    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#3B82F6'; // Blue
        advice = 'You should increase your weight by eating more nutritious food.';
    } else if (bmi < 25) {
        category = 'Normal';
        color = '#22C55E'; // Green
        advice = 'Your weight is normal. Keep it up by exercising regularly.';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = '#F59E0B'; // Yellow
        advice = 'You should lose weight by controlling your diet and exercising more.';
    } else {
        category = 'Obese';
        color = '#EF4444'; // Red
        advice = 'You should consult a doctor to plan for safe weight loss.';
    }

    return { bmi: roundedBMI, category, color, advice };
}

export function getCategoryColor(category: string): string {
    switch (category) {
        case 'Underweight':
            return '#3B82F6';
        case 'Normal':
            return '#22C55E';
        case 'Overweight':
            return '#F59E0B';
        case 'Obese':
            return '#EF4444';
        default:
            return '#6B7280';
    }
}
