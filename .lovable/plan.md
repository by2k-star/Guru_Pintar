# Rencana Pembangunan "GuruPintar"

Aplikasi manajemen pembelajaran untuk guru SD/SMP/SMA. Mobile-first, tema adaptif per jenjang, semua teks/template dipisah di `src/data/`.

## Catatan Stack
Project ini memakai **TanStack Router** (bukan React Router DOM) dan **Vite + Tailwind v4**. Saya akan tetap pakai TanStack Router untuk navigasi (sesuai konvensi project) — fungsinya setara. Framer Motion, jsPDF, html2canvas, pptxgenjs akan ditambahkan.

## Tahap 1 — Struktur Data (`src/data/`)
Dibangun lebih dulu, sebelum UI. Setiap file diberi komentar penjelasan.

- `schoolLevels.ts` — Config SD/SMP/SMA: id, label, palet warna (token CSS), istilah penilaian (Nilai/Skor/IPK-style), struktur kelas (Kelas 1-6 / 7-9 / 10-12), tone bahasa.
- `rubricTemplates.ts` — Template rubrik per jenis tugas (Proyek, Presentasi, Esai, Praktikum) × jenjang. Kriteria + skala 1-5 + deskriptor.
- `presentationTemplates.ts` — Struktur 10 slide per mata pelajaran umum (IPA, IPS, Matematika, Bahasa, PPKn, Seni, PJOK).
- `reportCardTemplates.ts` — Kalimat catatan wali kelas (positif/perlu bimbingan), checklist sikap & kompetensi, layout rapor per jenjang.
- `moduleTemplates.ts` — Skeleton modul ajar: Tujuan Pembelajaran, Materi Inti, Kegiatan Kokurikuler kontekstual, Asesmen Formatif & Sumatif.
- `uiLabels.ts` — Semua label UI Bahasa Indonesia (menu, tombol, toast, empty state, validasi).
- `subjects.ts` (pendukung) — Daftar mapel per jenjang.

## Tahap 2 — State Global
- `src/context/AppContext.tsx`: `useReducer` untuk `level` (SD/SMP/SMA), profil guru, daftar modul/rubrik/presentasi/rapor/soal.
- Persist ke `localStorage` (hook `usePersistedReducer`).
- `useLabels()` & `useLevelTheme()` hook membaca dari data files.

## Tahap 3 — Theming Adaptif
Token CSS di `src/styles.css` ditambah variabel per jenjang:
- SD: ceria, pastel hangat, rounded besar, font playful.
- SMP: semi-formal, biru-hijau seimbang.
- SMA: minimalis profesional, mono-accent.
Switch jenjang ⇒ set `data-level` di `<html>`, semua token re-resolve.

## Tahap 4 — Routing & Shell
Route files di `src/routes/`:
- `index.tsx` — Dashboard.
- `modul.tsx` + `modul.baru.tsx` + `modul.$id.tsx`.
- `rubrik.tsx` + `rubrik.baru.tsx`.
- `presentasi.tsx` + `presentasi.$id.tsx` (mode editor + slideshow).
- `rapor.tsx` + `rapor.$siswaId.tsx`.
- `bank-soal.tsx` + `ujian.$id.tsx`.
- `pengaturan.tsx` (ganti jenjang, profil).

Shell: sidebar di desktop, bottom-nav di mobile (≥44px tap target).

## Tahap 5 — Fitur (komponen modular)
1. **Dashboard** — `DashboardSummary`, `TodayAgenda`, `NotificationList`, `QuickActions`.
2. **Modul Ajar** — `ModuleForm`, `CardModul`, `ModulePreview`, `ExportModulePDF` (jsPDF + html2canvas).
3. **Rubrik** — `RubricBuilder` (form dinamis kriteria), `TableRubrik` (visual dengan ikon Lucide), export PDF/PNG.
4. **Presentasi** — `SlideEditor` (drag-drop ringan via dnd-kit), `SlidePresenter` (mode fullscreen), export PPTX (pptxgenjs) & PDF.
5. **Rapor** — `ReportForm` dengan checklist sikap, suggestion kalimat dari template, layout clipboard cetak.
6. **Bank Soal & Ujian** — `QuestionForm` (PG/Esai), `ExamGenerator` (acak + kunci), `ExamRunner` dengan timer & auto-submit, `ResultAnalysis` (chart sederhana via Recharts).

## Tahap 6 — UX Polishing
- Framer Motion: transisi route, modal, toast, slide editor.
- Skeleton loader (bukan spinner).
- Empty states ramah dengan ilustrasi SVG sederhana.
- Toast via `sonner`.
- Kontras WCAG AA, focus ring jelas, navigasi keyboard dasar.

## Catatan Teknis
- "Simpan modul ke `moduleTemplates.ts`" diinterpretasikan sebagai: template seed dari file, modul buatan user disimpan di localStorage di bawah key `gp.modules` (file source tidak bisa ditulis runtime di browser). Modul user bisa di-"promote" ke template lokal.
- AI suggestion rapor: implementasi awal pakai bank kalimat di `reportCardTemplates.ts` (acak/kontekstual). Integrasi LLM bisa ditambah belakangan via Lovable AI Gateway bila diminta.
- Export PPTX di browser pakai `pptxgenjs`.

## Pertanyaan Sebelum Mulai
1. Setuju pakai TanStack Router (sesuai stack project) menggantikan React Router DOM yang Anda sebut?
2. Untuk "AI suggestion" rapor: cukup bank kalimat lokal dulu, atau aktifkan Lovable AI (butuh Lovable Cloud)?
3. Prioritas urutan build kalau scope besar: **Dashboard → Modul → Rubrik → Rapor → Presentasi → Bank Soal**, oke?