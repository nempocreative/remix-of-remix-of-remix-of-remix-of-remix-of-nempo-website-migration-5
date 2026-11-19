import CONTENT from "@/data/ggs-hair-studio-content.json";

/**
 * Answers the calls the GGS Hair Studio visitor site makes to its original server.
 * Studio info, services, products and vouchers come from the studio's starting content;
 * accounts, bookings and staff tools are not connected yet and say so honestly.
 */
export function jawabanGgs(method: string, jalur: string): { status: number; body: unknown } {
  const bagian = jalur.replace(/^\/+|\/+$/g, "");
  if (method === "GET") {
    if (bagian === "site") return { status: 200, body: CONTENT.site };
    if (bagian === "services") return { status: 200, body: CONTENT.services };
    if (bagian === "products") return { status: 200, body: CONTENT.products };
    if (bagian === "vouchers") return { status: 200, body: CONTENT.vouchers };
    if (bagian === "account/session" || bagian === "employee/session" || bagian === "employee/cashier/session") {
      return { status: 401, body: { error: "Belum masuk." } };
    }
  }
  return {
    status: 503,
    body: { error: "Fitur ini belum tersambung. Hubungi GGS Hair Studio lewat WhatsApp untuk memesan." },
  };
}
