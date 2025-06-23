"use client";

import React, { useState } from "react";
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

export default function UploadForm() {
    const t = useTranslations("upload");

    const [file, setFile] = useState<File | null>(null);
    const [filtersEnabled, setFiltersEnabled] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [regions, setRegions] = useState<string[]>([]);
    const [regionColumns, setRegionColumns] = useState<string[]>([]);
    const [regionColumn, setRegionColumn] = useState<string>("");
    const [statuses, setStatuses] = useState<string[]>([]);
    const [stages, setStages] = useState<string[]>([]);
    const [responsibles, setResponsibles] = useState<string[]>([]);

    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>(
        []
    );

    const uploadAndAnalyzeMutation = useMutation({
        mutationFn: async () => {
            if (!file) throw new Error("No file selected");
            const filters = {
                region_col: regionColumn,
                region: selectedRegions ?? [],
                status: selectedStatuses ?? [],
                stage: selectedStages ?? [],
                responsible: selectedResponsibles ?? [],
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
                    } = filtersRes.data;

                    setRegions(regions || []);
                    setRegionColumns(region_columns || []);
                    setStatuses(statuses || []);
                    setStages(stages || []);
                    setResponsibles(responsibles || []);

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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csv">{t("csv_label")}</Label>
                <Input
                    id="csv"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
            </div>
            <Button type="submit" disabled={!file}>
                {t("upload")}
            </Button>

            {filtersEnabled && (
                <div className="space-y-4">
                    <Label>{t("region_column_label")}</Label>
                    <Select onValueChange={(value) => setRegionColumn(value)}>
                        <SelectTrigger>
                            <SelectValue
                                placeholder={t("region_column_placeholder")}
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
                        enabled
                    />
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
                        label={t("responsible_label")}
                        options={responsibles}
                        selected={selectedResponsibles}
                        onChange={setSelectedResponsibles}
                    />
                    <Button
                        type="button"
                        onClick={() => uploadAndAnalyzeMutation.mutate()}
                    >
                        {t("analyze")}
                    </Button>
                </div>
            )}

            {result && (
                <div className="mt-6 bg-muted p-4 rounded">
                    <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </form>
    );
}
