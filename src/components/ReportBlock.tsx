import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import * as htmlToImage from "html-to-image";

interface BlockProps {
    id: string;
    title: string;
    children: React.ReactNode;
    initiallyVisible?: boolean;
}

export function ReportBlock({
    id,
    title,
    children,
    initiallyVisible = true,
}: BlockProps) {
    const t = useTranslations("report");
    const [visible, setVisible] = useState(initiallyVisible);
    const [hidden, setHidden] = useState(!initiallyVisible);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
            console.warn("Clipboard API or ClipboardItem not supported");
        }
    }, []);

    const handleCopyImage = async () => {
        if (!contentRef.current) return;

        const actionPanel = contentRef.current.querySelector(".report-actions");

        // Сохраняем ссылку на родителя и сам узел
        const parent = actionPanel?.parentElement;
        const placeholder = actionPanel?.nextSibling;
        if (actionPanel && parent) {
            parent.removeChild(actionPanel);
        }

        try {
            const blob = await htmlToImage.toBlob(contentRef.current);
            if (!blob) return;
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
            console.log("[COPY] Block image copied to clipboard");
        } catch (err) {
            console.error("[COPY ERROR]", err);
        } finally {
            // Возвращаем элемент туда, где он был
            if (actionPanel && parent) {
                if (placeholder) {
                    parent.insertBefore(actionPanel, placeholder);
                } else {
                    parent.appendChild(actionPanel);
                }
            }
        }
    };

    if (hidden) {
        return (
            <div className="flex h-full justify-between items-center border rounded-xl bg-muted text-muted-foreground p-6">
                <span>{title}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setVisible(true);
                        setHidden(false);
                    }}
                >
                    <Eye className="w-4 h-4 mr-1" /> {t("show")}
                </Button>
            </div>
        );
    }

    return (
        <Card className="relative group" ref={contentRef}>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{title}</CardTitle>
                <div className="report-actions flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyImage}
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setVisible(false);
                            setHidden(true);
                        }}
                    >
                        <EyeOff className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
