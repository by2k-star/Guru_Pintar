import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, BookOpen, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useLevelTheme } from "@/hooks/useLevelTheme";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UI_LABELS } from "@/data/uiLabels";
import { SUBJECTS } from "@/data/subjects";
import { toast } from "sonner";

export const Route = createFileRoute("/modul/")({
  head: () => ({
    meta: [
      { title: "Modul Ajar — GuruPintar" },
      { name: "description", content: "Kelola modul ajar lengkap dengan tujuan pembelajaran, kegiatan, dan asesmen." },
    ],
  }),
  component: ModulList,
});

function ModulList() {
  const { state, dispatch } = useApp();
  const level = useLevelTheme();
  const subjects = SUBJECTS[level.id];

  const modules = state.modules.filter((m) => m.level === level.id);

  return (
    <div>
      <PageHeader
        title={UI_LABELS.modul.judul}
        description={UI_LABELS.modul.deskripsi}
        action={
          <Button asChild>
            <Link to="/modul/baru">
              <Plus className="size-4" />
              {UI_LABELS.common.buatBaru}
            </Link>
          </Button>
        }
      />

      {modules.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-6" />}
          title="Belum ada modul ajar."
          description="Mulai dari template atau buat dari nol."
          action={
            <Button asChild>
              <Link to="/modul/baru">{UI_LABELS.common.buatBaru}</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {modules.map((m) => {
            const subj = subjects.find((s) => s.id === m.subjectId);
            return (
              <Card key={m.id} className="rounded-[var(--gp-radius)] hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to="/modul/$id" params={{ id: m.id }} className="font-semibold leading-tight hover:underline">
                        {m.title}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <span>{subj?.icon} {subj?.name ?? m.subjectId}</span>
                        <span>·</span>
                        <span>{m.durationMinutes} menit</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{level.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {m.objectives[0]}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <Link to="/modul/$id" params={{ id: m.id }} className="text-sm text-[var(--gp-primary)] font-medium">
                      Lihat detail →
                    </Link>
                    <button
                      data-touch
                      onClick={() => {
                        dispatch({ type: "DELETE_MODULE", id: m.id });
                        toast.success(UI_LABELS.toast.terhapus);
                      }}
                      className="text-muted-foreground hover:text-destructive p-2 -mr-2 rounded-lg"
                      aria-label={UI_LABELS.common.hapus}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
