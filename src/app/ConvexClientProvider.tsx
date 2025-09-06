// components/ConvexClientProvider.tsx
"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Providers } from "@/app/providers";
import ToastProvider from "@/app/ToastProvider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexProvider client={convex}>
            <Providers>
                <ToastProvider />
                {children}
            </Providers>
        </ConvexProvider>
    );
}
