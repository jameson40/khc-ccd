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
}

const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#00c49f",
    "#ffbb28",
    "#d0ed57",
    "#a4de6c",
];

export function ChartBlock({ id, title, data }: ChartBlockProps) {
    const t = useTranslations("report");

    const chartData = Object.entries(data).map(([name, value]) => ({
        name,
        value,
    }));

    return (
        <ReportBlock id={id} title={title}>
            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
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
            </div>
        </ReportBlock>
    );
}
