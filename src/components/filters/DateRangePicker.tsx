import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type DateRange } from "react-day-picker";
import { useTranslations } from "next-intl";

interface DateRangePickerProps {
    label: string;
    onChange: (value: { start: string; end: string }) => void;
}

export function DateRangePicker({ label, onChange }: DateRangePickerProps) {
    const t = useTranslations("upload")
    const [date, setDate] = React.useState<DateRange | undefined>();

    React.useEffect(() => {
        if (date?.from && date?.to) {
            onChange({
                start: date.from.toISOString().split("T")[0],
                end: date.to.toISOString().split("T")[0],
            });
        }
    }, [date, onChange]);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">{label}</label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            "w-[260px] justify-start text-left font-normal",
                            !date?.from && "text-muted-foreground"
                        )}
                    >
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} –{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>{t("choose_period")}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}