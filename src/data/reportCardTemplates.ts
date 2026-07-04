/**
 * Template catatan wali kelas + checklist sikap & kompetensi per jenjang.
 * Bank kalimat dipakai oleh fitur "Sarankan Kalimat" (lokal, tanpa AI eksternal).
 */
import type { LevelId } from "./schoolLevels";

export interface AttitudeItem {
  id: string;
  label: string;
  description: string;
}

export const ATTITUDE_CHECKLIST: AttitudeItem[] = [
  { id: "tekun", label: "Belajar tekun", description: "Konsisten dalam mengerjakan tugas dan latihan." },
  { id: "sopan", label: "Bersikap sopan", description: "Menghormati guru, teman, dan lingkungan sekolah." },
  { id: "percaya-diri", label: "Percaya diri", description: "Berani menyampaikan pendapat dan bertanya." },
  { id: "pantang-menyerah", label: "Pantang menyerah", description: "Tidak mudah putus asa saat menghadapi kesulitan." },
  { id: "kerja-sama", label: "Kerja sama", description: "Mampu bekerja dalam kelompok dengan baik." },
  { id: "jujur", label: "Jujur", description: "Mengerjakan tugas sendiri dan mengakui kesalahan." },
];

export interface ReportPhrase {
  tone: "positif" | "perlu-bimbingan";
  text: string;
}

export const REPORT_PHRASES: Record<LevelId, ReportPhrase[]> = {
  sd: [
    { tone: "positif", text: "Ananda menunjukkan semangat belajar yang luar biasa dan selalu ceria di kelas." },
    { tone: "positif", text: "Ananda rajin bertanya dan senang membantu teman yang kesulitan." },
    { tone: "positif", text: "Ananda mampu menyelesaikan tugas tepat waktu dengan hasil yang rapi." },
    { tone: "perlu-bimbingan", text: "Ananda perlu lebih percaya diri dalam menyampaikan pendapat di depan kelas." },
    { tone: "perlu-bimbingan", text: "Ananda diharapkan lebih teliti dalam memeriksa kembali pekerjaannya." },
  ],
  smp: [
    { tone: "positif", text: "Peserta didik menunjukkan kemampuan berpikir analitis yang baik selama diskusi kelompok." },
    { tone: "positif", text: "Peserta didik aktif berkontribusi dalam proyek kelas dan dapat memimpin tim." },
    { tone: "positif", text: "Peserta didik konsisten menyelesaikan asesmen formatif dengan hasil memuaskan." },
    { tone: "perlu-bimbingan", text: "Peserta didik perlu mengembangkan kebiasaan belajar mandiri di luar jam pelajaran." },
    { tone: "perlu-bimbingan", text: "Peserta didik diharapkan lebih disiplin dalam mengelola waktu pengumpulan tugas." },
  ],
  sma: [
    { tone: "positif", text: "Peserta didik mendemonstrasikan kemampuan berpikir kritis dan argumentasi yang kuat." },
    { tone: "positif", text: "Peserta didik mampu menghubungkan konsep teori dengan isu kontekstual secara reflektif." },
    { tone: "positif", text: "Peserta didik menunjukkan kemandirian belajar dan inisiatif riset yang baik." },
    { tone: "perlu-bimbingan", text: "Peserta didik dianjurkan memperdalam keterampilan menulis argumentatif." },
    { tone: "perlu-bimbingan", text: "Peserta didik perlu meningkatkan konsistensi dalam menyelesaikan asesmen sumatif." },
  ],
};

export interface ReportTemplate {
  level: LevelId;
  heading: string;
  /** Bagian rapor yang dirender. */
  sections: { id: string; title: string }[];
}

export const REPORT_TEMPLATES: Record<LevelId, ReportTemplate> = {
  sd: {
    level: "sd",
    heading: "Laporan Hasil Belajar Peserta Didik",
    sections: [
      { id: "identitas", title: "Identitas Peserta Didik" },
      { id: "akademik", title: "Capaian Pembelajaran" },
      { id: "sikap", title: "Penilaian Sikap" },
      { id: "catatan", title: "Catatan Wali Kelas" },
    ],
  },
  smp: {
    level: "smp",
    heading: "Laporan Hasil Belajar Semester",
    sections: [
      { id: "identitas", title: "Identitas Peserta Didik" },
      { id: "akademik", title: "Nilai Mata Pelajaran" },
      { id: "sikap", title: "Profil Pelajar Pancasila" },
      { id: "ekskul", title: "Ekstrakurikuler" },
      { id: "catatan", title: "Catatan Wali Kelas" },
    ],
  },
  sma: {
    level: "sma",
    heading: "Laporan Hasil Belajar Peserta Didik",
    sections: [
      { id: "identitas", title: "Identitas Peserta Didik" },
      { id: "akademik", title: "Nilai Akademik" },
      { id: "sikap", title: "Profil Pelajar Pancasila" },
      { id: "prestasi", title: "Prestasi & Capaian" },
      { id: "catatan", title: "Catatan Wali Kelas" },
    ],
  },
};
