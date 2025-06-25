import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import logo from "../../public/logo.png";
import Image from "next/image";

export default async function Header() {
    const t = await getTranslations("nav");

    return (
        <header className="w-full border-b shadow-sm bg-white px-10 py-3 flex justify-between items-center">
            <div className="flex items-center gap-5">
                <Image src={logo} className="h-10 w-fit" alt="logo" />
            </div>

            <div className="flex items-center gap-5 w-full justify-between">
                <NavigationMenu className="px-5">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Button asChild variant="ghost">
                                <Link href="/">
                                    {t("home", { default: "Home" })}
                                </Link>
                            </Button>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                {t("instruments", { default: "Instruments" })}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="flex flex-col gap-2 min-w-fit items-end p-5">
                                    <li className="row-span-3">
                                        <Link
                                            href="/csv-report"
                                            className="block text-sm from-muted/50 to-muted min-w-max h-full no-underline"
                                        >
                                            {t("csvReport", {
                                                default: "CSV Report",
                                            })}
                                        </Link>
                                    </li>
                                    {/* Здесь будут другие инструменты от других разработчиков позже */}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <LangSwitcher />
            </div>
        </header>
    );
}
