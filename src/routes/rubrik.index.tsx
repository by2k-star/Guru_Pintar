import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ClipboardList, Trash2, Download } from "lucide-react";
import { useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLevelTheme } from "@/hooks/useLevelTheme";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UI_LABELS } from "@/data/uiLabels";
import { RUBRIC_TYPE_LABEL } from "@/data/rubricTemplates";
import { exportElementToPDF, exportElementToPNG } from "@/lib/exporters";
import { toast } from "sonner";

export const Route = createFileRoute("/rubrik/")({
  head: () => ({
    meta: [
      { title: "Rubrik Penilaian — GuruPintar" },
      { name: "description", content: "Generator rubrik penilaian visual dengan skala 1–5." },
    ],
  }),
  component: RubrikList,
});

function RubricView({ rubric }: { rubric: ReturnType<typeof useApp>["state"]["rubrics"][number] }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div className="flex justify-end gap-2 mb-2">
        <Button size="sm" variant="outline" onClick={() => ref.current && exportElementToPNG(ref.current, `${rubric.title}.png`)}>
          <Download className="size-4" /> PNG
        </Button>
        <Button size="sm" onClick={() => ref.current && exportElementToPDF(ref.current, `${rubric.title}.pdf`)}>
          <Download className="size-4" /> PDF
        </Button>
      </div>
      <div ref={ref} className="bg-white text-slate-900 p-6 rounded-[var(--gp-radius)] border border-slate-200">
        <h3 className="font-bold text-lg">{rubric.title}</h3>
        <p className="text-xs text-slate-500 mb-4">{rubric.description}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-2 border border-slate-200">Kriteria</th>
                <th className="text-left p-2 border border-slate-200">Bobot</th>
                {[1, 2, 3, 4, 5].map((n) => (
                  <th key={n} className="text-left p-2 border border-slate-200">Skala {n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rubric.criteria.map((c) => (
                <tr key={c.id} className="align-top">
                  <td className="p-2 border border-slate-200 font-medium">
                    <span className="mr-1">{c.icon}</span>{c.name}
                  </td>
                  <td className="p-2 border border-slate-200">{c.weight}%</td>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <td key={n} className="p-2 border border-slate-200 text-slate-700">
                      {c.descriptors[n as 1 | 2 | 3 | 4 | 5]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RubrikList() {
  const { state, dispatch } = useApp();
  const level = useLevelTheme();
  const [openId, setOpenId] = useState<string | null>(null);
  const rubrics = state.rubrics.filter((r) => r.level === level.id);

  return (
    <div>
      <PageHeader
        title={UI_LABELS.rubrik.judul}
        description={UI_LABELS.rubrik.deskripsi}
        action={
          <Button asChild>
            <Link to="/rubrik/baru"><Plus className="size-4" />{UI_LABELS.common.buatBaru}</Link>
          </Button>
        }
      />

      {rubrics.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-6" />}
          title="Belum ada rubrik."
          description="Pilih template atau buat dari nol."
          action={<Button asChild><Link to="/rubrik/baru">{UI_LABELS.common.buatBaru}</Link></Button>}
        />
      ) : (
        <div className="space-y-4">
          {rubrics.map((r) => (
            <Card key={r.id} className="rounded-[var(--gp-radius)]">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.description}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{level.label}</Badge>
                      <Badge variant="outline">{RUBRIC_TYPE_LABEL[r.type as keyof typeof RUBRIC_TYPE_LABEL] ?? r.type}</Badge>
                      <Badge variant="outline">{r.criteria.length} kriteria</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="outline" onClick={() => setOpenId(openId === r.id ? null : r.id)}>
                      {openId === r.id ? "Tutup" : "Pratinjau"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        dispatch({ type: "DELETE_RUBRIC", id: r.id });
                        toast.success(UI_LABELS.toast.terhapus);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                {openId === r.id && <RubricView rubric={r} />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
