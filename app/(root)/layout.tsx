// Pages outside a language: "/" (redirect to /ar/) and the bilingual 404 page.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, background: "#16294B", color: "#F1ECDC", fontFamily: "Tahoma, sans-serif" }}>{children}</body>
    </html>
  );
}
