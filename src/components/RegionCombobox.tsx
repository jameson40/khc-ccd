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

interface RegionComboboxProps {
    onChange: (value: string) => void;
    enabled?: boolean;
}

export function RegionCombobox({ onChange, enabled = false, }: RegionComboboxProps) {
    const t = useTranslations("upload");
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["regions"],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/regions`
            );
            if (!res.data) throw new Error("Пустой ответ от API");
            console.log("regions response:", res.data);

            return res.data.regions;
        },
        enabled
    });

    const regions = data || [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? regions.find((region: string) => region === value)
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
                                onSelect={(currentValue) => {
                                    setValue(currentValue);
                                    onChange(currentValue);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === region
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
