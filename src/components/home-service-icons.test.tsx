import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { mainNavItems } from "@/data/main-nav-items";
import { HomeServiceIcon } from "@/components/home-service-icons";

describe("HomeServiceIcon", () => {
  it.each(mainNavItems.map((item) => item.id))("menggambar ikon untuk menu %s", (id) => {
    const html = renderToStaticMarkup(<HomeServiceIcon id={id} />);
    // svg kosong berarti kartu menu tampil tanpa ikon
    expect(html).toMatch(/<svg[^>]*>.*<(path|rect|circle|ellipse)/);
  });
});
