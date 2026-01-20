'use client';

import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    ComposedChart,
} from 'recharts';

interface ChartData {
    label: string;
    bmi: number | null;
    weight: number | null;
    count: number;
}

interface BMIChartProps {
    data: ChartData[];
    showWeight?: boolean;
}

const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string; color: string }>;
    label?: string;
}) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: 'rgba(30, 41, 59, 0.95)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                }}
            >
                <p style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: '8px' }}>
                    {label}
                </p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color, fontSize: '14px' }}>
                        {entry.dataKey === 'bmi' ? 'BMI' : 'Weight'}: {entry.value}
                        {entry.dataKey === 'weight' ? ' kg' : ''}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function BMIChart({ data, showWeight = false }: BMIChartProps) {
    const filteredData = data.filter((d) => d.bmi !== null);

    if (filteredData.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <p className="empty-state-description">No data available for this period</p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="bmiGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis
                        dataKey="label"
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        yAxisId="bmi"
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[15, 35]}
                    />
                    {showWeight && (
                        <YAxis
                            yAxisId="weight"
                            orientation="right"
                            stroke="#22C55E"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                    )}
                    <Tooltip content={<CustomTooltip />} />

                    {/* BMI Reference Lines */}
                    <ReferenceLine
                        yAxisId="bmi"
                        y={18.5}
                        stroke="#3B82F6"
                        strokeDasharray="5 5"
                        strokeOpacity={0.5}
                    />
                    <ReferenceLine
                        yAxisId="bmi"
                        y={25}
                        stroke="#F59E0B"
                        strokeDasharray="5 5"
                        strokeOpacity={0.5}
                    />
                    <ReferenceLine
                        yAxisId="bmi"
                        y={30}
                        stroke="#EF4444"
                        strokeDasharray="5 5"
                        strokeOpacity={0.5}
                    />

                    <Area
                        yAxisId="bmi"
                        type="monotone"
                        dataKey="bmi"
                        stroke="#6366F1"
                        fill="url(#bmiGradient)"
                        strokeWidth={0}
                        connectNulls
                    />
                    <Line
                        yAxisId="bmi"
                        type="monotone"
                        dataKey="bmi"
                        stroke="#6366F1"
                        strokeWidth={3}
                        dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#818CF8' }}
                        connectNulls
                    />

                    {showWeight && (
                        <>
                            <Area
                                yAxisId="weight"
                                type="monotone"
                                dataKey="weight"
                                stroke="#22C55E"
                                fill="url(#weightGradient)"
                                strokeWidth={0}
                                connectNulls
                            />
                            <Line
                                yAxisId="weight"
                                type="monotone"
                                dataKey="weight"
                                stroke="#22C55E"
                                strokeWidth={2}
                                dot={{ fill: '#22C55E', strokeWidth: 2, r: 3 }}
                                connectNulls
                            />
                        </>
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
