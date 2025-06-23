"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxListProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (values: string[]) => void;
}

export function CheckboxList({
    label,
    options,
    selected,
    onChange,
}: CheckboxListProps) {
    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="grid grid-cols-2 gap-2">
                {options.map((option) => (
                    <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Checkbox
                            checked={selected.includes(option)}
                            onCheckedChange={() => toggle(option)}
                        />
                        <span className="text-sm">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
