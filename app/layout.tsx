import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Box, CssBaseline } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata:Metadata  = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="jp">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <Box>
            <CssBaseline />
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              {children}
            </Box>
          </Box>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
