import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, Eye, EyeOff, ImagePlus, LoaderCircle, MapPin, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { builtinPosters } from '@/data/event-portfolio';
import { formatEventDateLabel, makeEventSlug, PORTFOLIO_CATEGORIES, type PortfolioEventRow } from '@/lib/portfolio-events';
import { createPortfolioEvent, deletePortfolioEvent, listPortfolioEvents, removePosterFiles, updatePortfolioEvent, uploadPoster } from '@/apps/cms/lib/portfolio-events-api';

type Form = { name: string; location: string; start_date: string; end_date: string; badge: string; category: string; link: string; active: boolean };
const emptyForm: Form = { name: '', location: '', start_date: '', end_date: '', badge: '', category: 'Musik', link: '', active: true };

function posterOf(row: PortfolioEventRow) {
  const builtin = row.builtin_poster ? builtinPosters[row.builtin_poster] : undefined;
  return row.thumb_url || row.image_url || builtin?.thumb || builtin?.image || '';
}
const today = () => new Date().toISOString().slice(0, 10);
function isPast(row: PortfolioEventRow) { return (row.end_date || row.start_date) < today(); }

export default function PortfolioEventsPage() {
  const [rows, setRows] = useState<PortfolioEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<PortfolioEventRow | null | false>(false);
  const [form, setForm] = useState<Form>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setRows(await listPortfolioEvents()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Daftar acara tidak bisa dimuat.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => () => { if (preview.startsWith('blob:')) URL.revokeObjectURL(preview); }, [preview]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? rows.filter(r => `${r.name} ${r.location} ${r.category}`.toLowerCase().includes(q)) : rows;
  }, [rows, search]);

  function openCreate() { setForm(emptyForm); setFile(null); setPreview(''); setFormError(''); setEditing(null); }
  function openEdit(row: PortfolioEventRow) {
    setForm({ name: row.name, location: row.location, start_date: row.start_date, end_date: row.end_date ?? '', badge: row.badge, category: row.category, link: row.link ?? '', active: row.active });
    setFile(null); setPreview(posterOf(row)); setFormError(''); setEditing(row);
  }
  function pickFile(f: File | undefined) {
    if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f));
  }
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm(f => ({ ...f, [key]: value }));

  async function save(e: React.FormEvent) {
    e.preventDefault(); setFormError('');
    const name = form.name.trim();
    if (!name) return setFormError('Nama acara wajib diisi.');
    if (!form.location.trim()) return setFormError('Tempat acara wajib diisi.');
    if (!form.start_date) return setFormError('Tanggal mulai wajib diisi.');
    if (form.end_date && form.end_date < form.start_date) return setFormError('Tanggal selesai tidak boleh sebelum tanggal mulai.');
    const link = form.link.trim();
    if (link && !/^https?:\/\//.test(link)) return setFormError('Tautan harus diawali https://');
    if (editing === null && !file) return setFormError('Pilih poster acara dulu.');
    setSaving(true);
    let uploaded: { image_url: string; thumb_url: string } | null = null;
    try {
      if (file) uploaded = await uploadPoster(file);
      const base = {
        name, location: form.location.trim(), start_date: form.start_date,
        end_date: form.end_date && form.end_date > form.start_date ? form.end_date : null,
        badge: form.badge.trim(), category: form.category, link: link || null, active: form.active,
      };
      if (editing) {
        await updatePortfolioEvent(editing.id, { ...base, ...(uploaded ?? {}) });
        if (uploaded) await removePosterFiles([editing.image_url, editing.thumb_url]);
        setNotice(`"${name}" sudah diperbarui.`);
      } else {
        await createPortfolioEvent({ ...base, slug: makeEventSlug(name, form.start_date), ...(uploaded ?? {}) });
        setNotice(`"${name}" sudah ditambahkan.`);
      }
      setEditing(false); await load();
    } catch (err) {
      if (uploaded) await removePosterFiles([uploaded.image_url, uploaded.thumb_url]).catch(() => {});
      setFormError(err instanceof Error ? err.message : 'Acara tidak bisa disimpan.');
    } finally { setSaving(false); }
  }

  async function toggle(row: PortfolioEventRow) {
    try { await updatePortfolioEvent(row.id, { active: !row.active }); setNotice(row.active ? `"${row.name}" disembunyikan dari situs.` : `"${row.name}" tampil lagi di situs.`); await load(); }
    catch (e) { setNotice(e instanceof Error ? e.message : 'Gagal mengubah.'); }
  }
  async function remove(row: PortfolioEventRow) {
    if (!window.confirm(`Hapus "${row.name}"? Acara ini hilang dari Beranda, Riwayat Event, dan Portofolio.`)) return;
    try { await deletePortfolioEvent(row); setNotice(`"${row.name}" sudah dihapus.`); await load(); }
    catch (e) { setNotice(e instanceof Error ? e.message : 'Gagal menghapus.'); }
  }

  const input = 'w-full rounded-lg border border-[#e1d5c5] bg-white px-3 py-2.5 text-sm text-[#3d2f24] outline-none focus:border-[#a67c57] focus:ring-2 focus:ring-[#a67c57]/15';
  const label = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[.1em] text-[#8a7460]';

  return <div className="fade-up space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#9a7653]"><span>Ruang kerja</span><span className="h-px w-5 bg-[#c9b69e]" /><span>Konten</span></div>
        <h1 className="text-[30px] font-bold tracking-[-.04em] text-[#35291f]">Acara Nempo</h1>
        <p className="mt-1 max-w-xl text-sm text-[#84776a]">Acara di sini langsung tampil di Beranda dan Portofolio. Acara yang tanggalnya sudah lewat otomatis masuk Riwayat Event.</p>
      </div>
      <button onClick={openCreate} className="flex items-center justify-center gap-2 rounded-lg bg-[#805538] px-4 py-2.5 text-xs font-bold text-[#fffaf3] shadow-sm transition hover:bg-[#67432d]"><Plus size={15} /> Tambah acara</button>
    </header>

    {notice && <div className="flex items-center justify-between gap-3 rounded-xl border border-[#d7e2d2] bg-[#f2f7ef] px-4 py-3 text-xs font-semibold text-[#4d6a49]"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Tutup pesan"><X size={14} /></button></div>}

    <div className="relative max-w-sm">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8957f]" />
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, tempat, kategori…" className={`${input} pl-9`} />
    </div>

    {error ? <div className="flex items-start gap-3 rounded-xl border border-[#ead4c8] bg-[#fcf2ed] p-4"><AlertCircle size={17} className="mt-0.5 text-[#a9593e]" /><p className="text-xs text-[#895e4e]">{error}</p></div>
      : loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map(n => <div key={n} className="h-40 animate-pulse rounded-2xl border border-[#e6dccf] bg-[#fbf8f2]" />)}</div>
      : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[#d9cbb9] bg-[#faf6ef] p-8 text-center"><p className="text-sm font-semibold text-[#66523d]">{rows.length ? 'Tidak ada acara yang cocok.' : 'Belum ada acara.'}</p><p className="mt-1 text-xs text-[#9a8d7f]">Klik "Tambah acara" untuk memasukkan acara baru.</p></div>
      : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map(row => <article key={row.id} className={`flex gap-3 rounded-2xl border border-[#e5dacb] bg-[#fffdf9] p-3 shadow-[0_8px_28px_rgba(81,58,34,.045)] ${row.active ? '' : 'opacity-60'}`}>
          <div className="aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl bg-[#efe6da]">{posterOf(row) && <img src={posterOf(row)} alt="" loading="lazy" className="h-full w-full object-cover" />}</div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-wrap gap-1">
              <span className="rounded-full bg-[#f1e6d7] px-2 py-0.5 text-[10px] font-bold text-[#805538]">{row.category}</span>
              {isPast(row) ? <span className="rounded-full bg-[#e6eee3] px-2 py-0.5 text-[10px] font-bold text-[#56724f]">Riwayat</span> : <span className="rounded-full bg-[#e5edf3] px-2 py-0.5 text-[10px] font-bold text-[#4d6a82]">Akan datang</span>}
              {!row.active && <span className="rounded-full bg-[#eee] px-2 py-0.5 text-[10px] font-bold text-[#777]">Disembunyikan</span>}
            </div>
            <h2 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-[#3d2f24]">{row.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-[#8b7b69]"><CalendarDays size={11} />{formatEventDateLabel(row.start_date, row.end_date)}</p>
            <p className="flex items-center gap-1 text-[11px] text-[#8b7b69]"><MapPin size={11} /><span className="truncate">{row.location}</span></p>
            <div className="mt-auto flex gap-1 pt-2">
              <button onClick={() => openEdit(row)} className="flex items-center gap-1 rounded-lg border border-[#e1d5c5] px-2.5 py-1.5 text-[11px] font-semibold text-[#6d5440] hover:bg-[#f5eee4]"><Pencil size={12} /> Ubah</button>
              <button onClick={() => void toggle(row)} className="flex items-center gap-1 rounded-lg border border-[#e1d5c5] px-2.5 py-1.5 text-[11px] font-semibold text-[#6d5440] hover:bg-[#f5eee4]" title={row.active ? 'Sembunyikan dari situs' : 'Tampilkan di situs'}>{row.active ? <><EyeOff size={12} /> Sembunyikan</> : <><Eye size={12} /> Tampilkan</>}</button>
              <button onClick={() => void remove(row)} className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-[#a9593e] hover:bg-[#fcf2ed]" aria-label={`Hapus ${row.name}`}><Trash2 size={14} /></button>
            </div>
          </div>
        </article>)}
      </div>}

    {editing !== false && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2b2119]/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={editing ? 'Ubah acara' : 'Tambah acara'}>
      <form onSubmit={save} className="max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-[#fffdf9] p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold text-[#35291f]">{editing ? 'Ubah acara' : 'Tambah acara'}</h2><button type="button" onClick={() => setEditing(false)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[#f1e9de]" aria-label="Tutup"><X size={16} /></button></div>
        <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
          <div>
            <span className={label}>Poster</span>
            <label className="group relative flex aspect-[4/5] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#d9c8b2] bg-[#f8f2e9] text-center hover:border-[#a67c57]">
              {preview ? <img src={preview} alt="Pratinjau poster" className="h-full w-full object-cover" /> : <span className="px-3 text-[11px] font-semibold text-[#8a7460]"><ImagePlus className="mx-auto mb-2" size={22} />Pilih poster</span>}
              {preview && <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1.5 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">Ganti poster</span>}
              <input type="file" accept="image/*" className="sr-only" aria-label="Poster acara" onChange={e => pickFile(e.target.files?.[0])} />
            </label>
            <p className="mt-1.5 text-[10px] leading-4 text-[#a0917e]">Tampil 4:5 seperti feed Instagram. Bagian tengah poster yang terlihat.</p>
          </div>
          <div className="space-y-3.5">
            <div><label className={label} htmlFor="pe-name">Nama acara</label><input id="pe-name" className={input} value={form.name} onChange={e => set('name', e.target.value)} maxLength={160} /></div>
            <div><label className={label} htmlFor="pe-loc">Tempat</label><input id="pe-loc" className={input} value={form.location} onChange={e => set('location', e.target.value)} maxLength={120} placeholder="mis. Good Story Cafe" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={label} htmlFor="pe-start">Tanggal mulai</label><input id="pe-start" type="date" className={input} value={form.start_date} onChange={e => set('start_date', e.target.value)} /></div>
              <div><label className={label} htmlFor="pe-end">Tanggal selesai</label><input id="pe-end" type="date" className={input} value={form.end_date} min={form.start_date || undefined} onChange={e => set('end_date', e.target.value)} /><span className="mt-1 block text-[10px] text-[#a0917e]">Kosongkan kalau sehari</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={label} htmlFor="pe-cat">Kategori</label><select id="pe-cat" className={input} value={form.category} onChange={e => set('category', e.target.value)}>{PORTFOLIO_CATEGORIES.map(c => <option key={c}>{c}</option>)}{!PORTFOLIO_CATEGORIES.includes(form.category) && <option>{form.category}</option>}</select></div>
              <div><label className={label} htmlFor="pe-badge">Label kecil</label><input id="pe-badge" className={input} value={form.badge} onChange={e => set('badge', e.target.value)} maxLength={40} placeholder="mis. Coffee Night" /></div>
            </div>
            <div><label className={label} htmlFor="pe-link">Tautan Instagram (boleh kosong)</label><input id="pe-link" type="url" className={input} value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://www.instagram.com/p/…" /></div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#5a4634]"><input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="h-4 w-4 accent-[#805538]" /> Tampilkan di situs</label>
          </div>
        </div>
        {formError && <p className="mt-4 rounded-lg bg-[#fcf2ed] px-3 py-2 text-xs font-semibold text-[#9a4f37]" role="alert">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => setEditing(false)} className="rounded-lg px-4 py-2.5 text-xs font-semibold text-[#7d6956] hover:bg-[#f1e9de]">Batal</button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#805538] px-5 py-2.5 text-xs font-bold text-[#fffaf3] hover:bg-[#67432d] disabled:opacity-60">{saving && <LoaderCircle size={14} className="animate-spin" />}{saving ? 'Menyimpan…' : 'Simpan'}</button>
        </div>
      </form>
    </div>}
  </div>;
}
