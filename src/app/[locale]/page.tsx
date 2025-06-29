import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Home() {
    const t = await getTranslations("home");
    const u = await getTranslations("upload");
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full gap-10">
            <h1 className="text-6xl font-bold text-gray-900">{t("title")}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <Link href={"/csv-report"} className="hover:shadow-md ease-in-out rounded-xl duration-200">
                    <Card className="rounded-xl">
                        <CardContent>{u("title")}</CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
