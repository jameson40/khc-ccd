"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { RegionMultiselect } from "@/components/RegionMultiselect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckboxList } from "@/components/CheckboxList";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "./ui/card";
import { usePrintPdf } from "@/lib/usePrintPdf";
import { PrintableReport } from "./PrintableReport";

export default function UploadForm() {
    const t = useTranslations("upload");
    const r = useTranslations("report");

    const [file, setFile] = useState<File | null>(null);
    const [filtersEnabled, setFiltersEnabled] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [regions, setRegions] = useState<string[]>([]);
    const [regionColumns, setRegionColumns] = useState<string[]>([]); // это список всех доступных колонок, содержащих слово "Регион"
    const [regionColumn, setRegionColumn] = useState<string>(""); // это одна конкретно выбранная колонка из этого списка
    const [statuses, setStatuses] = useState<string[]>([]);
    const [stages, setStages] = useState<string[]>([]);
    const [responsibles, setResponsibles] = useState<string[]>([]);
    const [funnels, setFunnels] = useState<string[]>([]);
    const [dealsType, setDealsType] = useState<string[]>([]);

    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>(
        []
    );
    const [selectedFunnels, setSelectedFunnels] = useState<string[]>([]);
    const [selectedDealsType, setSelectedDealsType] = useState<string[]>([]);

    const [appliedFilters, setAppliedFilters] = useState<{
        regions?: string[];
        statuses?: string[];
        stages?: string[];
        responsibles?: string[];
        funnels?: string[];
        deals_type: string[];
    }>();

    const reportRef = useRef<HTMLDivElement>(null);
    const { print } = usePrintPdf(reportRef);

    const uploadAndAnalyzeMutation = useMutation({
        mutationFn: async () => {
            if (!file) throw new Error("No file selected");
            const filters = {
                region_col: regionColumn,
                region: selectedRegions ?? [],
                status: selectedStatuses ?? [],
                stage: selectedStages ?? [],
                responsible: selectedResponsibles ?? [],
                funnel: selectedFunnels ?? [],
                deal_type: selectedDealsType ?? [],
            };
            const formData = new FormData();
            formData.append("csv_file", file);
            formData.append("filters", JSON.stringify(filters));
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/analyze`,
                formData
            );
            return res.data;
        },
        onSuccess: async (data) => {
            setResult(data);
            setAppliedFilters({
                regions: selectedRegions,
                statuses: selectedStatuses,
                stages: selectedStages,
                responsibles: selectedResponsibles,
                funnels: selectedFunnels,
                deals_type: selectedDealsType,
            });
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("csv_file", file);

        try {
            const uploadRes = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/upload`,
                formData
            );

            if (uploadRes.status === 200) {
                const filtersRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/filters`
                );

                if (filtersRes.status === 200) {
                    const {
                        regions,
                        region_columns,
                        statuses,
                        stages,
                        responsibles,
                        funnels,
                        deals_type,
                    } = filtersRes.data;

                    setRegions(regions || []);
                    setRegionColumns(region_columns || []);
                    setStatuses(statuses || []);
                    setStages(stages || []);
                    setResponsibles(responsibles || []);
                    setFunnels(funnels || []);
                    setDealsType(deals_type || []);

                    setFiltersEnabled(true);
                }
            }
        } catch (err) {
            console.error(
                "[FRONT] Ошибка при загрузке или получении фильтров:",
                err
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-5">
                <Label htmlFor="csv">{t("csv_label")}</Label>
                <div className="flex gap-5">
                    <Input
                        id="csv"
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="w-1/5"
                    />
                    <Button type="submit" disabled={!file} className="">
                        {t("upload")}
                    </Button>
                </div>
            </div>
            {filtersEnabled && (
                <Card className="relative group p-5">
                    <CardHeader>{t("filters_title")}</CardHeader>
                    <CardContent className="grid auto-rows-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-5">
                            <Label>{t("region_column_label")}</Label>
                            <Select
                                onValueChange={(value) =>
                                    setRegionColumn(value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            "region_column_placeholder"
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {regionColumns.map((col) => (
                                        <SelectItem key={col} value={col}>
                                            {col}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <RegionMultiselect
                                selected={selectedRegions}
                                onChange={setSelectedRegions}
                                regionCol={regionColumn}
                                enabled={!!regionColumn}
                            />
                        </div>
                        <CheckboxList
                            label={t("status_label")}
                            options={statuses}
                            selected={selectedStatuses}
                            onChange={setSelectedStatuses}
                        />
                        <CheckboxList
                            label={t("stage_label")}
                            options={stages}
                            selected={selectedStages}
                            onChange={setSelectedStages}
                        />
                        <CheckboxList
                            label={t("funnel_label")}
                            options={funnels}
                            selected={selectedFunnels}
                            onChange={setSelectedFunnels}
                        />
                        <CheckboxList
                            label={t("deal_type_label")}
                            options={dealsType}
                            selected={selectedDealsType}
                            onChange={setSelectedDealsType}
                        />
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <CheckboxList
                                label={t("responsible_label")}
                                options={responsibles}
                                selected={selectedResponsibles}
                                onChange={setSelectedResponsibles}
                            />
                        </div>
                    </CardContent>
                    <Button
                        type="button"
                        onClick={() => uploadAndAnalyzeMutation.mutate()}
                    >
                        {t("analyze")}
                    </Button>
                </Card>
            )}

            {result && (
                <>
                    <PrintableReport
                        ref={reportRef}
                        result={result}
                        title={r("title")}
                        subtitle={t("filters_summary")}
                        filters={appliedFilters}
                    />
                    <div className="flex justify-end mt-4">
                        <Button onClick={print}>{t("download_pdf")}</Button>
                    </div>
                </>
            )}
        </form>
    );
}
