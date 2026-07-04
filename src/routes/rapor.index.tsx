import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Save, Sparkles, Download, Trash2 } from "lucide-react";
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
import { ATTITUDE_CHECKLIST, REPORT_PHRASES, REPORT_TEMPLATES } from "@/data/reportCardTemplates";
import { SUBJECTS } from "@/data/subjects";
import { uid } from "@/lib/gp-utils";
import { exportElementToPDF } from "@/lib/exporters";
import { toast } from "sonner";

export const Route = createFileRoute("/rapor/")({
  head: () => ({
    meta: [
      { title: "Rapor Digital — GuruPintar" },
      { name: "description", content: "Susun catatan wali kelas dan rapor visual yang siap cetak." },
    ],
  }),
  component: RaporPage,
});

const ATTITUDE_LEVELS = {
  1: { label: "Mulai", color: "bg-amber-100 text-amber-800" },
  2: { label: "Berkembang", color: "bg-sky-100 text-sky-800" },
  3: { label: "Mahir", color: "bg-emerald-100 text-emerald-800" },
} as const;

function RaporPage() {
  const { state, dispatch } = useApp();
  const level = useLevelTheme();
  const tpl = REPORT_TEMPLATES[level.id];
  const subjects = SUBJECTS[level.id];

  const [studentName, setStudentName] = useState("");
  const [nis, setNis] = useState("");
  const [className, setClassName] = useState(level.grades[0]);
  const [semester, setSemester] = useState("Ganjil 2025/2026");
  const [attitudes, setAttitudes] = useState<Record<string, 1 | 2 | 3>>(
    Object.fromEntries(ATTITUDE_CHECKLIST.map((a) => [a.id, 2])) as Record<string, 1 | 2 | 3>,
  );
  const [grades, setGrades] = useState(subjects.slice(0, 5).map((s) => ({ subject: s.name, score: 80 })));
  const [note, setNote] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  function suggestPhrase() {
    const phrases = REPORT_PHRASES[level.id];
    const positives = phrases.filter((p) => p.tone === "positif");
    const random = positives[Math.floor(Math.random() * positives.length)];
    const name = studentName.trim() || (level.id === "sd" ? "Ananda" : "Peserta didik");
    const adjusted = random.text.replace(/Ananda|Peserta didik/g, name);
    setNote((prev) => (prev ? prev + " " : "") + adjusted);
  }

  function save() {
    if (!studentName.trim()) { toast.error("Nama siswa wajib diisi."); return; }
    dispatch({
      type: "ADD_REPORT",
      report: {
        id: uid("rap"),
        level: level.id,
        studentName: studentName.trim(),
        nis: nis.trim(),
        className,
        semester,
        attitudes,
        grades,
        note,
        teacher: state.profile.name,
        createdAt: Date.now(),
      },
    });
    toast.success(UI_LABELS.toast.tersimpan);
  }

  const saved = state.reports.filter((r) => r.level === level.id);

  return (
    <div>
      <PageHeader
        title={UI_LABELS.rapor.judul}
        description={UI_LABELS.rapor.deskripsi}
        action={
          <>
            <Button variant="outline" onClick={() => ref.current && exportElementToPDF(ref.current, `Rapor-${studentName || "siswa"}.pdf`)}>
              <Download className="size-4" />{UI_LABELS.common.unduhPdf}
            </Button>
            <Button onClick={save}><Save className="size-4" />{UI_LABELS.common.simpan}</Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Form */}
        <Card className="rounded-[var(--gp-radius)]">
          <CardContent className="p-5 space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>{UI_LABELS.rapor.namaSiswa}</Label><Input value={studentName} onChange={(e) => setStudentName(e.target.value)} /></div>
              <div className="space-y-2"><Label>{UI_LABELS.rapor.nis}</Label><Input value={nis} onChange={(e) => setNis(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>Kelas</Label>
                <Select value={className} onValueChange={setClassName}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{level.grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>{UI_LABELS.rapor.semester}</Label><Input value={semester} onChange={(e) => setSemester(e.target.value)} /></div>
            </div>

            <div>
              <Label className="mb-2 block">{UI_LABELS.rapor.sikap}</Label>
              <div className="space-y-2">
                {ATTITUDE_CHECKLIST.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-2 p-2 rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-medium">{a.label}</div>
                      <div className="text-xs text-muted-foreground">{a.description}</div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((n) => (
                        <button
                          key={n}
                          data-touch
                          onClick={() => setAttitudes({ ...attitudes, [a.id]: n as 1 | 2 | 3 })}
                          className={`px-2 py-1.5 text-xs rounded-md border min-h-[44px] ${
                            attitudes[a.id] === n ? "border-[var(--gp-primary)] bg-[var(--gp-primary)] text-[var(--gp-primary-foreground)]" : "border-border"
                          }`}
                        >
                          {ATTITUDE_LEVELS[n as 1 | 2 | 3].label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">{UI_LABELS.rapor.nilaiAkademik}</Label>
              <div className="space-y-2">
                {grades.map((g, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={g.subject} onChange={(e) => { const n = [...grades]; n[i] = { ...g, subject: e.target.value }; setGrades(n); }} />
                    <Input type="number" className="w-24" value={g.score} onChange={(e) => { const n = [...grades]; n[i] = { ...g, score: Number(e.target.value) || 0 }; setGrades(n); }} />
                    <Button variant="ghost" size="icon" onClick={() => setGrades(grades.filter((_, idx) => idx !== i))}><Trash2 className="size-4" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setGrades([...grades, { subject: "", score: 80 }])}>+ Mata pelajaran</Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{UI_LABELS.rapor.catatan}</Label>
                <Button variant="ghost" size="sm" onClick={suggestPhrase}><Sparkles className="size-3.5" />{UI_LABELS.rapor.sarankan}</Button>
              </div>
              <Textarea rows={5} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tulis catatan personal untuk siswa..." />
            </div>
          </CardContent>
        </Card>

        {/* Preview Rapor (clipboard look) */}
        <Card className="rounded-[var(--gp-radius)]">
          <CardContent className="p-3">
            <div ref={ref} className="bg-white text-slate-900 p-6 rounded-md border-l-8 border-[var(--gp-primary)] shadow-inner">
              <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-slate-300">
                <div className="text-xs uppercase tracking-widest text-slate-500">{tpl.heading}</div>
                <div className="text-2xl font-bold mt-1">{studentName || "—"}</div>
                <div className="text-xs text-slate-500 mt-1">NIS: {nis || "—"} · {className} · {semester}</div>
              </div>

              <h4 className="font-semibold text-sm mb-2">{UI_LABELS.rapor.nilaiAkademik}</h4>
              <table className="w-full text-xs mb-4">
                <tbody>
                  {grades.filter((g) => g.subject).map((g, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-1">{g.subject}</td>
                      <td className="py-1 text-right font-mono">{g.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4 className="font-semibold text-sm mb-2">{UI_LABELS.rapor.sikap}</h4>
              <ul className="text-xs space-y-1 mb-4">
                {ATTITUDE_CHECKLIST.map((a) => (
                  <li key={a.id} className="flex justify-between gap-2">
                    <span>☐ {a.label}</span>
                    <span className={`px-1.5 rounded ${ATTITUDE_LEVELS[attitudes[a.id]].color}`}>
                      {ATTITUDE_LEVELS[attitudes[a.id]].label}
                    </span>
                  </li>
                ))}
              </ul>

              <h4 className="font-semibold text-sm mb-2">{UI_LABELS.rapor.catatan}</h4>
              <p className="text-xs leading-relaxed italic text-slate-700 min-h-[60px]">
                {note || "—"}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-600 flex justify-between">
                <div>
                  <div>{UI_LABELS.rapor.tandaTangan}</div>
                  <div className="mt-8 border-t border-slate-400 inline-block min-w-[120px] text-center pt-1">{state.profile.name}</div>
                </div>
                <div className="text-right">
                  <div>GuruPintar</div>
                  <div className="opacity-60">Dokumen elektronik</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {saved.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Rapor tersimpan</h2>
          <div className="grid md:grid-cols-3 gap-2">
            {saved.map((r) => (
              <div key={r.id} className="p-3 rounded-[var(--gp-radius)] border border-border bg-background flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{r.studentName}</div>
                  <div className="text-xs text-muted-foreground">{r.className} · {r.semester}</div>
                </div>
                <button onClick={() => { dispatch({ type: "DELETE_REPORT", id: r.id }); toast.success(UI_LABELS.toast.terhapus); }} className="text-muted-foreground hover:text-destructive p-2">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
