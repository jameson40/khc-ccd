import UploadForm from "@/components/UploadForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
    title: "Загрузка файла | Upload",
};

export default async function UploadPage() {
    return (
        <div className="max-w-2xl mx-auto py-10">
            <UploadForm />
        </div>
    );
}
