"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface RegionMultiselectProps {
    onChange: (values: string[]) => void;
    selected: string[];
    enabled?: boolean;
    regionCol: string | null;
    fileId: string;
}

export default function RegionMultiselect({
    onChange,
    selected,
    enabled = false,
    regionCol,
    fileId
}: RegionMultiselectProps) {
    const t = useTranslations("upload");
    const [open, setOpen] = React.useState(false);

    const { data, isLoading } = useQuery<string[]>({
        queryKey: ["region_values", fileId, regionCol],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/regions_csv`,
                {
                    params: { file_id: fileId, region_col: regionCol },
                }
            );
            return res.data.regions;
        },
        enabled: enabled && !!fileId && !!regionCol,
    });

    const regions = data ?? [];

    const toggleSelection = (region: string) => {
        if (selected.includes(region)) {
            onChange(selected.filter((r) => r !== region));
        } else {
            onChange([...selected, region]);
        }
    };

    const selectAll = () => {
        onChange(regions);
    };

    const clearAll = () => {
        onChange([]);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-muted-foreground min-h-[2.5rem] text-left overflow-hidden"
                >
                    <div className="flex flex-wrap gap-1 max-w-full">
                        {selected.length > 0 ? (
                            selected.map((region) => (
                                <span
                                    key={region}
                                    className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs whitespace-nowrap max-w-[12rem] truncate"
                                    title={region}
                                >
                                    {region}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                {t("region_placeholder")}
                            </span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 z-50">
                <Command>
                    <CommandInput placeholder={t("search_region")} />
                    <CommandEmpty>{t("no_region_found")}</CommandEmpty>
                    <CommandGroup>
                        <CommandItem
                            onSelect={selectAll}
                            className="w-full font-medium"
                        >
                            + {t("regions_all")}
                        </CommandItem>
                        <CommandItem
                            onSelect={clearAll}
                            className="w-full font-medium"
                        >
                            × {t("clear")}
                        </CommandItem>
                        {Array.isArray(regions) &&
                            regions.map((region: string) => (
                                <CommandItem
                                    key={region}
                                    value={region}
                                    onSelect={() => toggleSelection(region)}
                                    className="w-full"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.includes(region)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {region}
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
