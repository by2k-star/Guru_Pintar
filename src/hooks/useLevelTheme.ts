/**
 * Hook untuk meng-apply tema per jenjang ke <html data-level="...">.
 * CSS variables didefinisikan di src/styles.css [data-level="..."] blocks.
 */
import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { SCHOOL_LEVELS } from "@/data/schoolLevels";

export function useLevelTheme() {
  const { state } = useApp();
  const level = state.level;

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-level", level);
  }, [level]);

  return SCHOOL_LEVELS[level];
}
