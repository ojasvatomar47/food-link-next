import { ReactNode } from "react";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

// This is a Server Component, so metadata is allowed
export const metadata = {
  title: "Food Link",
  description: "Connecting restaurants with NGOs to reduce food waste",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}