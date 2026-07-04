import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useLevelTheme } from "@/hooks/useLevelTheme";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LEVEL_ORDER, SCHOOL_LEVELS, type LevelId } from "@/data/schoolLevels";
import { UI_LABELS } from "@/data/uiLabels";
import { toast } from "sonner";

export const Route = createFileRoute("/pengaturan/")({
  head: () => ({ meta: [{ title: "Pengaturan — GuruPintar" }] }),
  component: PengaturanPage,
});

function PengaturanPage() {
  const { state, dispatch } = useApp();
  const level = useLevelTheme();

  return (
    <div>
      <PageHeader title={UI_LABELS.pengaturan.judul} description="Sesuaikan profil dan jenjang yang Anda ajar." />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="rounded-[var(--gp-radius)]">
          <CardContent className="p-5 space-y-3">
            <div className="font-semibold">{UI_LABELS.pengaturan.profil}</div>
            <div className="space-y-2">
              <Label>{UI_LABELS.pengaturan.nama}</Label>
              <Input
                value={state.profile.name}
                onChange={(e) => dispatch({ type: "SET_PROFILE", profile: { name: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label>{UI_LABELS.pengaturan.sekolah}</Label>
              <Input
                value={state.profile.school}
                onChange={(e) => dispatch({ type: "SET_PROFILE", profile: { school: e.target.value } })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[var(--gp-radius)]">
          <CardContent className="p-5 space-y-3">
            <div className="font-semibold">{UI_LABELS.pengaturan.jenjang}</div>
            <div className="grid grid-cols-3 gap-2">
              {LEVEL_ORDER.map((id) => {
                const l = SCHOOL_LEVELS[id];
                const active = level.id === id;
                return (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      dispatch({ type: "SET_LEVEL", level: id as LevelId });
                      toast.success(`Tema ${l.label} diaktifkan.`);
                    }}
                    className={`p-4 rounded-[var(--gp-radius)] border text-left transition-all ${
                      active
                        ? "border-[var(--gp-primary)] ring-2 ring-[var(--gp-primary)]/30"
                        : "border-border hover:border-[var(--gp-primary)]/50"
                    }`}
                    style={{
                      background: active ? l.theme.primary : "transparent",
                      color: active ? l.theme.primaryForeground : undefined,
                    }}
                  >
                    <div className="text-2xl font-bold">{l.label}</div>
                    <div className="text-xs opacity-80 mt-1">{l.tagline}</div>
                  </motion.button>
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              Aktif: <b>{level.label}</b> · Tone {level.tone} · Skala penilaian {level.scoringScale.min}–{level.scoringScale.max} (lulus ≥ {level.scoringScale.passing})
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
