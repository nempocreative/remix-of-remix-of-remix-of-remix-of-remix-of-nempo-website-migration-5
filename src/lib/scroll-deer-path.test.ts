import { describe, expect, it } from "vitest";
import { bolehBertengger, jepitSeretan, parkirBerlaku, rapikanJangkar, deerGroundTarget, deerSpotX, faceToward, hopPose, hopStep, partnerSpotX } from "@/lib/scroll-deer-path";

const spots = [
  { x: 100, y: 1000 },
  { x: 400, y: 2000 },
  { x: 150, y: 2600 },
];

describe("deerGroundTarget", () => {
  it("diam di bagian pertama sebelum digulir", () => {
    expect(deerGroundTarget(spots, 300, 800)).toEqual({ x: 100, y: 1000 });
  });

  it("masih diam di bagian yang sama sesaat setelah melewatinya", () => {
    expect(deerGroundTarget(spots, 1150, 800)).toEqual({ x: 100, y: 1000 });
  });

  it("berada di tengah jalan saat garis bidik di tengah dua bagian", () => {
    expect(deerGroundTarget(spots, 1500, 800)).toEqual({ x: 250, y: 1500 });
  });

  it("sudah mendarat di bagian berikutnya sebelum bagian itu sampai tengah layar", () => {
    expect(deerGroundTarget(spots, 1850, 800)).toEqual({ x: 400, y: 2000 });
  });

  it("naik kembali saat digulir ke atas (jalur sama dua arah)", () => {
    expect(deerGroundTarget(spots, 2300, 800)).toEqual({ x: 275, y: 2300 });
  });

  it("berhenti di bagian terakhir", () => {
    expect(deerGroundTarget(spots, 9000, 800)).toEqual({ x: 150, y: 2600 });
  });

  it("tidak tampil bila tidak ada bagian", () => {
    expect(deerGroundTarget([], 500, 800)).toBeNull();
  });
});

describe("batas bagian pada deerGroundTarget", () => {
  const berbatas = [
    { x: 300, y: 500, minX: 260, maxX: 540 },
    { x: 120, y: 1500, minX: 40, maxX: 900 },
  ];

  it("memakai batas bagian pertama saat belum digulir", () => {
    expect(deerGroundTarget(berbatas, 100, 800)).toEqual({ x: 300, y: 500, minX: 260, maxX: 540 });
  });

  it("memakai batas bagian terdekat saat di tengah jalan", () => {
    expect(deerGroundTarget(berbatas, 900, 800)!.minX).toBe(260);
    expect(deerGroundTarget(berbatas, 1400, 800)!.minX).toBe(40);
  });
});

describe("bolehBertengger", () => {
  it("bertengger di atas bilah pencarian selama tepinya masih terlihat penuh", () => {
    expect(bolehBertengger(347, 0, 61)).toBe(true);
  });

  it("lepas dari bilah saat tepinya hampir terpotong atas layar", () => {
    expect(bolehBertengger(347, 300, 61)).toBe(false);
  });
});

describe("deerSpotX", () => {
  it("tidak pernah keluar dari lebar isi halaman", () => {
    for (let i = 0; i < 14; i++) {
      const x = deerSpotX(i, 16, 459, 60);
      expect(x - 30).toBeGreaterThanOrEqual(16);
      expect(x + 30).toBeLessThanOrEqual(16 + 459);
    }
  });
});

describe("hopStep", () => {
  it("menyelesaikan lompatan sampai menapak saat gulir berhenti", () => {
    let phase = 0.6;
    for (let i = 0; i < 40; i++) phase = hopStep(phase, 1 / 60, false, 0.42);
    expect(phase).toBe(0);
  });

  it("tetap diam bila tidak bergerak dan sudah menapak", () => {
    expect(hopStep(0, 1 / 60, false, 0.42)).toBe(0);
  });

  it("terus melompat selama masih bergerak", () => {
    expect(hopStep(0.98, 1 / 30, true, 0.42)).toBeGreaterThan(0);
  });
});

describe("hopPose", () => {
  it("kaki menapak tanpa terangkat saat diam", () => {
    expect(hopPose(0).lift).toBe(0);
  });
  it("paling tinggi di tengah lompatan", () => {
    expect(hopPose(0.5).lift).toBeCloseTo(1);
  });
});

describe("partnerSpotX", () => {
  it("betina berdiri di sisi kanan saat jantan menuju sisi kiri halaman", () => {
    expect(partnerSpotX(60, 60, 50, 30, 430)).toBe(110);
  });
  it("betina berdiri di sisi kiri saat jantan menuju sisi kanan halaman", () => {
    expect(partnerSpotX(400, 400, 50, 30, 430)).toBe(350);
  });
  it("tidak pernah keluar dari lebar isi halaman", () => {
    expect(partnerSpotX(100, 420, 50, 30, 430)).toBe(430);
    expect(partnerSpotX(400, 40, 50, 30, 430)).toBe(30);
  });
});

describe("faceToward", () => {
  it("kedua rusa saling berhadapan", () => {
    expect(faceToward(100, 160, -1)).toBe(1);
    expect(faceToward(160, 100, 1)).toBe(-1);
  });
  it("tetap ke arah semula bila posisinya sama", () => {
    expect(faceToward(100, 100.4, -1)).toBe(-1);
  });
});

describe("rapikanJangkar", () => {
  it("urut dari atas dan menggabungkan pijakan yang terlalu dekat", () => {
    const r = rapikanJangkar(
      [
        { top: 900, left: 0, width: 400 },
        { top: 100, left: 0, width: 400 },
        { top: 130, left: 0, width: 400 },
      ],
      400,
      100,
    );
    expect(r.map((j) => j.top)).toEqual([100, 900]);
  });

  it("menjepit ke layar dan membuang bentuk yang terlalu sempit", () => {
    const r = rapikanJangkar(
      [
        { top: 100, left: -50, width: 600 },
        { top: 400, left: 10, width: 80 },
      ],
      390,
      120,
    );
    expect(r).toEqual([{ top: 100, left: 8, width: 374 }]);
  });

  it("bilah pencarian menang bila berdekatan dengan bagian lain", () => {
    const r = rapikanJangkar(
      [
        { top: 200, left: 0, width: 400 },
        { top: 230, left: 20, width: 300, cari: true },
      ],
      400,
      100,
    );
    expect(r).toHaveLength(1);
    expect(r[0]!.cari).toBe(true);
  });
});

describe("rusa digeser pengunjung", () => {
  it("tetap di tempat barunya selama gulir tidak lebih dari 60% layar", () => {
    expect(parkirBerlaku(1000, 1480, 800)).toBe(true);
    expect(parkirBerlaku(1000, 520, 800)).toBe(true);
  });

  it("kembali ikut bagian halaman setelah digulir lebih dari 60% layar", () => {
    expect(parkirBerlaku(1000, 1481, 800)).toBe(false);
    expect(parkirBerlaku(1000, 519, 800)).toBe(false);
  });

  it("tidak bisa diseret keluar kiri/kanan layar", () => {
    expect(jepitSeretan(-50, 1400, 1000, 400, 800, 68)).toEqual({ x: 42, y: 1400 });
    expect(jepitSeretan(999, 1400, 1000, 400, 800, 68)).toEqual({ x: 358, y: 1400 });
  });

  it("kepala tidak terpotong di atas dan kaki tidak tenggelam di bawah layar", () => {
    expect(jepitSeretan(200, 900, 1000, 400, 800, 68).y).toBeCloseTo(1062.4);
    expect(jepitSeretan(200, 2500, 1000, 400, 800, 68).y).toBe(1792);
  });
});
