import React, { forwardRef } from "react";
import { ReportBlock } from "@/components/ReportBlock";
import { ChartBlock } from "@/components/charts/ChartBlock";
import { HorizontalBarChartBlock } from "@/components/charts/HorizontalBarChartBlock";
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
        funnels?: string[];
        deals_type?: string[];
    };
}

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(
    ({ result, title, subtitle, filters }, ref) => {
        const t = useTranslations("report.summary");
        const u = useTranslations("upload");

        const summaryItems = Object.entries(result)
            .filter(
                ([key, value]) =>
                    !key.endsWith("_note") &&
                    (typeof value === "number" || typeof value === "string")
            )
            .map(([key, value]) => (
                <ReportBlock key={key} id={key} title={t(key)}>
                    {typeof value === "number"
                        ? value.toLocaleString()
                        : String(value)}
                </ReportBlock>
            ));

        const notesMap = Object.entries(result)
            .filter(([key]) => key.endsWith("_note"))
            .reduce((acc, [key, val]) => {
                const targetKey = key.replace(/_note$/, "");
                acc[targetKey] = val as string | Record<string, string>;
                return acc;
            }, {} as Record<string, string | Record<string, string>>);

        const chartItems = Object.entries(result)
            .filter(
                ([key, value]) =>
                    typeof value === "object" &&
                    value !== null &&
                    !Array.isArray(value) &&
                    !key.endsWith("_note")
            )
            .map(([key, value]) => {
                const Component = key.startsWith("top_")
                    ? HorizontalBarChartBlock
                    : ChartBlock;

                const rawNote = notesMap[key];
                let note: string | undefined;

                try {
                    note =
                        typeof rawNote === "object" && rawNote !== null
                            ? t(`${key}_note`, rawNote)
                            : typeof rawNote === "string"
                            ? rawNote
                            : undefined;
                } catch {
                    note = undefined;
                }

                return (
                    <Component
                        key={key}
                        id={key}
                        title={t(key)}
                        data={value as Record<string, number>}
                        note={note}
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
                        <div>
                            {u("funnels")}:{" "}
                            {filters.funnels?.length
                                ? filters.funnels.join(", ")
                                : u("funnels_all")}
                        </div>
                        <div>
                            {u("deals_type")}:{" "}
                            {filters.deals_type?.length
                                ? filters.deals_type.join(", ")
                                : u("deals_type_all")}
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
