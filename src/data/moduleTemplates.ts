/**
 * Skeleton modul ajar per mata pelajaran.
 * Catatan: modul buatan user disimpan ke localStorage (key `gp.modules`),
 * bukan dimutasi ke file ini saat runtime. File ini berperan sebagai seed/template.
 */
import type { LevelId } from "./schoolLevels";

export interface ModuleTemplate {
  id: string;
  level: LevelId;
  subjectId: string;
  title: string;
  durationMinutes: number;
  objectives: string[];
  coreMaterial: string[];
  /** Kegiatan kokurikuler yang relevan dengan kehidupan sehari-hari. */
  cocurricular: string[];
  formativeAssessment: string[];
  summativeAssessment: string[];
}

export const MODULE_TEMPLATES: ModuleTemplate[] = [
  {
    id: "sd-ipas-air",
    level: "sd",
    subjectId: "ipas",
    title: "Siklus Air di Sekitar Kita",
    durationMinutes: 70,
    objectives: [
      "Peserta didik mampu menjelaskan tahap siklus air dengan kata-kata sendiri.",
      "Peserta didik mampu menyebutkan 3 cara menghemat air di rumah.",
    ],
    coreMaterial: ["Tahap evaporasi, kondensasi, presipitasi.", "Peran matahari dalam siklus air."],
    cocurricular: [
      "Pengamatan genangan air setelah hujan di halaman sekolah.",
      "Membuat poster ajakan hemat air untuk dipasang di rumah.",
    ],
    formativeAssessment: ["Tanya jawab interaktif", "Gambar siklus air secara berkelompok"],
    summativeAssessment: ["Kuis singkat 10 soal", "Presentasi poster hemat air"],
  },
  {
    id: "smp-ipa-listrik",
    level: "smp",
    subjectId: "ipa",
    title: "Rangkaian Listrik Sederhana",
    durationMinutes: 90,
    objectives: [
      "Peserta didik menganalisis perbedaan rangkaian seri dan paralel.",
      "Peserta didik merancang rangkaian listrik sederhana untuk lampu belajar.",
    ],
    coreMaterial: ["Konsep arus, tegangan, hambatan.", "Hukum Ohm dasar."],
    cocurricular: [
      "Audit penggunaan listrik di rumah selama 3 hari.",
      "Merakit lampu meja dari bahan bekas (proyek mini).",
    ],
    formativeAssessment: ["LKPD eksperimen", "Diskusi hasil pengukuran"],
    summativeAssessment: ["Laporan proyek lampu belajar", "Tes tertulis"],
  },
  {
    id: "sma-eko-inflasi",
    level: "sma",
    subjectId: "eko",
    title: "Inflasi dan Daya Beli Masyarakat",
    durationMinutes: 90,
    objectives: [
      "Peserta didik menganalisis penyebab dan dampak inflasi terhadap daya beli.",
      "Peserta didik mengevaluasi kebijakan moneter dalam menanggapi inflasi.",
    ],
    coreMaterial: ["Jenis inflasi", "Indeks Harga Konsumen", "Kebijakan moneter & fiskal"],
    cocurricular: [
      "Survei harga 5 komoditas pokok di pasar lokal selama 2 minggu.",
      "Diskusi panel: dampak inflasi terhadap pelajar.",
    ],
    formativeAssessment: ["Mini-research presentasi data harga", "Refleksi tertulis"],
    summativeAssessment: ["Esai argumentatif", "Tes pilihan ganda HOTS"],
  },
];
