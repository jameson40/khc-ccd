"use client";

import {
    Pie,
    PieChart,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { ReportBlock } from "@/components/ReportBlock";
import { useTranslations } from "next-intl";

interface ChartBlockProps {
    id: string;
    title: string;
    data: Record<string, number>;
    note?: React.ReactNode;
}

const COLORS = [
    "#22432D",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#00c49f",
    "#ffbb28",
    "#d0ed57",
    "#a4de6c",
];

export function ChartBlock({ id, title, data, note }: ChartBlockProps) {
    const t = useTranslations("report");

    const safeData = typeof data === "object" && data !== null ? data : {};
    const chartData = Object.entries(safeData).map(([name, value]) => ({
        name,
        value,
    }));

    return (
        <div
            className="w-full"
            style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
        >
            <ReportBlock id={id} title={title} note={note}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) =>
                                new Intl.NumberFormat("ru-RU").format(value)
                            }
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ fontSize: "0.875rem" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </ReportBlock>
        </div>
    );
}
