import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  cariLomba,
  kodePendaftaran,
  labelTanggal,
  pesanBayarLomba,
  statusPendaftaran,
  validasiFoto,
  validasiMusik,
  validasiPendaftar,
} from "@/data/lomba";

const BUCKET = "lomba-pendaftaran";

const fields = z.object({
  slug: z.string().max(60),
  kategoriId: z.string().max(30),
  namaLengkap: z.string().max(200),
  usia: z.string().max(5),
  alamat: z.string().max(600),
  asal: z.string().max(200),
  kontak: z.string().max(40),
  musik: z.unknown(),
  foto: z.unknown(),
});

const teks = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v : "";
};

/** Pendaftaran lomba publik: isian dicek ulang di server, berkas masuk folder privat (hanya admin yang bisa membuka). */
export const daftarLomba = createServerFn({ method: "POST" })
  .inputValidator((input: FormData) => {
    if (!(input instanceof FormData)) throw new Error("Data pendaftaran tidak valid.");
    return fields.parse({
      slug: teks(input, "slug"),
      kategoriId: teks(input, "kategoriId"),
      namaLengkap: teks(input, "namaLengkap"),
      usia: teks(input, "usia"),
      alamat: teks(input, "alamat"),
      asal: teks(input, "asal"),
      kontak: teks(input, "kontak"),
      musik: input.get("musik"),
      foto: input.get("foto"),
    });
  })
  .handler(async ({ data }) => {
    const lomba = cariLomba(data.slug);
    if (!lomba) return { ok: false as const, galat: "Lomba tidak ditemukan." };
    const buka = statusPendaftaran(lomba);
    if (buka.status === "belum") {
      return { ok: false as const, galat: `Pendaftaran dibuka ${labelTanggal(buka.berikutnya.mulai)}.` };
    }
    if (buka.status === "tutup") return { ok: false as const, galat: "Pendaftaran sudah ditutup." };
    const isian = validasiPendaftar(lomba, data);
    if (!isian.ok) return isian;
    const musik = data.musik instanceof File ? data.musik : null;
    const foto = data.foto instanceof File ? data.foto : null;
    const cekMusik = validasiMusik(musik);
    if (!cekMusik.ok) return cekMusik;
    const cekFoto = validasiFoto(foto);
    if (!cekFoto.ok) return cekFoto;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const id = crypto.randomUUID();
    const musikPath = `musik/${id}.${cekMusik.ext}`;
    const fotoPath = `foto/${id}.${cekFoto.ext}`;
    const hapusBerkas = async (paths: string[]) => {
      if (!paths.length) return;
      const r = await supabaseAdmin.storage.from(BUCKET).remove(paths);
      if (r.error) console.error("Lomba file cleanup failed:", r.error.message);
    };

    const upMusik = await supabaseAdmin.storage.from(BUCKET).upload(musikPath, musik!, { contentType: cekMusik.mime, upsert: false });
    if (upMusik.error) {
      console.error("Lomba music upload failed:", upMusik.error.message);
      return { ok: false as const, galat: "Musik pengiring belum berhasil diunggah. Coba lagi sebentar lagi." };
    }
    const upFoto = await supabaseAdmin.storage.from(BUCKET).upload(fotoPath, foto!, { contentType: cekFoto.mime, upsert: false });
    if (upFoto.error) {
      console.error("Lomba photo upload failed:", upFoto.error.message);
      await hapusBerkas([musikPath]);
      return { ok: false as const, galat: "Foto belum berhasil diunggah. Coba lagi sebentar lagi." };
    }

    const d = isian.data;
    const simpan = await supabaseAdmin
      .from("lomba_pendaftaran")
      .insert({
        lomba_slug: lomba.slug,
        kategori: d.kategoriId,
        nama_lengkap: d.namaLengkap,
        usia: d.usia,
        alamat: d.alamat,
        asal: d.asal,
        whatsapp: d.kontak,
        musik_path: musikPath,
        musik_nama: (musik!.name || `musik.${cekMusik.ext}`).slice(0, 200),
        musik_mime: cekMusik.mime,
        foto_path: fotoPath,
        foto_mime: cekFoto.mime,
        gelombang: buka.gelombang.ke,
        biaya: buka.biaya,
      })
      .select("id")
      .single();

    if (simpan.error) {
      await hapusBerkas([musikPath, fotoPath]);
      if (/KUOTA_PENUH/.test(simpan.error.message)) {
        return { ok: false as const, galat: `Maaf, kuota kategori ${d.kategoriNama} sudah penuh (${lomba.kuotaPerKategori} peserta).` };
      }
      console.error("Lomba registration save failed:", simpan.error.message);
      return { ok: false as const, galat: "Pendaftaran belum berhasil disimpan. Coba kirim lagi." };
    }

    const kode = kodePendaftaran(simpan.data.id);
    const bayar = { gelombang: buka.gelombang.ke, biaya: buka.biaya };
    return { ok: true as const, kode, ...bayar, ...pesanBayarLomba(lomba, d, kode, bayar) };
  });
