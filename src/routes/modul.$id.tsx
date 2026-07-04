import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowLeft, Download, Star, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { UI_LABELS } from "@/data/uiLabels";
import { SUBJECTS } from "@/data/subjects";
import { SCHOOL_LEVELS } from "@/data/schoolLevels";
import { exportElementToPDF } from "@/lib/exporters";
import { toast } from "sonner";

export const Route = createFileRoute("/modul/$id")({
  head: () => ({ meta: [{ title: "Detail Modul — GuruPintar" }] }),
  component: ModulDetail,
  notFoundComponent: () => <div className="p-6">Modul tidak ditemukan.</div>,
});

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold text-sm uppercase tracking-wide text-[var(--gp-primary)] mb-2">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">—</p>
      ) : (
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      )}
    </div>
  );
}

function ModulDetail() {
  const { id } = Route.useParams();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const m = state.modules.find((x) => x.id === id);
  if (!m) return <div className="p-6">Modul tidak ditemukan. <Link to="/modul" className="underline">Kembali</Link></div>;

  const subj = SUBJECTS[m.level].find((s) => s.id === m.subjectId);
  const lvl = SCHOOL_LEVELS[m.level];

  return (
    <div>
      <PageHeader
        title={m.title}
        description={`${lvl.label} · ${subj?.name ?? m.subjectId} · ${m.durationMinutes} menit`}
        action={
          <>
            <Button variant="outline" asChild>
              <Link to="/modul"><ArrowLeft className="size-4" /> {UI_LABELS.common.kembali}</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                dispatch({ type: "PROMOTE_MODULE", id: m.id });
                toast.success(UI_LABELS.modul.promoteOk);
              }}
            >
              <Star className="size-4" /> {UI_LABELS.modul.promote}
            </Button>
            <Button
              onClick={() => ref.current && exportElementToPDF(ref.current, `${m.title}.pdf`)}
            >
              <Download className="size-4" /> {UI_LABELS.common.unduhPdf}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                dispatch({ type: "DELETE_MODULE", id: m.id });
                toast.success(UI_LABELS.toast.terhapus);
                navigate({ to: "/modul" });
              }}
            >
              <Trash2 className="size-4" /> {UI_LABELS.common.hapus}
            </Button>
          </>
        }
      />

      <Card className="rounded-[var(--gp-radius)] overflow-hidden">
        <CardContent className="p-0">
          <div ref={ref} className="p-6 md:p-10 bg-white text-slate-900 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Badge>{lvl.label}</Badge>
                <Badge variant="outline">{subj?.icon} {subj?.name}</Badge>
                <Badge variant="outline">{m.durationMinutes} menit</Badge>
              </div>
              <h2 className="text-2xl font-bold mt-3">{m.title}</h2>
              <p className="text-xs text-slate-500 mt-1">Modul Ajar · GuruPintar</p>
            </div>

            <Section title={UI_LABELS.modul.formTujuan} items={m.objectives} />
            <Section title={UI_LABELS.modul.formMateri} items={m.coreMaterial} />
            <Section title={UI_LABELS.modul.formKegiatan} items={m.cocurricular} />
            <div className="grid md:grid-cols-2 gap-6">
              <Section title={UI_LABELS.modul.formAsesmenFormatif} items={m.formativeAssessment} />
              <Section title={UI_LABELS.modul.formAsesmenSumatif} items={m.summativeAssessment} />
            </div>

            <div className="pt-6 border-t border-slate-200 text-xs text-slate-500">
              Disusun oleh: {state.profile.name}{state.profile.school ? ` — ${state.profile.school}` : ""}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
