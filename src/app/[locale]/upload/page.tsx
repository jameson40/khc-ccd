import UploadForm from "@/components/UploadForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Загрузка файла | Upload",
};

export default async function UploadPage() {
    return (
        <div className="max-w-5xl mx-auto py-10">
            <UploadForm />
        </div>
    );
}
