import { ArrowRight, ChevronRight, Crown, GraduationCap, Heart, Ticket, Users } from "lucide-react";
import { Link } from "@/lib/wouter";
import { momenDigitalItems } from "@/data/momen-digital";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

const IKON: Record<string, typeof GraduationCap> = {
  kelas: GraduationCap,
  geng: Heart,
  organisasi: Crown,
  event: Ticket,
  komunitas: Users,
};

/**
 * Cuplikan layanan Momen Digital di beranda — versi ringan:
 * deretan kartu kecil terang yang bisa digeser, tanpa putaran otomatis.
 */
export function MomenDigitalShowcase() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-[0_4px_16px_rgba(8,47,74,0.05)] lg:p-5">
      {/* Judul */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[16px] font-black leading-tight text-[#082f4a] lg:text-[22px]">
            Momen Digital
          </h2>
          <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 lg:text-[12.5px]">
            Kenangan jadi satu link.
          </p>
        </div>
        <Link
          href="/year-book"
          className="flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-[#075b8d] hover:text-[#082f4a] lg:text-[12.5px]"
        >
          Semua <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Deretan kartu — geser ke samping */}
      <div className="-mx-3.5 mt-3 flex gap-2.5 overflow-x-auto px-3.5 pb-1 scrollbar-hide lg:-mx-5 lg:gap-3 lg:px-5">
        {momenDigitalItems.map((m) => {
          const Ikon = IKON[m.id] ?? GraduationCap;
          return (
            <Link
              key={m.id}
              href={m.href}
              className="group w-[128px] shrink-0 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50 transition-transform hover:-translate-y-0.5 lg:w-[158px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={m.foto}
                  alt={m.judul}
                  width={400}
                  height={300}
                  decoding="async"
                  className="h-full w-full bg-slate-200 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span
                  className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full px-1.5 py-[2px] text-[8.5px] font-bold text-white shadow-sm lg:text-[9.5px]"
                  style={{ background: m.warna }}
                >
                  <Ikon className="h-2.5 w-2.5" />
                  {m.kategori}
                </span>
              </div>
              <div className="px-2 py-1.5 lg:px-2.5 lg:py-2">
                <h3 className="truncate text-[11px] font-extrabold text-[#082f4a] lg:text-[12.5px]">
                  {m.judul.replace("Momen ", "")}
                </h3>
                <p className="mt-[1px] truncate text-[9px] font-medium text-slate-500 lg:text-[10.5px]">
                  {m.contoh}
                </p>
              </div>
            </Link>
          );
        })}

        {/* Kartu ajakan di ujung deretan */}
        <a
          href={NEMPO_CONSULT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-[128px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#075b8d]/40 bg-[#075b8d]/5 px-3 text-center transition-colors hover:bg-[#075b8d]/10 lg:w-[158px]"
        >
          <span className="text-[11px] font-extrabold leading-snug text-[#075b8d] lg:text-[12.5px]">
            Buat momen versimu
          </span>
          <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-[#075b8d]/80 lg:text-[10.5px]">
            Ngobrol dulu <ArrowRight className="h-3 w-3" />
          </span>
        </a>
      </div>
    </div>
  );
}
