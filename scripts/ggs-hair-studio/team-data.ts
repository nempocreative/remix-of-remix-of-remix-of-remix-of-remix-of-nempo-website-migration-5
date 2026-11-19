// The owner's two GGS teams (men's barber studio and women's beauty studio), used by patch-team.mjs.
// Barber and beauty team names are provisional until the owner supplies the final names.
export type TeamMember = { id: string; name?: string; role: string; image: string; note: string; service: string };
export type TeamGroup = { id: "pria" | "wanita"; label: string; studio: string; intro: string; members: TeamMember[] };

export const TEAM_GROUPS: TeamGroup[] = [
  {
    id: "pria",
    label: "Tim GGS Barber",
    studio: "GGS Barber Studio",
    intro: "Barberman yang paham kebutuhan pria—rapi, cepat, dan bikin segar lagi.",
    members: [
      {
        id: "barber-1",
        name: "Sandi",
        role: "Barberman",
        image: "/team/tim-barber-1.jpg",
        service: "potong rambut",
        note: "Potongan rapi dimulai dari mendengarkan. Ia membaca bentuk wajah dan gaya keseharianmu, lalu merapikan setiap detail.",
      },
      {
        id: "barber-2",
        name: "Ahong",
        role: "Head Barberman",
        image: "/team/tim-barber-2.jpg",
        service: "potong rambut",
        note: "Spesialis fade dan taper yang rapi dan bersih, pas untuk tampilan harian maupun acara penting.",
      },
      {
        id: "barber-3",
        name: "Arab",
        role: "SPV Barberman",
        image: "/team/tim-barber-3.jpg",
        service: "potong rambut",
        note: "Teliti merapikan kumis dan jenggot hingga garis potongan, supaya kamu pulang dengan tampilan segar.",
      },
      {
        id: "barber-4",
        name: "Risman",
        role: "Barberman",
        image: "/team/tim-barber-4.jpg",
        service: "potong rambut",
        note: "Senang mengobrol soal gaya rambut terbaru dan menyesuaikannya dengan rambut dan keseharianmu.",
      },
      {
        id: "barber-5",
        name: "Deni",
        role: "Terapis",
        image: "/team/tim-barber-5.jpg",
        service: "perawatan & pijat",
        note: "Ahli perawatan dan pijat untuk pria—dari creambath hingga pijat relaksasi—supaya badan segar lagi setelah potong rambut.",
      },
    ],
  },
  {
    id: "wanita",
    label: "Tim GGS Beauty",
    studio: "GGS Beauty",
    intro: "Tangan-tangan terampil yang merawatmu dari ujung rambut hingga ujung kuku, dalam suasana tenang dan nyaman.",
    members: [
      {
        id: "nail-art",
        name: "Anggi",
        role: "Terapis",
        image: "/team/tim-beauty-1.jpg",
        service: "perawatan wajah & tubuh",
        note: "Merawat kulit dan tubuhmu dengan lembut—totok wajah, masker, lulur, hingga waxing—supaya kamu pulang dengan rasa percaya diri.",
      },
      {
        id: "terapis",
        name: "Syifa",
        role: "Hairstylist",
        image: "/team/tim-beauty-2.jpg",
        service: "potong & styling rambut",
        note: "Chapster andalan untuk potong dan styling rambut wanita—dari layer hingga blow—ditata sesuai bentuk wajah dan gayamu.",
      },
      {
        id: "massage-wanita",
        name: "Siti",
        role: "Terapis",
        image: "/team/tim-beauty-3.jpg",
        service: "massage & perawatan tubuh",
        note: "Body massage, refleksi, hingga bekam untuk mengembalikan rasa segar. Setiap gerakan disesuaikan agar tubuhmu benar-benar rileks.",
      },
      {
        id: "hair-styling",
        name: "Isma",
        role: "Nailist",
        image: "/team/tim-beauty-4.jpg",
        service: "nail art",
        note: "Dari warna polos hingga cat eye dan chrome, setiap kuku dikerjakan dengan teliti dan sabar agar tampil cantik dan tahan lama.",
      },
      {
        id: "terapis-2",
        name: "Viving",
        role: "Hair Stylist",
        image: "/team/tim-beauty-5.jpg",
        service: "hair styling",
        note: "Potong, catok, curly, hingga warna rambut—ditata agar terasa seperti dirimu: ringan, percaya diri, dan mudah dirawat setiap hari.",
      },
      {
        id: "hair-color",
        name: "Bela",
        role: "Head Admin",
        image: "/team/tim-beauty-6.jpg",
        service: "booking & jadwal",
        note: "Mengatur jadwal dan memastikan setiap booking berjalan lancar. Hubungi dia untuk atur waktu perawatanmu.",
      },
      {
        id: "spa",
        name: "Rosa",
        role: "Admin",
        image: "/team/tim-beauty-7.jpg",
        service: "booking & informasi",
        note: "Siap membantu menjawab pertanyaan dan mengatur jadwalmu, supaya kunjunganmu ke salon terasa mudah dan nyaman.",
      },
    ],
  },
];

export const teamWaText = (group: TeamGroup, member: TeamMember) =>
  `Halo ${group.studio}, saya ingin booking layanan *${member.service}* dengan tim ${member.role}. Kapan jadwal yang tersedia?`;
