"use client";

import React, { useState, useRef } from "react";
import UploadForm from "@/components/forms/UploadForm";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { useTranslations } from "next-intl";
import { usePrintPdf } from "@/lib/usePrintPdf";
import { ReportBlock } from "@/components/ReportBlock";
import { HorizontalBarChartBlock } from "@/components/charts/HorizontalBarChartBlock";
import ExcelFiltersForm from "@/components/forms/ExcelFiltersForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ExcelReportPage() {
    const t = useTranslations("upload");
    const r = useTranslations("report");

    const [fileId, setFileId] = useState<string | null>(null);
    const [sheets, setSheets] = useState<string[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
    const [filtersState, setFiltersState] = useState<any>(null);
    const [result, setResult] = useState<any>(null);

    const reportRef = useRef<HTMLDivElement>(null);
    const { print } = usePrintPdf(reportRef);

    const [debugInfo, setDebugInfo] = useState<any>(null);

    const { data: filters, isFetching: isLoadingFilters } = useQuery({
        queryKey: ["filters_excel", fileId, selectedSheet],
        queryFn: async () => {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/get_excel_filters`,
                {
                    file_id: fileId,
                    sheet_name: selectedSheet,
                }
            );
            return res.data;
        },
        enabled: !!fileId && !!selectedSheet && filtersState === null,
    });

    const analyzeMutation = useMutation({
        mutationFn: async (filtersPayload: any) => {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/analyze_excel`,
                {
                    fileId,
                    sheet_name: selectedSheet,
                    filters: filtersPayload,
                }
            );
            return res.data;
        },
        onSuccess: (data) => setResult(data),
    });

    return (
        <main className="max-w-5xl mx-auto py-24 flex flex-col gap-5 items-center p-5">
            <h1 className="text-4xl text-center">{t("excel_page_title")}</h1>

            <UploadForm
                type="excel"
                onUploaded={(id, sheetList) => {
                    setFileId(id);
                    if (sheetList) setSheets(sheetList);
                }}
                onDebugInfo={setDebugInfo}
            />

            {fileId && sheets.length > 0 && (
                <Select onValueChange={setSelectedSheet}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите лист Excel" />
                    </SelectTrigger>
                    <SelectContent>
                        {sheets.map((sheet) => (
                            <SelectItem key={sheet} value={sheet}>
                                {sheet}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {isLoadingFilters && <Loading />}

            {filters && fileId && (
                <ExcelFiltersForm
                    filters={filters}
                    onAnalyze={(f) => {
                        setFiltersState(f);
                        analyzeMutation.mutate(f);
                    }}
                />
            )}

            {analyzeMutation.isPending && <Loading />}

            {result && (
                <div ref={reportRef} className="w-full flex flex-col gap-8">
                    <ReportBlock id="summary" title={r("summary_title")}>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>
                                {r("total_rows")}: {result.total_rows}
                            </li>
                            <li>
                                {r("total_cost")}:{" "}
                                {result.total_cost.toLocaleString()}
                            </li>
                            <li>
                                {r("avg_cost")}:{" "}
                                {result.avg_cost.toLocaleString()}
                            </li>
                            <li>
                                {r("total_area")}:{" "}
                                {result.total_area.toLocaleString()}
                            </li>
                        </ul>
                    </ReportBlock>

                    <HorizontalBarChartBlock
                        id="by_region"
                        title={r("by_region")}
                        data={result.by_region}
                    />

                    <HorizontalBarChartBlock
                        id="by_sheet"
                        title={r("by_sheet")}
                        data={result.by_sheet}
                    />

                    <HorizontalBarChartBlock
                        id="by_year"
                        title={r("by_year")}
                        data={result.by_year}
                    />

                    <HorizontalBarChartBlock
                        id="top_builders"
                        title={r("top_builders_by_cost")}
                        data={result.top_builders_by_cost}
                    />

                    <div className="flex justify-end">
                        <Button onClick={print}>{t("download_pdf")}</Button>
                    </div>
                </div>
            )}
        </main>
    );
}
