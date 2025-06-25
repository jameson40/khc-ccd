"use client";

import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function LangSwitcher() {
    const pathname = usePathname();
    const router = useRouter();

    const currentLocale = routing.locales.find((locale) =>
        pathname.startsWith(`/${locale}`)
    );

    const switchLocale = (locale: string) => {
        if (!currentLocale) return;

        const newPath = `/${locale}${pathname.slice(currentLocale.length + 1)}`;
        window.location.href = newPath;
    };

    return (
        <div className="flex gap-2">
            {routing.locales.map((locale) => (
                <Button
                    key={locale}
                    variant={currentLocale === locale ? "default" : "outline"}
                    onClick={() => switchLocale(locale)}
                >
                    {locale.toUpperCase()}
                </Button>
            ))}
        </div>
    );
}
