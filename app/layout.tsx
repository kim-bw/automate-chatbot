import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automate Chatbot",
  description: "Vercel chatbot connected to Power Automate"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
