import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Presentation as PresentationIcon, Trash2, Play, Download } from "lucide-react";
import { useApp, type PresentationDoc, type PresentationSlide } from "@/context/AppContext";
import { useLevelTheme } from "@/hooks/useLevelTheme";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UI_LABELS } from "@/data/uiLabels";
import { SUBJECTS } from "@/data/subjects";
import { SLIDE_STRUCTURE, PRESENTATION_SEEDS } from "@/data/presentationTemplates";
import { uid } from "@/lib/gp-utils";
import { exportElementToPDF } from "@/lib/exporters";
import { toast } from "sonner";

export const Route = createFileRoute("/presentasi/")({
  head: () => ({
    meta: [
      { title: "Presentasi — GuruPintar" },
      { name: "description", content: "Buat presentasi 10 slide otomatis lengkap dengan mode slideshow." },
    ],
  }),
  component: PresentasiList,
});

function makeSlides(subjectId: string): PresentationSlide[] {
  const seed = PRESENTATION_SEEDS.find((s) => s.subjectId === subjectId);
  return SLIDE_STRUCTURE.map((s) => ({
    kind: s.kind,
    title: s.title,
    bullets: seed?.bullets[s.kind] ?? s.hints,
  }));
}

function SlideShow({ doc, onClose }: { doc: PresentationDoc; onClose: () => void }) {
  const [i, setI] = useState(0);
  const slide = doc.slides[i];
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col">
      <div className="flex items-center justify-between p-3 text-xs text-slate-300 no-print">
        <span>{doc.topic} · Slide {i + 1}/{doc.slides.length}</span>
        <button onClick={onClose} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">{UI_LABELS.common.kembali}</button>
      </div>
      <div
        className="flex-1 grid place-items-center p-8 select-none cursor-pointer"
        onClick={() => setI((p) => Math.min(p + 1, doc.slides.length - 1))}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === " ") setI((p) => Math.min(p + 1, doc.slides.length - 1));
          if (e.key === "ArrowLeft") setI((p) => Math.max(p - 1, 0));
          if (e.key === "Escape") onClose();
        }}
        tabIndex={0}
        autoFocus
      >
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full"
        >
          <div className="text-xs uppercase tracking-widest text-amber-300 mb-3">{slide.kind}</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{slide.title}</h2>
          <ul className="space-y-3 text-lg md:text-2xl text-slate-100">
            {slide.bullets.map((b, k) => <li key={k} className="flex gap-3"><span className="text-amber-300">•</span><span>{b}</span></li>)}
          </ul>
        </motion.div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-3">{UI_LABELS.presentasi.keluar} · ← → untuk navigasi</div>
    </div>
  );
}

function PresentasiList() {
  const { state, dispatch } = useApp();
  const level = useLevelTheme();
  const subjects = SUBJECTS[level.id];
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [topic, setTopic] = useState("");
  const [playing, setPlaying] = useState<PresentationDoc | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const list = state.presentations.filter((p) => p.level === level.id);

  function create() {
    if (!topic.trim()) {
      toast.error("Topik wajib diisi.");
      return;
    }
    const doc: PresentationDoc = {
      id: uid("ppt"),
      level: level.id,
      subjectId,
      topic: topic.trim(),
      teacher: state.profile.name,
      slides: makeSlides(subjectId),
      createdAt: Date.now(),
    };
    dispatch({ type: "ADD_PRESENTATION", presentation: doc });
    setTopic("");
    toast.success(UI_LABELS.toast.tersimpan);
  }

  async function exportPptx(doc: PresentationDoc) {
    const { default: PptxGenJS } = await import("pptxgenjs");
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";
    doc.slides.forEach((s) => {
      const slide = pptx.addSlide();
      slide.background = { color: "FFFFFF" };
      slide.addText(s.title, { x: 0.5, y: 0.4, w: 12, h: 1, fontSize: 32, bold: true, color: "1E3A8A" });
      slide.addText(
        s.bullets.map((b) => ({ text: b, options: { bullet: true } })),
        { x: 0.7, y: 1.6, w: 11.5, h: 5, fontSize: 20, color: "111827" },
      );
      slide.addText(`${doc.topic} · ${doc.teacher}`, { x: 0.5, y: 6.8, w: 12, h: 0.3, fontSize: 10, color: "6B7280" });
    });
    await pptx.writeFile({ fileName: `${doc.topic}.pptx` });
    toast.success("PPTX berhasil diunduh.");
  }

  return (
    <div>
      <PageHeader title={UI_LABELS.presentasi.judul} description={UI_LABELS.presentasi.deskripsi} />

      <Card className="rounded-[var(--gp-radius)] mb-4">
        <CardContent className="p-5 grid md:grid-cols-[1fr_2fr_auto] gap-3 items-end">
          <div className="space-y-2">
            <Label>{UI_LABELS.presentasi.pilihMapel}</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{UI_LABELS.presentasi.pilihTopik}</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Contoh: Fotosintesis" />
          </div>
          <Button onClick={create}><Plus className="size-4" />Generate 10 slide</Button>
        </CardContent>
      </Card>

      {list.length === 0 ? (
        <EmptyState
          icon={<PresentationIcon className="size-6" />}
          title="Belum ada presentasi."
          description="Pilih mapel & topik di atas untuk generate template 10 slide."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {list.map((p) => (
            <Card key={p.id} className="rounded-[var(--gp-radius)]">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-semibold">{p.topic}</div>
                    <div className="text-xs text-muted-foreground">
                      {SUBJECTS[p.level].find((s) => s.id === p.subjectId)?.name} · {p.slides.length} slide
                    </div>
                  </div>
                  <button
                    onClick={() => { dispatch({ type: "DELETE_PRESENTATION", id: p.id }); toast.success(UI_LABELS.toast.terhapus); }}
                    className="text-muted-foreground hover:text-destructive p-2 rounded-lg"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" onClick={() => setPlaying(p)}><Play className="size-4" />{UI_LABELS.presentasi.putar}</Button>
                  <Button size="sm" variant="outline" onClick={() => exportPptx(p)}><Download className="size-4" />{UI_LABELS.common.unduhPptx}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {playing && <SlideShow doc={playing} onClose={() => setPlaying(null)} />}

      <div ref={exportRef} className="sr-only" />
    </div>
  );
}
