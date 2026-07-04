import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useLevelTheme } from "@/hooks/useLevelTheme";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UI_LABELS } from "@/data/uiLabels";
import { SUBJECTS } from "@/data/subjects";
import { uid } from "@/lib/gp-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/modul/baru")({
  head: () => ({ meta: [{ title: "Modul Baru — GuruPintar" }] }),
  component: NewModule,
});

function ListEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={v}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              aria-label={UI_LABELS.common.hapus}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ""])}>
        <Plus className="size-4" /> {UI_LABELS.modul.tambahPoin}
      </Button>
    </div>
  );
}

function NewModule() {
  const { dispatch } = useApp();
  const level = useLevelTheme();
  const navigate = useNavigate();
  const subjects = SUBJECTS[level.id];

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [grade, setGrade] = useState(level.grades[0]);
  const [duration, setDuration] = useState(70);
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [coreMaterial, setCoreMaterial] = useState<string[]>([""]);
  const [cocurricular, setCocurricular] = useState<string[]>([""]);
  const [formative, setFormative] = useState<string[]>([""]);
  const [summative, setSummative] = useState<string[]>([""]);

  function save() {
    if (!title.trim()) {
      toast.error("Judul modul wajib diisi.");
      return;
    }
    const now = Date.now();
    const id = uid("mod");
    dispatch({
      type: "ADD_MODULE",
      module: {
        id,
        level: level.id,
        subjectId,
        title: title.trim(),
        durationMinutes: duration,
        objectives: objectives.map((s) => s.trim()).filter(Boolean),
        coreMaterial: coreMaterial.map((s) => s.trim()).filter(Boolean),
        cocurricular: cocurricular.map((s) => s.trim()).filter(Boolean),
        formativeAssessment: formative.map((s) => s.trim()).filter(Boolean),
        summativeAssessment: summative.map((s) => s.trim()).filter(Boolean),
        createdAt: now,
        updatedAt: now,
      },
    });
    toast.success(UI_LABELS.toast.tersimpan);
    navigate({ to: "/modul/$id", params: { id } });
  }

  return (
    <div>
      <PageHeader
        title="Modul Ajar Baru"
        description={`Jenjang ${level.label} · ${grade}`}
        action={
          <Button onClick={save}>
            <Save className="size-4" /> {UI_LABELS.common.simpan}
          </Button>
        }
      />

      <Card className="rounded-[var(--gp-radius)]">
        <CardContent className="p-5 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{UI_LABELS.modul.formJudul}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Siklus Air" />
            </div>
            <div className="space-y-2">
              <Label>{UI_LABELS.modul.formMapel}</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{UI_LABELS.modul.formKelas}</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {level.grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{UI_LABELS.modul.formAlokasi}</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <ListEditor label={UI_LABELS.modul.formTujuan} values={objectives} onChange={setObjectives} placeholder="Peserta didik mampu..." />
          <ListEditor label={UI_LABELS.modul.formMateri} values={coreMaterial} onChange={setCoreMaterial} placeholder="Konsep / sub-topik" />
          <ListEditor label={UI_LABELS.modul.formKegiatan} values={cocurricular} onChange={setCocurricular} placeholder="Aktivitas nyata di kehidupan sehari-hari" />
          <div className="grid md:grid-cols-2 gap-4">
            <ListEditor label={UI_LABELS.modul.formAsesmenFormatif} values={formative} onChange={setFormative} placeholder="Tanya jawab, LKPD,..." />
            <ListEditor label={UI_LABELS.modul.formAsesmenSumatif} values={summative} onChange={setSummative} placeholder="Tes tulis, proyek,..." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
