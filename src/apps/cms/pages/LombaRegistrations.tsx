import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, Download, MapPin, MessageCircle, RefreshCw, Search, Trash2, Trophy, X } from 'lucide-react';
import { cariLomba, kodePendaftaran, rupiah } from '@/data/lomba';
import { hapusPendaftar, listPendaftar, tautanBerkas, ubahPendaftar, type PendaftarRow, type StatusPendaftar } from '@/apps/cms/lib/lomba-api';

const lomba = cariLomba('pasanggiri-jaipong')!;
const STATUS: Record<StatusPendaftar, { label: string; kelas: string }> = {
  menunggu_bayar: { label: 'Menunggu bayar', kelas: 'bg-[#f6ecd9] text-[#8a6327]' },
  terkonfirmasi: { label: 'Lunas', kelas: 'bg-[#e6eee3] text-[#56724f]' },
  ditolak: { label: 'Ditolak', kelas: 'bg-[#eee] text-[#777]' },
};
const namaKategori = (id: string) => lomba.kategori.find(k => k.id === id)?.nama ?? id;
const waLink = (nomor: string) => {
  const d = nomor.replace(/\D/g, '');
  return `https://wa.me/${d.startsWith('0') ? `62${d.slice(1)}` : d}`;
};
const waktu = (iso: string) => new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function LombaRegistrationsPage() {
  const [rows, setRows] = useState<PendaftarRow[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [kategori, setKategori] = useState('semua');
  const [search, setSearch] = useState('');
  const [foto, setFoto] = useState<PendaftarRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const list = await listPendaftar();
      setRows(list);
      setUrls(await tautanBerkas(list.flatMap(r => [r.musik_path, r.foto_path])));
    } catch (e) { setError(e instanceof Error ? e.message : 'Daftar pendaftar tidak bisa dimuat.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const terisi = useMemo(() => Object.fromEntries(lomba.kategori.map(k => [k.id, rows.filter(r => r.kategori === k.id && r.status !== 'ditolak').length])), [rows]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => (kategori === 'semua' || r.kategori === kategori) && (!q || `${r.nama_lengkap} ${r.asal ?? ''} ${r.whatsapp} ${kodePendaftaran(r.id)}`.toLowerCase().includes(q)));
  }, [rows, kategori, search]);

  async function setStatus(row: PendaftarRow, status: StatusPendaftar) {
    try { await ubahPendaftar(row.id, { status }); setNotice(`${row.nama_lengkap}: ${STATUS[status].label}.`); await load(); }
    catch (e) { setNotice(e instanceof Error ? e.message : 'Gagal mengubah status.'); }
  }
  async function remove(row: PendaftarRow) {
    if (!window.confirm(`Hapus pendaftaran ${row.nama_lengkap} (${kodePendaftaran(row.id)})? Musik dan fotonya ikut terhapus.`)) return;
    try { await hapusPendaftar(row); setNotice(`Pendaftaran ${row.nama_lengkap} dihapus.`); await load(); }
    catch (e) { setNotice(e instanceof Error ? e.message : 'Gagal menghapus.'); }
  }

  const input = 'w-full rounded-lg border border-[#e1d5c5] bg-white px-3 py-2.5 text-sm text-[#3d2f24] outline-none focus:border-[#a67c57] focus:ring-2 focus:ring-[#a67c57]/15';

  return <div className="fade-up space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#9a7653]"><span>Ruang kerja</span><span className="h-px w-5 bg-[#c9b69e]" /><span>Lomba</span></div>
        <h1 className="text-[30px] font-bold tracking-[-.04em] text-[#35291f]">Pendaftar Lomba</h1>
        <p className="mt-1 max-w-xl text-sm text-[#84776a]">{lomba.judul} {lomba.subjudul}. Ubah status jadi <b>Lunas</b> setelah pembayaran diterima; pendaftar yang ditolak membuka lagi tempat di kuota.</p>
      </div>
      <button onClick={() => void load()} className="flex items-center justify-center gap-2 rounded-lg border border-[#e1d5c5] bg-[#fffdf9] px-4 py-2.5 text-xs font-bold text-[#6d5440] hover:bg-[#f5eee4]"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Perbarui</button>
    </header>

    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {lomba.kategori.map(k => {
        const n = terisi[k.id] ?? 0;
        return <button key={k.id} onClick={() => setKategori(kategori === k.id ? 'semua' : k.id)} className={`rounded-xl border p-4 text-left transition ${kategori === k.id ? 'border-[#805538] bg-[#f6eee3]' : 'border-[#e6dccf] bg-[#fffdf9] hover:border-[#cfb99c]'}`}>
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#968572]">{k.nama}</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#49372a]">{n}<span className="text-sm text-[#a59684]"> / {lomba.kuotaPerKategori}</span></p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#efe6da]"><div className="h-full rounded-full bg-[#b8860b]" style={{ width: `${Math.min(100, (n / lomba.kuotaPerKategori) * 100)}%` }} /></div>
        </button>;
      })}
    </div>

    {notice && <div className="flex items-center justify-between gap-3 rounded-xl border border-[#d7e2d2] bg-[#f2f7ef] px-4 py-3 text-xs font-semibold text-[#4d6a49]"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Tutup pesan"><X size={14} /></button></div>}

    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative max-w-sm flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8957f]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, sanggar, nomor, kode…" className={`${input} pl-9`} />
      </div>
      <select value={kategori} onChange={e => setKategori(e.target.value)} className={`${input} sm:w-48`} aria-label="Saring kategori">
        <option value="semua">Semua kategori</option>
        {lomba.kategori.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
      </select>
    </div>

    {error ? <div className="flex items-start gap-3 rounded-xl border border-[#ead4c8] bg-[#fcf2ed] p-4"><AlertCircle size={17} className="mt-0.5 text-[#a9593e]" /><p className="text-xs text-[#895e4e]">{error}</p></div>
      : loading ? <div className="grid gap-4 xl:grid-cols-2">{[1, 2].map(n => <div key={n} className="h-44 animate-pulse rounded-2xl border border-[#e6dccf] bg-[#fbf8f2]" />)}</div>
      : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[#d9cbb9] bg-[#faf6ef] p-8 text-center"><Trophy className="mx-auto mb-2 text-[#b89c78]" size={22} /><p className="text-sm font-semibold text-[#66523d]">{rows.length ? 'Tidak ada pendaftar yang cocok.' : 'Belum ada pendaftar.'}</p><p className="mt-1 text-xs text-[#9a8d7f]">Pendaftaran dari halaman Lomba akan muncul di sini.</p></div>
      : <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map(row => {
          const st = STATUS[row.status as StatusPendaftar] ?? STATUS.menunggu_bayar;
          return <article key={row.id} className={`flex gap-4 rounded-2xl border border-[#e5dacb] bg-[#fffdf9] p-4 shadow-[0_8px_28px_rgba(81,58,34,.045)] ${row.status === 'ditolak' ? 'opacity-60' : ''}`}>
            <button onClick={() => setFoto(row)} className="aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl bg-[#efe6da] sm:w-28" aria-label={`Lihat foto ${row.nama_lengkap}`}>
              {urls[row.foto_path] && <img src={urls[row.foto_path]} alt="" loading="lazy" className="h-full w-full object-cover" />}
            </button>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-1">
                <span className="rounded-full bg-[#3a2e25] px-2 py-0.5 font-mono text-[10px] font-bold text-[#f2e5d2]">{kodePendaftaran(row.id)}</span>
                <span className="rounded-full bg-[#f1e6d7] px-2 py-0.5 text-[10px] font-bold text-[#805538]">{namaKategori(row.kategori)}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.kelas}`}>{st.label}</span>
              </div>
              <h2 className="text-sm font-bold leading-snug text-[#3d2f24]">{row.nama_lengkap} <span className="font-normal text-[#8b7b69]">· {row.usia} tahun</span></h2>
              {row.asal && <p className="text-[11px] text-[#8b7b69]">{row.asal}</p>}
              <p className="flex items-start gap-1 text-[11px] text-[#8b7b69]"><MapPin size={11} className="mt-0.5 shrink-0" /><span className="line-clamp-2 whitespace-pre-line">{row.alamat}</span></p>
              <p className="text-[11px] text-[#8b7b69]">
                {row.gelombang ? `Gelombang ${row.gelombang} · ` : ''}{rupiah(row.biaya ?? lomba.biayaPendaftaran)} · daftar {waktu(row.created_at)}
              </p>
              {urls[row.musik_path] && <audio src={urls[row.musik_path]} controls preload="none" className="mt-1 h-9 w-full" />}
              <div className="mt-1 flex flex-wrap gap-1">
                <a href={waLink(row.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg border border-[#e1d5c5] px-2.5 py-1.5 text-[11px] font-semibold text-[#6d5440] hover:bg-[#f5eee4]"><MessageCircle size={12} /> {row.whatsapp}</a>
                {urls[row.musik_path] && <a href={urls[row.musik_path]} download={row.musik_nama} className="flex items-center gap-1 rounded-lg border border-[#e1d5c5] px-2.5 py-1.5 text-[11px] font-semibold text-[#6d5440] hover:bg-[#f5eee4]"><Download size={12} /> Musik</a>}
                {row.status !== 'terkonfirmasi' && <button onClick={() => void setStatus(row, 'terkonfirmasi')} className="flex items-center gap-1 rounded-lg bg-[#56724f] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#465f40]"><Check size={12} /> Tandai lunas</button>}
                {row.status !== 'menunggu_bayar' && <button onClick={() => void setStatus(row, 'menunggu_bayar')} className="rounded-lg border border-[#e1d5c5] px-2.5 py-1.5 text-[11px] font-semibold text-[#6d5440] hover:bg-[#f5eee4]">Belum bayar</button>}
                {row.status !== 'ditolak' && <button onClick={() => void setStatus(row, 'ditolak')} className="rounded-lg border border-[#e1d5c5] px-2.5 py-1.5 text-[11px] font-semibold text-[#6d5440] hover:bg-[#f5eee4]">Tolak</button>}
                <button onClick={() => void remove(row)} className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-[#a9593e] hover:bg-[#fcf2ed]" aria-label={`Hapus ${row.nama_lengkap}`}><Trash2 size={14} /></button>
              </div>
            </div>
          </article>;
        })}
      </div>}

    {foto && urls[foto.foto_path] && <div className="fixed inset-0 z-50 grid place-items-center bg-[#2b2119]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Foto ${foto.nama_lengkap}`} onClick={() => setFoto(null)}>
      <figure className="max-h-full max-w-lg" onClick={e => e.stopPropagation()}>
        <img src={urls[foto.foto_path]} alt={`Foto terbaik ${foto.nama_lengkap}`} className="max-h-[80dvh] w-auto rounded-xl object-contain" />
        <figcaption className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold text-[#fffaf3]"><span>{foto.nama_lengkap} · {namaKategori(foto.kategori)}</span><a href={urls[foto.foto_path]} download className="flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 text-xs"><Download size={13} /> Unduh</a></figcaption>
      </figure>
      <button onClick={() => setFoto(null)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white" aria-label="Tutup"><X size={18} /></button>
    </div>}
  </div>;
}
