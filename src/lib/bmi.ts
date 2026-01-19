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
        category = 'น้ำหนักน้อย';
        color = '#3B82F6'; // Blue
        advice = 'คุณควรเพิ่มน้ำหนักโดยการรับประทานอาหารที่มีคุณค่าทางโภชนาการเพิ่มขึ้น';
    } else if (bmi < 25) {
        category = 'ปกติ';
        color = '#22C55E'; // Green
        advice = 'น้ำหนักของคุณอยู่ในเกณฑ์ปกติ รักษาสุขภาพด้วยการออกกำลังกายสม่ำเสมอ';
    } else if (bmi < 30) {
        category = 'น้ำหนักเกิน';
        color = '#F59E0B'; // Yellow
        advice = 'คุณควรลดน้ำหนักโดยการควบคุมอาหารและออกกำลังกายเพิ่มขึ้น';
    } else {
        category = 'อ้วน';
        color = '#EF4444'; // Red
        advice = 'คุณควรปรึกษาแพทย์เพื่อวางแผนลดน้ำหนักอย่างปลอดภัย';
    }

    return { bmi: roundedBMI, category, color, advice };
}

export function getCategoryColor(category: string): string {
    switch (category) {
        case 'น้ำหนักน้อย':
            return '#3B82F6';
        case 'ปกติ':
            return '#22C55E';
        case 'น้ำหนักเกิน':
            return '#F59E0B';
        case 'อ้วน':
            return '#EF4444';
        default:
            return '#6B7280';
    }
}
