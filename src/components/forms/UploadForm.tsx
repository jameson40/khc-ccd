"use client";

import React, { useState } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "../Loading";

interface UploadFormProps {
    type: "csv" | "excel";
    onUploaded: (fileId: string, sheets?: string[]) => void;
    onDebugInfo?: (info: any) => void;
}

export default function UploadForm({
    type,
    onUploaded,
    onDebugInfo,
}: UploadFormProps) {
    const t = useTranslations("upload");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const uploadUrl =
                type === "csv"
                    ? `${process.env.NEXT_PUBLIC_API_URL}/upload_csv`
                    : `${process.env.NEXT_PUBLIC_API_URL}/list_excel_sheets`;

            const uploadRes = await axios.post(uploadUrl, formData);

            onDebugInfo?.(uploadRes.data);

            if (uploadRes.status === 200 && uploadRes.data.file_id) {
                onUploaded(uploadRes.data.file_id, uploadRes.data.sheets);
            }
        } catch (err) {
            console.error("[FRONT] Ошибка при загрузке:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-5">
                <Label htmlFor="uploadFile">
                    {type === "csv" ? t("csv_label") : t("excel_label")}
                </Label>
                <div className="flex gap-5">
                    <Input
                        id="uploadFile"
                        type="file"
                        accept={type === "csv" ? ".csv" : ".xlsx,.xls"}
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="w-1/5"
                    />
                    <Button type="submit" disabled={!file || loading}>
                        {t("upload")}
                    </Button>
                </div>
            </div>
            {loading && <Loading />}
        </form>
    );
}
