/**
 * Template 10 slide presentasi per mata pelajaran.
 * Struktur tetap: Judul → Pendahuluan → Pengertian → Komponen Utama →
 * Proses → Data/Grafik → Contoh Sehari-hari → Manfaat → Kesimpulan → Terima Kasih.
 */

export type SlideKind =
  | "judul"
  | "pendahuluan"
  | "pengertian"
  | "komponen"
  | "proses"
  | "data"
  | "contoh"
  | "manfaat"
  | "kesimpulan"
  | "penutup";

export interface SlideTemplate {
  kind: SlideKind;
  title: string;
  /** Hint placeholder untuk bullet/body slide. */
  hints: string[];
}

export const SLIDE_STRUCTURE: SlideTemplate[] = [
  { kind: "judul", title: "Halaman Judul", hints: ["Judul topik", "Nama guru & kelas"] },
  { kind: "pendahuluan", title: "Pendahuluan", hints: ["Mengapa topik ini penting", "Tujuan pembelajaran"] },
  { kind: "pengertian", title: "Pengertian", hints: ["Definisi inti", "Kata kunci"] },
  { kind: "komponen", title: "Komponen Utama", hints: ["Komponen 1", "Komponen 2", "Komponen 3"] },
  { kind: "proses", title: "Proses / Mekanisme", hints: ["Langkah 1", "Langkah 2", "Langkah 3"] },
  { kind: "data", title: "Data atau Grafik", hints: ["Tabel angka", "Tren / perbandingan"] },
  { kind: "contoh", title: "Contoh dalam Kehidupan Sehari-hari", hints: ["Contoh 1", "Contoh 2"] },
  { kind: "manfaat", title: "Manfaat", hints: ["Manfaat untuk siswa", "Manfaat untuk masyarakat"] },
  { kind: "kesimpulan", title: "Kesimpulan", hints: ["Poin penting", "Refleksi"] },
  { kind: "penutup", title: "Terima Kasih", hints: ["Ajakan diskusi", "Kontak guru"] },
];

export interface PresentationSeed {
  subjectId: string;
  topic: string;
  bullets: Partial<Record<SlideKind, string[]>>;
}

/** Contoh seed konten per mapel — bisa diperluas. */
export const PRESENTATION_SEEDS: PresentationSeed[] = [
  {
    subjectId: "ipa",
    topic: "Fotosintesis",
    bullets: {
      pendahuluan: ["Tumbuhan adalah produsen utama di Bumi.", "Tanpa fotosintesis, rantai makanan terputus."],
      pengertian: ["Proses tumbuhan mengolah cahaya menjadi makanan.", "Terjadi pada kloroplas daun."],
      komponen: ["Cahaya matahari", "Air (H₂O)", "Karbon dioksida (CO₂)", "Klorofil"],
      proses: ["Cahaya diserap klorofil", "Air dipecah → oksigen", "CO₂ + energi → glukosa"],
      data: ["1 hektar hutan menyerap ±6 ton CO₂/tahun."],
      contoh: ["Tanaman di pekarangan menyegarkan udara.", "Sawah padi menjadi sumber pangan."],
      manfaat: ["Sumber oksigen", "Sumber pangan", "Menjaga iklim"],
      kesimpulan: ["Fotosintesis adalah fondasi kehidupan."],
    },
  },
  {
    subjectId: "ips",
    topic: "Globalisasi",
    bullets: {
      pendahuluan: ["Dunia semakin terhubung berkat teknologi."],
      pengertian: ["Proses mendunianya gagasan, budaya, dan ekonomi."],
      komponen: ["Teknologi informasi", "Perdagangan internasional", "Migrasi", "Budaya populer"],
      proses: ["Inovasi teknologi", "Liberalisasi perdagangan", "Pertukaran budaya"],
      contoh: ["Belanja online lintas negara.", "Tren musik K-Pop mendunia."],
      manfaat: ["Akses informasi cepat", "Peluang ekonomi baru"],
      kesimpulan: ["Globalisasi membawa peluang & tantangan."],
    },
  },
  {
    subjectId: "mtk",
    topic: "Bilangan Pecahan",
    bullets: {
      pendahuluan: ["Pecahan ada di mana-mana: pizza, jam, uang."],
      pengertian: ["Bagian dari satu keseluruhan."],
      komponen: ["Pembilang", "Penyebut", "Garis pecahan"],
      proses: ["Penjumlahan", "Pengurangan", "Perkalian", "Pembagian"],
      contoh: ["½ potong roti", "¾ jam = 45 menit"],
      manfaat: ["Membantu membagi sumber daya secara adil."],
      kesimpulan: ["Pecahan = alat berbagi yang presisi."],
    },
  },
];
