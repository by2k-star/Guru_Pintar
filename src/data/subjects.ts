/**
 * Daftar mata pelajaran per jenjang. Dipakai oleh form Modul Ajar,
 * Presentasi, dan Bank Soal untuk men-filter pilihan mapel.
 */
import type { LevelId } from "./schoolLevels";

export interface Subject {
  id: string;
  name: string;
  icon: string; // emoji ringan untuk SD agar terasa ramah
}

export const SUBJECTS: Record<LevelId, Subject[]> = {
  sd: [
    { id: "bind", name: "Bahasa Indonesia", icon: "📖" },
    { id: "mtk", name: "Matematika", icon: "➗" },
    { id: "ipas", name: "IPAS", icon: "🌱" },
    { id: "ppkn", name: "Pendidikan Pancasila", icon: "🇮🇩" },
    { id: "seni", name: "Seni Budaya", icon: "🎨" },
    { id: "pjok", name: "PJOK", icon: "⚽" },
    { id: "agama", name: "Pendidikan Agama", icon: "🕌" },
  ],
  smp: [
    { id: "bind", name: "Bahasa Indonesia", icon: "📖" },
    { id: "bing", name: "Bahasa Inggris", icon: "🌐" },
    { id: "mtk", name: "Matematika", icon: "➗" },
    { id: "ipa", name: "IPA Terpadu", icon: "🔬" },
    { id: "ips", name: "IPS Terpadu", icon: "🗺️" },
    { id: "ppkn", name: "Pendidikan Pancasila", icon: "🇮🇩" },
    { id: "informatika", name: "Informatika", icon: "💻" },
    { id: "seni", name: "Seni Budaya", icon: "🎨" },
    { id: "pjok", name: "PJOK", icon: "⚽" },
  ],
  sma: [
    { id: "bind", name: "Bahasa Indonesia", icon: "📖" },
    { id: "bing", name: "Bahasa Inggris", icon: "🌐" },
    { id: "mtk", name: "Matematika", icon: "➗" },
    { id: "fis", name: "Fisika", icon: "⚛️" },
    { id: "kim", name: "Kimia", icon: "🧪" },
    { id: "bio", name: "Biologi", icon: "🧬" },
    { id: "sej", name: "Sejarah", icon: "🏛️" },
    { id: "geo", name: "Geografi", icon: "🌍" },
    { id: "eko", name: "Ekonomi", icon: "📊" },
    { id: "sos", name: "Sosiologi", icon: "👥" },
    { id: "ppkn", name: "Pendidikan Pancasila", icon: "🇮🇩" },
    { id: "informatika", name: "Informatika", icon: "💻" },
  ],
};
