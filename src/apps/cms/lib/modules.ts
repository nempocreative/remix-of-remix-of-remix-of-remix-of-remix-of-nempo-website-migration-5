export type ModuleSpec = { title: string; description: string; endpoint?: string; fields?: Array<{ key: string; label: string; type?: 'textarea' | 'number' | 'checkbox' | 'date' | 'url'; required?: boolean }>; readonly?: boolean };
type FieldDefinition = NonNullable<ModuleSpec['fields']>[number];
const fields = (...items: FieldDefinition[]) => items;
export const modules: Record<string, ModuleSpec> = {
  events: { title:'Event', description:'Kelola agenda dan informasi acara Garut.', fields: fields(
    {key:'title',label:'Judul acara',required:true},{key:'slug',label:'Slug'},{key:'start_date',label:'Mulai',type:'date'},{key:'end_date',label:'Selesai',type:'date'},
    {key:'venue',label:'Tempat'},{key:'location',label:'Lokasi'},{key:'description',label:'Deskripsi',type:'textarea'},{key:'status',label:'Status'},
    {key:'image',label:'URL gambar',type:'url'}) },
  berita: { title:'Berita & Artikel', description:'Tinjau dan kelola kabar lokal untuk publik Garut.', fields: fields(
    {key:'title',label:'Judul',required:true},{key:'slug',label:'Slug'},{key:'excerpt',label:'Ringkasan',type:'textarea'},{key:'content',label:'Isi berita',type:'textarea'},
    {key:'category',label:'Kategori'},{key:'source',label:'Sumber'},{key:'source_url',label:'URL sumber',type:'url'},{key:'status',label:'Status'},
    {key:'published_at',label:'Tanggal publikasi',type:'date'},{key:'image',label:'URL gambar',type:'url'}) },
  banners: {title:'Banner Beranda',description:'Kelola banner utama yang tampil pada aplikasi Garut.',fields:fields({key:'title',label:'Judul',required:true},{key:'image',label:'URL gambar',type:'url'},{key:'url',label:'Tautan',type:'url'},{key:'active',label:'Aktif',type:'checkbox'},{key:'sort_order',label:'Urutan',type:'number'})},
  'promo-banners': {title:'Banner Promo',description:'Kelola materi promosi berukuran ringkas.',fields:fields({key:'title',label:'Judul',required:true},{key:'image',label:'URL gambar',type:'url'},{key:'url',label:'Tautan',type:'url'},{key:'active',label:'Aktif',type:'checkbox'},{key:'sort_order',label:'Urutan',type:'number'})},
  partners: {title:'Mitra Kami',description:'Kelola mitra dan tautan yang tampil pada platform.',fields:fields({key:'name',label:'Nama mitra',required:true},{key:'logo',label:'URL logo',type:'url'},{key:'link',label:'Tautan',type:'url'},{key:'category',label:'Kategori'},{key:'active',label:'Aktif',type:'checkbox'})},
  partnership: {title:'Kerja Sama',description:'Pengajuan kerja sama dari brand dan mitra lewat halaman Program.',fields:fields(
    {key:'brand_name',label:'Nama brand',required:true},{key:'contact_name',label:'Nama PIC',required:true},
    {key:'whatsapp',label:'Nomor WhatsApp',required:true},{key:'email',label:'Email',required:true},
    {key:'brand_category',label:'Kategori brand'},{key:'collaboration_types',label:'Bentuk kerja sama',type:'textarea'},
    {key:'budget_range',label:'Kisaran anggaran'},{key:'message',label:'Usulan',type:'textarea'},
    {key:'status',label:'Status (diajukan/diproses/diterima/ditolak)'})},
  'event-orders':{title:'Pesanan Tiket',description:'Pantau dan proses pesanan tiket acara.',endpoint:'/api/event-orders',readonly:true},
  'ticket-scanner':{title:'Scan Tiket Masuk',description:'Validasi kode tiket pada layanan tiket Garut.',readonly:true},
  'settings':{title:'Pengaturan',description:'Pengaturan CMS Nempo Organizer Garut.',fields:fields({key:'key',label:'Kunci',required:true},{key:'value',label:'Nilai',type:'textarea'})},
  'backup':{title:'Backup Data',description:'Ekspor atau pulihkan data layanan CMS.',readonly:true},
};
const titles: Record<string,string> = {
  'price-list':'Daftar Harga','digital-services':'Layanan Digital',notifications:'Notifikasi',
  'talent':'Talent Studio','talent-portfolio':'Karya Talent','talent-banner':'Banner Talent',
};
for (const [slug,title] of Object.entries(titles)) modules[slug] = { title, description:`Kelola data ${title.toLocaleLowerCase('id-ID')} pada layanan Garut.` };
import { supportedSlugs } from '@/apps/cms/lib/api';
const allNavGroups = [
  {label:'NEMPO ORGANIZER',items:[['Dashboard','/'],['Acara Nempo','/acara'],['Banner Beranda','/banners'],['Banner Promo','/promo-banners'],['Mitra Kami','/partners'],['Event Bertiket','/events'],['Pesanan Tiket','/event-orders'],['Scan Tiket','/ticket-scanner'],['Berita & Artikel','/berita'],['Talent Studio','/talent'],['Karya Talent','/talent-portfolio'],['Banner Talent','/talent-banner'],['Kerja Sama','/partnership'],['Pendaftar Lomba','/lomba']]},
  {label:'LAYANAN',items:[['Daftar Harga','/price-list'],['Layanan Digital','/digital-services']]},
  {label:'SISTEM',items:[['Notifikasi','/notifications'],['Backup Data','/backup'],['Pengaturan','/settings']]},
];

export const navGroups = allNavGroups.map(g=>({...g,items:g.items.filter(([,href])=>href==='/'||supportedSlugs.has(href.slice(1)))})).filter(g=>g.items.length);
for (const slug of Object.keys(modules)) if (!supportedSlugs.has(slug)) delete modules[slug];
