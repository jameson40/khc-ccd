import React, { forwardRef } from "react";
import { ReportBlock } from "@/components/ReportBlock";
import { ChartBlock } from "@/components/ChartBlock";
import { HorizontalBarChartBlock } from "@/components/HorizontalBarChartBlock";
import { useTranslations } from "next-intl";

interface PrintableReportProps {
    result: Record<string, unknown>;
    title: string;
    subtitle?: string;
    filters?: {
        regions?: string[];
        statuses?: string[];
        stages?: string[];
        responsibles?: string[];
    };
}

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(
    ({ result, title, subtitle, filters }, ref) => {
        const t = useTranslations("report.summary");
        const u = useTranslations("upload");

        const summaryItems = Object.entries(result)
            .filter(
                ([_, value]) =>
                    typeof value === "number" || typeof value === "string"
            )
            .map(([key, value]) => (
                <ReportBlock key={key} id={key} title={t(key)}>
                    {typeof value === "number"
                        ? value.toLocaleString()
                        : String(value)}
                </ReportBlock>
            ));

        const chartItems = Object.entries(result)
            .filter(
                ([_, value]) =>
                    typeof value === "object" &&
                    value !== null &&
                    !Array.isArray(value)
            )
            .map(([key, value]) => {
                const Component = key.startsWith("top_")
                    ? HorizontalBarChartBlock
                    : ChartBlock;

                return (
                    <Component
                        key={key}
                        id={key}
                        title={t(key)}
                        data={value as Record<string, number>}
                    />
                );
            });

        return (
            <div
                ref={ref}
                className="min-w-full mx-auto p-5 rounded-lg shadow text-gray-900"
            >
                <h1 className="text-2xl font-bold text-center mb-1">{title}</h1>
                {subtitle && (
                    <p className="text-center text-sm text-muted-foreground mb-2">
                        {subtitle}
                    </p>
                )}

                {filters && (
                    <div className="text-sm text-muted-foreground mb-6 space-y-1 text-center">
                        <div>
                            {u("regions")}:{" "}
                            {filters.regions?.length
                                ? filters.regions.join(", ")
                                : u("regions_all")}
                        </div>
                        <div>
                            {u("statuses")}:{" "}
                            {filters.statuses?.length
                                ? filters.statuses.join(", ")
                                : u("statuses_all")}
                        </div>
                        <div>
                            {u("stages")}:{" "}
                            {filters.stages?.length
                                ? filters.stages.join(", ")
                                : u("stages_all")}
                        </div>  
                        <div>
                            {u("responsibles")}:{" "}
                            {filters.responsibles?.length
                                ? filters.responsibles.join(", ")
                                : u("responsibles_all")}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-5 mb-8">
                    {summaryItems}
                </div>

                <div className="flex flex-col gap-5">{chartItems}</div>
            </div>
        );
    }
);

PrintableReport.displayName = "PrintableReport";
