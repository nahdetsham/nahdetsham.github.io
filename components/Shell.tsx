import type { Content } from "@/lib/content";
import Motion from "./Motion";
import Reveals from "./Reveals";
import Nav from "./Nav";
import Footer from "./Footer";

/** Every page: smooth scroll, entrances, navigation, main content, footer. */
export default function Shell({ c, children }: { c: Content; children: React.ReactNode }) {
  return (
    <>
      <Motion />
      <Reveals />
      <Nav c={c} />
      <main id="main">{children}</main>
      <Footer c={c} />
    </>
  );
}
