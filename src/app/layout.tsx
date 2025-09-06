"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { Providers } from "./providers";
import ToastProvider from "./ToastProvider";
import "./globals.css"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexProvider client={convex}>
          <Providers>
            <ToastProvider />
            {children}
          </Providers>
        </ConvexProvider>
      </body>
    </html>
  );
}
