import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شركة نهضة شام | Nahdet Sham",
  robots: { index: false },
  alternates: { canonical: "/ar/" },
};

// "/" sends visitors to the Arabic home page (meta refresh works without JavaScript; the script keeps a #hash).
export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/ar/" />
      <script dangerouslySetInnerHTML={{ __html: "location.replace('/ar/' + location.hash)" }} />
      <p style={{ padding: 24 }}>
        <a href="/ar/" style={{ color: "#D2B06A" }}>شركة نهضة شام</a> · <a href="/en/" style={{ color: "#D2B06A" }}>Nahdet Sham (English)</a>
      </p>
    </>
  );
}
