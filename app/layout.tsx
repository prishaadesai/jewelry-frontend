// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jewelry Production Management",
  description: "Manage jewelry production workflows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
