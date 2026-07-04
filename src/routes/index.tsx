import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  Presentation,
  GraduationCap,
  FileQuestion,
  Bell,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useLevelTheme } from "@/hooks/useLevelTheme";
import { PageHeader } from "@/components/PageHeader";
import { UI_LABELS } from "@/data/uiLabels";
import { greeting, formatDateID } from "@/lib/gp-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beranda — GuruPintar" },
      {
        name: "description",
        content: "Dashboard guru: ringkasan kelas, tugas tertunda, jadwal mengajar, dan akses cepat.",
      },
    ],
  }),
  component: DashboardPage,
});

const STATS = [
  { key: "modul", to: "/modul", label: UI_LABELS.dashboard.statModul, icon: BookOpen, accessor: (s: ReturnType<typeof useApp>["state"]) => s.modules.length },
  { key: "rubrik", to: "/rubrik", label: UI_LABELS.dashboard.statRubrik, icon: ClipboardList, accessor: (s: ReturnType<typeof useApp>["state"]) => s.rubrics.length },
  { key: "rapor", to: "/rapor", label: UI_LABELS.dashboard.statRapor, icon: GraduationCap, accessor: (s: ReturnType<typeof useApp>["state"]) => s.reports.length },
  { key: "soal", to: "/bank-soal", label: UI_LABELS.dashboard.statSoal, icon: FileQuestion, accessor: (s: ReturnType<typeof useApp>["state"]) => s.questions.length },
] as const;

const QUICK_ACTIONS = [
  { to: "/modul/baru", label: "Modul baru", icon: BookOpen },
  { to: "/rubrik/baru", label: "Rubrik baru", icon: ClipboardList },
  { to: "/presentasi", label: "Buat presentasi", icon: Presentation },
  { to: "/rapor", label: "Tulis rapor", icon: GraduationCap },
] as const;

function DashboardPage() {
  const { state } = useApp();
  const level = useLevelTheme();

  const today = formatDateID();
  const hello = greeting();

  // Dummy "jadwal hari ini" — bisa berkembang nanti dari data sekolah.
  const schedule = [
    { time: "07.30", subject: state.modules[0]?.title ?? "Pembukaan kelas", room: level.grades[0] },
    { time: "09.15", subject: state.modules[1]?.title ?? "Diskusi kelompok", room: level.grades[1] ?? level.grades[0] },
    { time: "10.30", subject: state.modules[2]?.title ?? "Asesmen formatif", room: level.grades[2] ?? level.grades[0] },
  ];

  const notifications = [
    { id: "n1", text: "Deadline input nilai sumatif: Jumat ini.", tone: "warning" as const },
    { id: "n2", text: `Meeting orang tua ${level.grades[0]} Selasa pukul 14.00.`, tone: "info" as const },
    { id: "n3", text: "3 modul ajar menunggu refleksi mingguan.", tone: "default" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${hello}, ${state.profile.name} 👋`}
        description={`${today} · Mengajar jenjang ${level.label}`}
      />

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={s.to}>
                <Card className="hover:shadow-md transition-shadow border-border/60 rounded-[var(--gp-radius)]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div
                      className="size-10 rounded-[var(--gp-radius)] grid place-items-center text-[var(--gp-primary-foreground)]"
                      style={{ background: "var(--gp-primary)" }}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold leading-none">{s.accessor(state)}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Jadwal */}
        <Card className="lg:col-span-2 rounded-[var(--gp-radius)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4 text-[var(--gp-primary)]" />
              {UI_LABELS.dashboard.jadwal}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {schedule.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-[var(--gp-radius)] bg-accent/40"
              >
                <div className="text-sm font-mono w-14 tabular-nums text-[var(--gp-primary)]">{s.time}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{s.subject}</div>
                  <div className="text-xs text-muted-foreground">{s.room}</div>
                </div>
                <Badge variant="secondary">{level.label}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifikasi */}
        <Card className="rounded-[var(--gp-radius)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-4 text-[var(--gp-primary)]" />
              {UI_LABELS.dashboard.notifikasi}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="text-sm p-3 rounded-[var(--gp-radius)] bg-background border border-border/60"
              >
                <span
                  className={`inline-block size-2 rounded-full mr-2 align-middle ${
                    n.tone === "warning"
                      ? "bg-amber-500"
                      : n.tone === "info"
                        ? "bg-sky-500"
                        : "bg-muted-foreground"
                  }`}
                />
                {n.text}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick access */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <Sparkles className="size-4" /> {UI_LABELS.dashboard.aksesCepat}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.to}
                to={q.to}
                className="group p-4 rounded-[var(--gp-radius)] border border-border bg-background hover:border-[var(--gp-primary)] transition-colors flex flex-col gap-2"
              >
                <Icon className="size-5 text-[var(--gp-primary)]" />
                <div className="font-medium text-sm">{q.label}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
