import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Home() {
    const t = await getTranslations("home");
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-6xl font-bold text-gray-900">{t("title")}</h1>
            <div>
                <Card>
                    <CardHeader title={t("cardTitle")} />
                    <CardContent>
                        <Link href={"/csv-report"}></Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
