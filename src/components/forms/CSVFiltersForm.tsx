"use client";

import React, { useState } from "react";
import RegionMultiselect  from "@/components/filters/RegionMultiselect";
import { CheckboxList } from "@/components/filters/CheckboxList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface CsvFiltersFormProps {
    filters: any;
    onAnalyze: (filters: any) => void;
}

export default function CSVFiltersForm({
    filters,
    onAnalyze,
}: CsvFiltersFormProps) {
    const t = useTranslations("upload");

    const [regionColumn, setRegionColumn] = useState<string>("");
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [selectedFunnels, setSelectedFunnels] = useState<string[]>([]);
    const [selectedDealsType, setSelectedDealsType] = useState<string[]>([]);
    const [selectedResponsibles, setSelectedResponsibles] = useState<string[]>(
        []
    );

    return (
        <Card className="p-5">
            <CardHeader>{t("filters_title")}</CardHeader>
            <CardContent className="grid auto-rows-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex flex-col gap-5">
                    <label>{t("region_column_label")}</label>
                    <Select onValueChange={setRegionColumn}>
                        <SelectTrigger>
                            <SelectValue
                                placeholder={t("region_column_placeholder")}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {filters.region_columns.map((col: string) => (
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
                    options={filters.statuses}
                    selected={selectedStatuses}
                    onChange={setSelectedStatuses}
                />
                <CheckboxList
                    label={t("stage_label")}
                    options={filters.stages}
                    selected={selectedStages}
                    onChange={setSelectedStages}
                />
                <CheckboxList
                    label={t("funnel_label")}
                    options={filters.funnels}
                    selected={selectedFunnels}
                    onChange={setSelectedFunnels}
                />
                <CheckboxList
                    label={t("deal_type_label")}
                    options={filters.deals_type}
                    selected={selectedDealsType}
                    onChange={setSelectedDealsType}
                />
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <CheckboxList
                        label={t("responsible_label")}
                        options={filters.responsibles}
                        selected={selectedResponsibles}
                        onChange={setSelectedResponsibles}
                    />
                </div>
            </CardContent>
            <Button
                className="mt-4"
                onClick={() =>
                    onAnalyze({
                        region_col: regionColumn,
                        region: selectedRegions,
                        status: selectedStatuses,
                        stage: selectedStages,
                        funnel: selectedFunnels,
                        deals_type: selectedDealsType,
                        responsible: selectedResponsibles,
                    })
                }
            >
                {t("analyze")}
            </Button>
        </Card>
    );
}
