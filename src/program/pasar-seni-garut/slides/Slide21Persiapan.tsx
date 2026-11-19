import RundownHari3 from '../components/RundownHari3';
import { HARI_PERSIAPAN, RUNDOWN_PERSIAPAN, SOROTAN_PERSIAPAN } from '../jadwal';

/** 29 Desember: hari persiapan, bukan acara. */
export default function Slide21Persiapan() {
  return (
    <RundownHari3
      rows={RUNDOWN_PERSIAPAN}
      sorotan={SOROTAN_PERSIAPAN}
      puncak={[]}
      tanggal={HARI_PERSIAPAN}
      nomor="00"
      sesi="Bukan Acara"
      judul="PERSIAPAN"
      kutipan={"Registrasi Tenant &\nTechnical Meeting"}
      footerSlide={21}
    />
  );
}
