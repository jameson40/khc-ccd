"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import axios from "axios";
import { RegionMultiselect } from "./RegionMultiselect";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function UploadForm() {
    const t = useTranslations("upload");
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [filters, setFilters] = useState<any>({});
    const [response, setResponse] = useState<any>(null);

    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!file) throw new Error("Нет файла");
            const formData = new FormData();
            formData.append("csv_file", file);
            await axios.post(`${API_URL}/upload`, formData);
        },
        onSuccess: () => setStep(2),
        onError: (e) => alert("Ошибка при загрузке CSV: " + e.message),
    });

    const analyzeMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("filters", JSON.stringify(filters));
            const res = await axios.post(`${API_URL}/analyze`, formData);
            return res.data;
        },
        onSuccess: setResponse,
        onError: (e) => alert("Ошибка анализа: " + e.message),
    });

    const { data: availableFilters } = useQuery({
        queryKey: ["filters"],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/filters`);
            return res.data;
        },
        enabled: step === 2,
    });

    return (
        <div className="max-w-xl mx-auto py-10 space-y-4">
            {step === 1 && (
                <>
                    <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Button
                        onClick={() => uploadMutation.mutate()}
                        disabled={!file}
                    >
                        {t("submit")}
                    </Button>
                </>
            )}

            {step === 2 && availableFilters && (
                <>
                    <RegionMultiselect
                        values={availableFilters.regions}
                        onChange={(v) =>
                            setFilters((f: any) => ({ ...f, region: v }))
                        }
                    />
                    {/* можно сюда же статус, стадия и др. добавить */}
                    <Button onClick={() => analyzeMutation.mutate()}>
                        {t("analyze")}
                    </Button>
                </>
            )}

            {response && (
                <pre className="bg-muted p-4 text-sm whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
                </pre>
            )}
        </div>
    );
}
