"use client";

import React, { useEffect, useState } from "react";
import UploadForm from "@/components/forms/UploadForm";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { PrintableReport } from "@/components/PrintableReport";
import { usePrintPdf } from "@/lib/usePrintPdf";
import { useTranslations } from "next-intl";
import CSVFiltersForm from "@/components/forms/CSVFiltersForm";

export default function CSVReportPage() {
    const t = useTranslations("upload");
    const r = useTranslations("report");

    const [fileId, setFileId] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [filtersState, setFiltersState] = useState<any>(null);

    const reportRef = React.useRef<HTMLDivElement>(null);
    const { print } = usePrintPdf(reportRef);

    const {
        data: filters,
        isFetching: isLoadingFilters,
        refetch: refetchFilters,
    } = useQuery({
        queryKey: ["filters_csv", fileId],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/filters_csv?file_id=${fileId}`
            );
            return res.data;
        },
        enabled: false,
    });

    useEffect(() => {
        if (fileId) {
            refetchFilters();
        }
    }, [fileId]);

    const analyzeMutation = useMutation({
        mutationFn: async (filtersPayload: any) => {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/analyze_csv`,
                {
                    file_id: fileId,
                    filters: filtersPayload,
                }
            );
            return res.data;
        },
        onSuccess: (data) => setResult(data),
    });

    const handleFileUpload = async (id: string) => {
        setFileId(id);
        setResult(null);
        setFiltersState(null);
        await refetchFilters(); // вручную дергаем filters_csv после загрузки
    };

    return (
        <main className="max-w-5xl mx-auto py-24 flex flex-col gap-5 items-center p-5">
            <h1 className="text-4xl text-center">{t("title")}</h1>
            <UploadForm type="csv" onUploaded={handleFileUpload} />

            {isLoadingFilters && <Loading />}

            {filters && fileId && (
                <CSVFiltersForm
                    filters={filters}
                    onAnalyze={(filtersPayload) => {
                        setFiltersState(filtersPayload);
                        analyzeMutation.mutate(filtersPayload);
                    }}
                />
            )}

            {analyzeMutation.isPending && <Loading />}

            {result && (
                <>
                    <PrintableReport
                        ref={reportRef}
                        result={result}
                        title={r("title")}
                        subtitle={t("filters_summary")}
                        filters={filtersState}
                    />
                    <div className="flex justify-end mt-4">
                        <Button onClick={print}>{t("download_pdf")}</Button>
                    </div>
                </>
            )}
        </main>
    );
}
