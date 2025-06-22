"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { RegionMultiselect } from "@/components/RegionMultiselect";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function UploadForm() {
    const t = useTranslations("upload");
    const [file, setFile] = useState<File | null>(null);
    const [filters, setFilters] = useState({ region: [] as string[] });
    const [result, setResult] = useState<any>(null);

    const mutation = useMutation({
        mutationFn: async () => {
            if (!file) return;

            const formData = new FormData();
            formData.append("csv_file", file);
            formData.append("filters", JSON.stringify(filters));

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/analyze`,
                formData
            );
            return res.data;
        },
        onSuccess: (data) => setResult(data),
        onError: (err) => {
            console.error("Analyze error:", err);
        },
    });

    return (
        <div className="space-y-4">
            <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFile(f);
                }}
            />

            {file && (
                <RegionMultiselect
                    selected={filters.region ? filters.region : []}
                    enabled={!!file}
                    onChange={(regions) =>
                        setFilters((prev) => ({ ...prev, region: regions }))
                    }
                />
            )}

            <Button onClick={() => mutation.mutate()}>{t("analyze")}</Button>

            {result && (
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
}
