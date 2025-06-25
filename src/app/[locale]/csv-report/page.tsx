import UploadForm from "@/components/UploadForm";
import { getTranslations } from "next-intl/server";

export default async function UploadPage() {
    const t = await getTranslations("upload");
    return (
        <main className="max-w-5xl mx-auto py-24 flex flex-col gap-5 items-center p-5">
            <h1 className="text-4xl text-center">{t("title")}</h1>
            <UploadForm />
        </main>
    );
}
