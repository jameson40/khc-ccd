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
}

export function RegionMultiselect({
    onChange,
    selected,
    enabled = false,
}: RegionMultiselectProps) {
    const t = useTranslations("upload");
    const [open, setOpen] = React.useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["regions"],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/regions`
            );
            if (!res.data) throw new Error("Пустой ответ от API");
            return res.data.regions || res.data; // поддержка и старого формата
        },
        enabled,
    });

    const regions = data || [];

    const toggleSelection = (region: string) => {
        if (selected.includes(region)) {
            onChange(selected.filter((r) => r !== region));
        } else {
            onChange([...selected, region]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-fit justify-between text-muted-foreground"
                >
                    {selected.length > 0
                        ? selected.join(", ")
                        : t("region_placeholder")}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={t("search_region")} />
                    <CommandEmpty>{t("no_region_found")}</CommandEmpty>
                    <CommandGroup>
                        {regions.map((region: string) => (
                            <CommandItem
                                key={region}
                                value={region}
                                onSelect={() => toggleSelection(region)}
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
