"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";

export const useNProgress = () => {
    const pathname = usePathname();

    useEffect(() => {
        NProgress.start();
        return () => {
            NProgress.done();
        };
    }, [pathname]);
};
