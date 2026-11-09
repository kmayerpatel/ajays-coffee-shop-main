/**
 * The root layout replaces the Pages Router's `_app.tsx` and `_document.tsx`.
 * It renders the `<html>` and `<body>` tags, the shared header, and the
 * providers that every page needs.
 */

import type { Metadata } from "next";
import { CoffeeIcon } from "lucide-react";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/utils/trpc/client";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Ajay's Coffee",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TRPCReactProvider>
          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full h-14 px-3">
              <div className="flex flex-row items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <CoffeeIcon className="size-6" />
                </div>
                <p className="font-extrabold uppercase">Ajay&apos;s Coffee</p>
              </div>
              <div></div>
            </div>
          </div>
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
