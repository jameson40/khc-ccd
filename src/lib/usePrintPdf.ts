"use client";

import { RefObject, useCallback } from "react";
import { useReactToPrint } from "react-to-print";

export function usePrintPdf(ref: RefObject<HTMLDivElement | null>) {
    const print = useReactToPrint({
        contentRef: ref,
        documentTitle: "crm-report",
    });

    return { print };
}
