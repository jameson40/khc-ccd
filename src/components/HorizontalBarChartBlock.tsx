import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { ReportBlock } from "@/components/ReportBlock";
import { useTranslations } from "next-intl";

interface HorizontalBarChartBlockProps {
    id: string;
    title: string;
    data: Record<string, number>;
}

const preprocessLabel = (label: string) => {
    return label
        .replace(/"/g, "")
        .replace(/'+/g, "")
        .replace(/ТОВАРИЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ/gi, "ТОО")
        .trim();
};

const formatNumber = (value: number) => {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)} млрд`;
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)} млн`;
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)} тыс`;
    }
    return value.toString();
};

export function HorizontalBarChartBlock({
    id,
    title,
    data,
}: HorizontalBarChartBlockProps) {
    const t = useTranslations("report");

    const chartData = Object.entries(data || {}).map(([name, value]) => ({
        name: preprocessLabel(name),
        value,
        original: name,
    }));

    return (
        <ReportBlock id={id} title={title}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                    <XAxis type="number" tickFormatter={formatNumber} />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={150}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value: number) => formatNumber(value)}
                        labelFormatter={(label: string, payload: any) =>
                            payload?.[0]?.payload?.original
                        }
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </ReportBlock>
    );
}
