/**
 * Helper kecil: ID unik & sapaan berbasis waktu.
 */
import { UI_LABELS } from "@/data/uiLabels";

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 11) return UI_LABELS.dashboard.sapaPagi;
  if (h < 15) return UI_LABELS.dashboard.sapaSiang;
  if (h < 18) return UI_LABELS.dashboard.sapaSore;
  return UI_LABELS.dashboard.sapaMalam;
}

export function formatDateID(date = new Date()): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
