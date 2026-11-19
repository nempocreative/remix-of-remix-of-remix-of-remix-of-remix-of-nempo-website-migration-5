import RundownHari3 from '../components/RundownHari3';
import { HARI_ACARA, PUNCAK_HARI_3_PAGI, RUNDOWN_HARI_3_PAGI, SOROTAN_HARI_3_PAGI } from '../jadwal';

export default function Slide23RundownHari3() {
  return (
    <RundownHari3
      rows={RUNDOWN_HARI_3_PAGI}
      sorotan={SOROTAN_HARI_3_PAGI}
      puncak={PUNCAK_HARI_3_PAGI}
      tanggal={HARI_ACARA.puncak}
      nomor="03"
      sesi="Pagi"
      kutipan={"Seni Sunda &\nKarya UMKM"}
      footerSlide={23}
    />
  );
}
