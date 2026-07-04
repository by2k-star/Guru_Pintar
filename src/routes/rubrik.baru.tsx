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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UI_LABELS } from "@/data/uiLabels";
import { RUBRIC_TEMPLATES, RUBRIC_TYPE_LABEL, type RubricTaskType } from "@/data/rubricTemplates";
import { uid } from "@/lib/gp-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/rubrik/baru")({
  head: () => ({ meta: [{ title: "Rubrik Baru — GuruPintar" }] }),
  component: NewRubric,
});

type Criterion = {
  id: string;
  name: string;
  icon: string;
  weight: number;
  descriptors: Record<1 | 2 | 3 | 4 | 5, string>;
};

const blankCriterion = (): Criterion => ({
  id: uid("crit"),
  name: "",
  icon: "⭐",
  weight: 25,
  descriptors: { 1: "", 2: "", 3: "", 4: "", 5: "" },
});

function NewRubric() {
  const { dispatch } = useApp();
  const level = useLevelTheme();
  const navigate = useNavigate();

  const availableTemplates = RUBRIC_TEMPLATES.filter((t) => t.level === level.id);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<RubricTaskType>("proyek");
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState<Criterion[]>([blankCriterion()]);

  function loadTemplate(id: string) {
    const t = RUBRIC_TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    setTitle(t.title);
    setType(t.type);
    setDescription(t.description);
    setCriteria(t.criteria.map((c) => ({ ...c, id: uid("crit") })));
  }

  function save() {
    if (!title.trim()) {
      toast.error("Nama rubrik wajib diisi.");
      return;
    }
    const id = uid("rub");
    dispatch({
      type: "ADD_RUBRIC",
      rubric: {
        id,
        level: level.id,
        type,
        title: title.trim(),
        description: description.trim(),
        criteria,
        createdAt: Date.now(),
      },
    });
    toast.success(UI_LABELS.toast.tersimpan);
    navigate({ to: "/rubrik" });
  }

  return (
    <div>
      <PageHeader
        title="Rubrik Baru"
        description={UI_LABELS.rubrik.deskripsi}
        action={<Button onClick={save}><Save className="size-4" />{UI_LABELS.common.simpan}</Button>}
      />

      <Card className="rounded-[var(--gp-radius)] mb-4">
        <CardContent className="p-5 space-y-4">
          {availableTemplates.length > 0 && (
            <div className="space-y-2">
              <Label>{UI_LABELS.rubrik.pilihTemplate}</Label>
              <div className="flex flex-wrap gap-2">
                {availableTemplates.map((t) => (
                  <Button key={t.id} variant="outline" size="sm" onClick={() => loadTemplate(t.id)}>
                    {t.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{UI_LABELS.rubrik.formNama}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{UI_LABELS.rubrik.formJenis}</Label>
              <Select value={type} onValueChange={(v) => setType(v as RubricTaskType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(RUBRIC_TYPE_LABEL) as RubricTaskType[]).map((k) => (
                    <SelectItem key={k} value={k}>{RUBRIC_TYPE_LABEL[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {criteria.map((c, idx) => (
          <Card key={c.id} className="rounded-[var(--gp-radius)]">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-end gap-2">
                <div className="w-16 space-y-1">
                  <Label className="text-xs">Ikon</Label>
                  <Input
                    value={c.icon}
                    onChange={(e) => {
                      const next = [...criteria]; next[idx] = { ...c, icon: e.target.value }; setCriteria(next);
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">{UI_LABELS.rubrik.kriteria}</Label>
                  <Input
                    value={c.name}
                    onChange={(e) => {
                      const next = [...criteria]; next[idx] = { ...c, name: e.target.value }; setCriteria(next);
                    }}
                  />
                </div>
                <div className="w-24 space-y-1">
                  <Label className="text-xs">{UI_LABELS.rubrik.bobot}</Label>
                  <Input
                    type="number"
                    value={c.weight}
                    onChange={(e) => {
                      const next = [...criteria]; next[idx] = { ...c, weight: Number(e.target.value) || 0 }; setCriteria(next);
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCriteria(criteria.filter((_, i) => i !== idx))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="space-y-1">
                    <Label className="text-xs">{UI_LABELS.rubrik.skor} {n}</Label>
                    <Textarea
                      rows={3}
                      value={c.descriptors[n as 1 | 2 | 3 | 4 | 5]}
                      onChange={(e) => {
                        const next = [...criteria];
                        next[idx] = { ...c, descriptors: { ...c.descriptors, [n]: e.target.value } };
                        setCriteria(next);
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        <Button variant="outline" onClick={() => setCriteria([...criteria, blankCriterion()])}>
          <Plus className="size-4" /> {UI_LABELS.rubrik.tambahKriteria}
        </Button>
      </div>
    </div>
  );
}
