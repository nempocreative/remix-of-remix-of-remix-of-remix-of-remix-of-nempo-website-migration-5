// Admin: tambah, ubah, hapus acara Nempo (tabel portfolio_events) dan poster-nya.
// Hak admin dijaga database (has_role); fungsi ini hanya meneruskan.
import { supabase } from '@/integrations/supabase/client';
import { ApiError } from '@/apps/cms/lib/api';
import { PORTFOLIO_EVENT_COLUMNS, POSTER_BUCKET, posterFileFromUrl, posterUrl, type PortfolioEventRow } from '@/lib/portfolio-events';

export type PortfolioEventInput = {
  name: string; location: string; start_date: string; end_date: string | null;
  badge: string; category: string; link: string | null; active: boolean;
  slug: string; image_url?: string | null; thumb_url?: string | null;
};

function fail(error: { message: string; code?: string } | null): void {
  if (!error) return;
  if (error.code === '23505') throw new ApiError('Sudah ada acara dengan nama dan tahun yang sama. Ganti sedikit namanya.');
  if (error.code === '23514') throw new ApiError('Ada isian yang belum benar. Periksa tanggal selesai, tautan, dan panjang tulisan.');
  if (error.code === '42501' || /row-level security/i.test(error.message)) throw new ApiError('Akun ini tidak punya izin mengubah acara.');
  throw new ApiError(error.message);
}

export async function listPortfolioEvents(): Promise<PortfolioEventRow[]> {
  const { data, error } = await supabase.from('portfolio_events').select(PORTFOLIO_EVENT_COLUMNS).order('start_date', { ascending: false });
  fail(error);
  return (data ?? []) as PortfolioEventRow[];
}

export async function createPortfolioEvent(input: PortfolioEventInput): Promise<void> {
  const { error } = await supabase.from('portfolio_events').insert(input);
  fail(error);
}

export async function updatePortfolioEvent(id: number, input: Partial<PortfolioEventInput>): Promise<void> {
  const { error } = await supabase.from('portfolio_events').update({ ...input, updated_at: new Date().toISOString() }).eq('id', id);
  fail(error);
}

export async function deletePortfolioEvent(row: PortfolioEventRow): Promise<void> {
  const { error } = await supabase.from('portfolio_events').delete().eq('id', row.id);
  fail(error);
  await removePosterFiles([row.image_url, row.thumb_url]);
}

/** Hapus file poster lama (hanya unggahan admin; poster bawaan tidak tersentuh). */
export async function removePosterFiles(urls: Array<string | null | undefined>): Promise<void> {
  const files = [...new Set(urls.map(posterFileFromUrl).filter((f): f is string => !!f))];
  if (files.length) await supabase.storage.from(POSTER_BUCKET).remove(files);
}

async function shrink(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const toBlob = (type: string) => new Promise<Blob | null>(r => canvas.toBlob(r, type, 0.86));
  const webp = await toBlob('image/webp');
  if (webp && webp.type === 'image/webp') return webp;
  const jpg = await toBlob('image/jpeg');
  if (!jpg) throw new ApiError('Gambar tidak bisa diproses. Coba file JPG atau PNG lain.');
  return jpg;
}

/** Unggah poster: versi besar (maks 1600px) untuk Portofolio dan versi kecil untuk Beranda/Riwayat. */
export async function uploadPoster(file: File): Promise<{ image_url: string; thumb_url: string }> {
  if (!file.type.startsWith('image/')) throw new ApiError('Pilih file gambar (JPG, PNG, atau WebP).');
  if (file.size > 25 * 1024 * 1024) throw new ApiError('Gambar terlalu besar. Maksimal 25 MB.');
  const [full, thumb] = await Promise.all([shrink(file, 1600, 1600), shrink(file, 480, 900)]);
  const id = crypto.randomUUID();
  const ext = (b: Blob) => (b.type === 'image/webp' ? 'webp' : 'jpg');
  const fullName = `${id}.${ext(full)}`;
  const thumbName = `${id}-thumb.${ext(thumb)}`;
  for (const [name, blob] of [[fullName, full], [thumbName, thumb]] as const) {
    const { error } = await supabase.storage.from(POSTER_BUCKET).upload(name, blob, { contentType: blob.type, upsert: false });
    if (error) throw new ApiError(/row-level security|unauthorized/i.test(error.message) ? 'Akun ini tidak punya izin mengunggah poster.' : `Poster gagal diunggah: ${error.message}`);
  }
  return { image_url: posterUrl(fullName), thumb_url: posterUrl(thumbName) };
}
