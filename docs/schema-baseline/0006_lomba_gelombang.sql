ALTER TABLE public.lomba_pendaftaran
  ADD COLUMN gelombang smallint,
  ADD COLUMN biaya integer;

ALTER TABLE public.lomba_pendaftaran
  ADD CONSTRAINT lomba_pendaftaran_gelombang_ok CHECK (gelombang IS NULL OR gelombang BETWEEN 1 AND 3),
  ADD CONSTRAINT lomba_pendaftaran_biaya_ok CHECK (biaya IS NULL OR biaya BETWEEN 0 AND 10000000);