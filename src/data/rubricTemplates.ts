/**
 * Template rubrik penilaian per jenis tugas & jenjang.
 * Skala 1–5 dengan deskriptor naratif untuk tiap level.
 */
import type { LevelId } from "./schoolLevels";

export type RubricTaskType = "proyek" | "presentasi" | "esai" | "praktikum";

export interface RubricCriterion {
  id: string;
  name: string;
  icon: string;
  weight: number; // total semua kriteria = 100
  descriptors: Record<1 | 2 | 3 | 4 | 5, string>;
}

export interface RubricTemplate {
  id: string;
  level: LevelId;
  type: RubricTaskType;
  title: string;
  description: string;
  criteria: RubricCriterion[];
}

const skalaUmum = (
  k: string,
): RubricCriterion["descriptors"] => ({
  1: `Belum menunjukkan ${k}.`,
  2: `Mulai berkembang dalam ${k} dengan bimbingan.`,
  3: `Cukup baik dalam ${k}, masih perlu konsistensi.`,
  4: `Baik dan mandiri dalam ${k}.`,
  5: `Sangat baik, dapat menjadi contoh dalam ${k}.`,
});

export const RUBRIC_TEMPLATES: RubricTemplate[] = [
  {
    id: "sd-proyek",
    level: "sd",
    type: "proyek",
    title: "Proyek Mini Kelas",
    description: "Penilaian proyek tematik sederhana untuk SD.",
    criteria: [
      { id: "kreativitas", name: "Kreativitas", icon: "✨", weight: 30, descriptors: skalaUmum("kreativitas") },
      { id: "kerjasama", name: "Kerja Sama", icon: "🤝", weight: 30, descriptors: skalaUmum("kerja sama") },
      { id: "hasil", name: "Hasil Karya", icon: "🎨", weight: 25, descriptors: skalaUmum("kualitas hasil karya") },
      { id: "presentasi", name: "Bercerita", icon: "🗣️", weight: 15, descriptors: skalaUmum("bercerita hasil karya") },
    ],
  },
  {
    id: "smp-presentasi",
    level: "smp",
    type: "presentasi",
    title: "Presentasi Kelompok",
    description: "Rubrik presentasi proyek kelompok SMP.",
    criteria: [
      { id: "konten", name: "Kedalaman Konten", icon: "📚", weight: 35, descriptors: skalaUmum("penguasaan konten") },
      { id: "struktur", name: "Struktur Penyampaian", icon: "🧩", weight: 25, descriptors: skalaUmum("struktur penyampaian") },
      { id: "visual", name: "Visual & Media", icon: "🖼️", weight: 20, descriptors: skalaUmum("pemanfaatan media visual") },
      { id: "tanyajawab", name: "Tanya Jawab", icon: "💬", weight: 20, descriptors: skalaUmum("respon tanya jawab") },
    ],
  },
  {
    id: "sma-esai",
    level: "sma",
    type: "esai",
    title: "Esai Argumentatif",
    description: "Penilaian esai argumentatif SMA dengan fokus berpikir kritis.",
    criteria: [
      { id: "tesis", name: "Kekuatan Tesis", icon: "🎯", weight: 25, descriptors: skalaUmum("ketajaman tesis") },
      { id: "argumen", name: "Argumen & Bukti", icon: "🔍", weight: 30, descriptors: skalaUmum("kualitas argumen & bukti") },
      { id: "struktur", name: "Struktur & Koherensi", icon: "🧱", weight: 20, descriptors: skalaUmum("struktur paragraf") },
      { id: "bahasa", name: "Penggunaan Bahasa", icon: "✍️", weight: 15, descriptors: skalaUmum("ketepatan bahasa") },
      { id: "refleksi", name: "Refleksi Kritis", icon: "🧠", weight: 10, descriptors: skalaUmum("refleksi kritis") },
    ],
  },
  {
    id: "smp-praktikum",
    level: "smp",
    type: "praktikum",
    title: "Praktikum IPA",
    description: "Penilaian praktikum IPA SMP.",
    criteria: [
      { id: "prosedur", name: "Ketaatan Prosedur", icon: "🧪", weight: 30, descriptors: skalaUmum("ketaatan prosedur") },
      { id: "ketelitian", name: "Ketelitian Pengukuran", icon: "📏", weight: 25, descriptors: skalaUmum("ketelitian") },
      { id: "analisis", name: "Analisis Data", icon: "📈", weight: 25, descriptors: skalaUmum("analisis data") },
      { id: "kebersihan", name: "Keselamatan & Kebersihan", icon: "🧼", weight: 20, descriptors: skalaUmum("keselamatan kerja") },
    ],
  },
];

export const RUBRIC_TYPE_LABEL: Record<RubricTaskType, string> = {
  proyek: "Proyek",
  presentasi: "Presentasi",
  esai: "Esai",
  praktikum: "Praktikum",
};
