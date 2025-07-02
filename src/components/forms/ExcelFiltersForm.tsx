"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckboxList } from "@/components/filters/CheckboxList";
import { useTranslations } from "next-intl";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRangePicker } from "../filters/DateRangePicker";

interface ExcelFiltersFormProps {
    filters: any;
    onAnalyze: (filters: any) => void;
}

export default function ExcelFiltersForm({
    filters,
    onAnalyze,
}: ExcelFiltersFormProps) {
    const t = useTranslations("upload");

    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
    const [selectedDevelopers, setSelectedDevelopers] = useState<string[]>([]);
    const [areaRange, setAreaRange] = useState<[number, number] | null>(null);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    return (
        <Card className="p-5">
            <CardHeader>{t("filters_title")}</CardHeader>
            <CardContent className="grid auto-rows-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filters.regions && (
                    <CheckboxList
                        label={t("region_label")}
                        options={filters.regions}
                        selected={selectedRegions}
                        onChange={setSelectedRegions}
                    />
                )}

                {filters.developers && (
                    <CheckboxList
                        label={t("developer_label")}
                        options={filters.developers}
                        selected={selectedDevelopers}
                        onChange={setSelectedDevelopers}
                    />
                )}

                {filters.sheets && (
                    <Select onValueChange={setSelectedSheet}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("sheet_label")} />
                        </SelectTrigger>
                        <SelectContent>
                            {filters.sheets.map((sheet: string) => (
                                <SelectItem key={sheet} value={sheet}>
                                    {sheet}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {filters.area && (
                    <DateRangePicker
                        label={t("date_range_label")}
                        onChange={(value) =>
                            onAnalyze({
                                ...filters,
                                start_date: value.start,
                                end_date: value.end,
                            })
                        }
                    />
                )}

                {filters.period && (
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-muted-foreground">
                                {t("start_date_label")}
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        {startDate
                                            ? format(startDate, "yyyy-MM-dd")
                                            : t("pick_date")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-muted-foreground">
                                {t("end_date_label")}
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        {endDate
                                            ? format(endDate, "yyyy-MM-dd")
                                            : t("pick_date")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </>
                )}
            </CardContent>
            <Button
                className="mt-4"
                onClick={() =>
                    onAnalyze({
                        regions: selectedRegions,
                        developers: selectedDevelopers,
                        sheet: selectedSheet,
                        area: areaRange && {
                            min: areaRange[0],
                            max: areaRange[1],
                        },
                        start_date: startDate?.toISOString().split("T")[0],
                        end_date: endDate?.toISOString().split("T")[0],
                    })
                }
            >
                {t("analyze")}
            </Button>
        </Card>
    );
}
