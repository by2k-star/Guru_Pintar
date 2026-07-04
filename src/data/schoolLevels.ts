/**
 * Konfigurasi jenjang sekolah (SD/SMP/SMA).
 * Setiap jenjang punya identitas visual (warna), istilah penilaian,
 * struktur kelas, dan tone bahasa yang berbeda. Dipakai oleh useLevelTheme()
 * untuk men-set CSS variables di <html data-level="...">.
 */

export type LevelId = "sd" | "smp" | "sma";

export interface SchoolLevel {
  id: LevelId;
  label: string;
  tagline: string;
  /** Kelas yang termasuk jenjang ini. */
  grades: string[];
  /** Istilah penilaian (SD: deskripsi, SMP/SMA: angka). */
  scoringLabel: string;
  scoringScale: { min: number; max: number; passing: number };
  /** Tone bahasa yang dipakai di copywriting. */
  tone: "ceria" | "semi-formal" | "profesional";
  /** Token warna (oklch) untuk tema adaptif. */
  theme: {
    primary: string;
    primaryForeground: string;
    accent: string;
    surface: string;
    radius: string;
  };
}

export const SCHOOL_LEVELS: Record<LevelId, SchoolLevel> = {
  sd: {
    id: "sd",
    label: "SD",
    tagline: "Belajar jadi petualangan seru!",
    grades: ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"],
    scoringLabel: "Capaian",
    scoringScale: { min: 0, max: 100, passing: 70 },
    tone: "ceria",
    theme: {
      primary: "oklch(0.72 0.16 45)", // hangat oranye-pastel
      primaryForeground: "oklch(0.18 0.02 60)",
      accent: "oklch(0.86 0.12 160)", // mint
      surface: "oklch(0.985 0.012 80)", // cream
      radius: "1.25rem",
    },
  },
  smp: {
    id: "smp",
    label: "SMP",
    tagline: "Eksplorasi ide dan keterampilan baru.",
    grades: ["Kelas 7", "Kelas 8", "Kelas 9"],
    scoringLabel: "Nilai",
    scoringScale: { min: 0, max: 100, passing: 75 },
    tone: "semi-formal",
    theme: {
      primary: "oklch(0.55 0.16 200)", // teal-biru
      primaryForeground: "oklch(0.99 0.005 200)",
      accent: "oklch(0.68 0.14 150)", // hijau
      surface: "oklch(0.985 0.008 220)",
      radius: "0.875rem",
    },
  },
  sma: {
    id: "sma",
    label: "SMA",
    tagline: "Membentuk pemikir kritis dan mandiri.",
    grades: ["Kelas 10", "Kelas 11", "Kelas 12"],
    scoringLabel: "Skor",
    scoringScale: { min: 0, max: 100, passing: 78 },
    tone: "profesional",
    theme: {
      primary: "oklch(0.32 0.04 260)", // slate elegan
      primaryForeground: "oklch(0.985 0.003 260)",
      accent: "oklch(0.62 0.18 28)", // aksen merah-tembaga
      surface: "oklch(0.98 0.004 260)",
      radius: "0.5rem",
    },
  },
};

export const LEVEL_ORDER: LevelId[] = ["sd", "smp", "sma"];
