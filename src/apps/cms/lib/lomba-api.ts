// Admin: daftar pendaftar lomba beserta musik & foto (folder privat, dibuka lewat tautan sementara).
// Hak admin dijaga database (has_role); fungsi ini hanya meneruskan.
import { supabase } from '@/integrations/supabase/client';
import { ApiError } from '@/apps/cms/lib/api';
import type { Database } from '@/integrations/supabase/types';

export type PendaftarRow = Database['public']['Tables']['lomba_pendaftaran']['Row'];
export type StatusPendaftar = 'menunggu_bayar' | 'terkonfirmasi' | 'ditolak';
export const LOMBA_BUCKET = 'lomba-pendaftaran';

function fail(error: { message: string; code?: string } | null): void {
  if (!error) return;
  if (/KUOTA_PENUH/.test(error.message)) throw new ApiError('Kuota kategori ini sudah penuh (25 peserta). Tolak pendaftar lain dulu untuk membuka tempat.');
  if (error.code === '42501' || /row-level security/i.test(error.message)) throw new ApiError('Akun ini tidak punya izin melihat pendaftar.');
  throw new ApiError(error.message);
}

export async function listPendaftar(): Promise<PendaftarRow[]> {
  const { data, error } = await supabase.from('lomba_pendaftaran').select('*').order('created_at', { ascending: false });
  fail(error);
  return data ?? [];
}

export async function ubahPendaftar(id: number, isi: { status?: StatusPendaftar; catatan?: string | null }): Promise<void> {
  const { error } = await supabase.from('lomba_pendaftaran').update({ ...isi, updated_at: new Date().toISOString() }).eq('id', id);
  fail(error);
}

export async function hapusPendaftar(row: PendaftarRow): Promise<void> {
  const { error } = await supabase.from('lomba_pendaftaran').delete().eq('id', row.id);
  fail(error);
  await supabase.storage.from(LOMBA_BUCKET).remove([row.musik_path, row.foto_path]);
}

/** Tautan sementara (1 jam) untuk memutar musik / melihat foto. */
export async function tautanBerkas(paths: string[]): Promise<Record<string, string>> {
  if (!paths.length) return {};
  const { data, error } = await supabase.storage.from(LOMBA_BUCKET).createSignedUrls(paths, 3600);
  if (error) throw new ApiError('Berkas pendaftar tidak bisa dibuka.');
  const out: Record<string, string> = {};
  for (const d of data ?? []) if (d.path && d.signedUrl) out[d.path] = d.signedUrl;
  return out;
}
