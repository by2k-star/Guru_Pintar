import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Play, Clock } from "lucide-react";
import { useApp, type QuestionDoc } from "@/context/AppContext";
import { useLevelTheme } from "@/hooks/useLevelTheme";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UI_LABELS } from "@/data/uiLabels";
import { SUBJECTS } from "@/data/subjects";
import { uid } from "@/lib/gp-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/bank-soal/")({
  head: () => ({
    meta: [
      { title: "Bank Soal & Ujian — GuruPintar" },
      { name: "description", content: "Kelola bank soal per CP dan generate ujian acak otomatis." },
    ],
  }),
  component: BankSoalPage,
});

function QuestionForm({ onAdd }: { onAdd: (q: QuestionDoc) => void }) {
  const level = useLevelTheme();
  const subjects = SUBJECTS[level.id];
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [competency, setCompetency] = useState("");
  const [type, setType] = useState<"pg" | "esai">("pg");
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [keyAnswer, setKeyAnswer] = useState("");
  const [weight, setWeight] = useState(10);

  function submit() {
    if (!question.trim()) { toast.error("Pertanyaan wajib diisi."); return; }
    if (type === "pg" && choices.filter((c) => c.trim()).length < 2) { toast.error("Minimal 2 pilihan jawaban."); return; }
    onAdd({
      id: uid("q"),
      level: level.id,
      subjectId,
      competency: competency.trim(),
      type,
      question: question.trim(),
      choices: type === "pg" ? choices.map((c) => c.trim()) : undefined,
      correctIndex: type === "pg" ? correctIndex : undefined,
      keyAnswer: type === "esai" ? keyAnswer.trim() : undefined,
      weight,
      createdAt: Date.now(),
    });
    setQuestion(""); setChoices(["", "", "", ""]); setCorrectIndex(0); setKeyAnswer("");
  }

  return (
    <Card className="rounded-[var(--gp-radius)]">
      <CardContent className="p-4 space-y-3">
        <div className="grid md:grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Mapel</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">CP/KD</Label>
            <Input value={competency} onChange={(e) => setCompetency(e.target.value)} placeholder="3.1" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tipe</Label>
            <Select value={type} onValueChange={(v) => setType(v as "pg" | "esai")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pg">{UI_LABELS.bankSoal.tipePg}</SelectItem>
                <SelectItem value="esai">{UI_LABELS.bankSoal.tipeEsai}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{UI_LABELS.bankSoal.pertanyaan}</Label>
          <Textarea rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} />
        </div>
        {type === "pg" ? (
          <div className="space-y-1">
            <Label className="text-xs">{UI_LABELS.bankSoal.pilihanJawaban}</Label>
            {choices.map((c, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="radio"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                  aria-label={`Pilihan ${String.fromCharCode(65 + i)} sebagai jawaban benar`}
                />
                <span className="text-xs w-5 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                <Input value={c} onChange={(e) => { const n = [...choices]; n[i] = e.target.value; setChoices(n); }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <Label className="text-xs">{UI_LABELS.bankSoal.kunci}</Label>
            <Textarea rows={2} value={keyAnswer} onChange={(e) => setKeyAnswer(e.target.value)} />
          </div>
        )}
        <div className="flex items-end gap-2">
          <div className="space-y-1 w-24">
            <Label className="text-xs">{UI_LABELS.bankSoal.bobotSoal}</Label>
            <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} />
          </div>
          <Button className="ml-auto" onClick={submit}><Plus className="size-4" />{UI_LABELS.bankSoal.tambahSoal}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExamRunner({ questions, duration, onExit }: { questions: QuestionDoc[]; duration: number; onExit: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [remaining, setRemaining] = useState(duration * 60);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setRemaining((r) => (r <= 1 ? (clearInterval(t), 0) : r - 1)), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  useEffect(() => {
    if (remaining === 0 && !submitted) {
      setSubmitted(true);
      toast(UI_LABELS.bankSoal.waktuHabis);
    }
  }, [remaining, submitted]);

  const score = useMemo(() => {
    if (!submitted) return 0;
    let total = 0; let earned = 0;
    questions.forEach((q) => {
      total += q.weight;
      if (q.type === "pg" && q.correctIndex !== undefined) {
        if (answers[q.id] === String(q.correctIndex)) earned += q.weight;
      }
    });
    return total === 0 ? 0 : Math.round((earned / total) * 100);
  }, [submitted, answers, questions]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      <div className="max-w-3xl mx-auto p-6">
        <div className="sticky top-0 bg-background/95 backdrop-blur py-3 flex items-center justify-between border-b border-border mb-4">
          <div className="font-semibold">Mode Ujian</div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 font-mono tabular-nums px-3 py-1.5 rounded ${remaining < 60 ? "bg-destructive/10 text-destructive" : "bg-accent"}`}>
              <Clock className="size-4" />{mm}:{ss}
            </div>
            <Button variant="outline" onClick={onExit}>{UI_LABELS.common.kembali}</Button>
          </div>
        </div>

        {submitted ? (
          <Card className="rounded-[var(--gp-radius)]">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-sm text-muted-foreground">{UI_LABELS.bankSoal.skorAkhir}</div>
              <div className="text-6xl font-bold text-[var(--gp-primary)]">{score}</div>
              <div className="text-xs text-muted-foreground">(Hanya soal PG yang diskor otomatis)</div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <Card key={q.id} className="rounded-[var(--gp-radius)]">
                <CardContent className="p-4 space-y-2">
                  <div className="text-xs text-muted-foreground">Soal {i + 1} · {q.weight} poin</div>
                  <div className="font-medium">{q.question}</div>
                  {q.type === "pg" ? (
                    <div className="space-y-1">
                      {q.choices?.map((c, idx) => (
                        <label key={idx} className="flex items-start gap-2 p-2 rounded border border-border cursor-pointer hover:bg-accent">
                          <input
                            type="radio"
                            name={q.id}
                            checked={answers[q.id] === String(idx)}
                            onChange={() => setAnswers({ ...answers, [q.id]: String(idx) })}
                          />
                          <span><b className="mr-1">{String.fromCharCode(65 + idx)}.</b>{c}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <Textarea rows={4} value={answers[q.id] ?? ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} />
                  )}
                </CardContent>
              </Card>
            ))}
            <Button className="w-full" onClick={() => setSubmitted(true)}>Submit Jawaban</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function BankSoalPage() {
  const { state, dispatch } = useApp();
  const level = useLevelTheme();
  const myQs = state.questions.filter((q) => q.level === level.id);
  const [examCount, setExamCount] = useState(5);
  const [duration, setDuration] = useState(30);
  const [exam, setExam] = useState<QuestionDoc[] | null>(null);

  function generate() {
    if (myQs.length === 0) { toast.error("Tambah soal dulu."); return; }
    const shuffled = [...myQs].sort(() => Math.random() - 0.5).slice(0, Math.min(examCount, myQs.length));
    setExam(shuffled);
  }

  return (
    <div>
      <PageHeader title={UI_LABELS.bankSoal.judul} description={UI_LABELS.bankSoal.deskripsi} />

      <div className="grid lg:grid-cols-2 gap-4">
        <QuestionForm onAdd={(q) => { dispatch({ type: "ADD_QUESTION", question: q }); toast.success(UI_LABELS.toast.tersimpan); }} />

        <Card className="rounded-[var(--gp-radius)]">
          <CardContent className="p-4 space-y-3">
            <div className="font-semibold">{UI_LABELS.bankSoal.generateUjian}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">{UI_LABELS.bankSoal.jumlahSoal}</Label>
                <Input type="number" value={examCount} onChange={(e) => setExamCount(Number(e.target.value) || 0)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{UI_LABELS.bankSoal.durasi}</Label>
                <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value) || 0)} />
              </div>
            </div>
            <Button onClick={generate}><Play className="size-4" />{UI_LABELS.bankSoal.mulaiUjian}</Button>
            <div className="text-xs text-muted-foreground">Tersedia {myQs.length} soal untuk jenjang {level.label}.</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">Daftar Soal</h2>
        {myQs.length === 0 ? (
          <EmptyState title="Belum ada soal." description="Mulai dengan menambahkan soal PG atau esai." />
        ) : (
          <div className="space-y-2">
            {myQs.map((q) => (
              <Card key={q.id} className="rounded-[var(--gp-radius)]">
                <CardContent className="p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex gap-1 mb-1">
                      <Badge variant="secondary">{q.type === "pg" ? "PG" : "Esai"}</Badge>
                      {q.competency && <Badge variant="outline">{q.competency}</Badge>}
                      <Badge variant="outline">{q.weight} poin</Badge>
                    </div>
                    <div className="text-sm">{q.question}</div>
                  </div>
                  <button
                    onClick={() => { dispatch({ type: "DELETE_QUESTION", id: q.id }); toast.success(UI_LABELS.toast.terhapus); }}
                    className="text-muted-foreground hover:text-destructive p-2"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {exam && <ExamRunner questions={exam} duration={duration} onExit={() => setExam(null)} />}
    </div>
  );
}
