import RundownHari3 from '../components/RundownHari3';
import { HARI_ACARA, PUNCAK_HARI_3_MALAM, RUNDOWN_HARI_3_MALAM, SOROTAN_HARI_3_MALAM } from '../jadwal';

export default function Slide23bRundownHari3Malam() {
  return (
    <RundownHari3
      rows={RUNDOWN_HARI_3_MALAM}
      sorotan={SOROTAN_HARI_3_MALAM}
      puncak={PUNCAK_HARI_3_MALAM}
      tanggal={HARI_ACARA.puncak}
      nomor="03"
      sesi="Malam"
      kutipan={"Tarian Pemenang &\nKesenian Sunda"}
      footerSlide={24}
    />
  );
}
