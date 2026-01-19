import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "BMI Tracker - ติดตามค่าดัชนีมวลกาย",
  description: "แอปพลิเคชันติดตามและวิเคราะห์ค่า BMI พร้อมรายงาน MIS ครบถ้วน",
  keywords: ["BMI", "ดัชนีมวลกาย", "สุขภาพ", "น้ำหนัก", "ส่วนสูง"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
