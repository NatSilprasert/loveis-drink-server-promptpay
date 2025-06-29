import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "บริการสั่งเครื่องดื่ม | The Coming of Stages",
  description: "สั่งเครื่องดื่มล่วงหน้าสำหรับ The Coming of Stages ร่วมกับ LOVEiS Cafe",
  icons: {
    icon: "/tcos.png",
  },
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
        <body>
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
  );
}
