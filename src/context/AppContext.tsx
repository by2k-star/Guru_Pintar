/**
 * Context global GuruPintar.
 * - level (SD/SMP/SMA), profil guru, dan semua koleksi (modul, rubrik,
 *   presentasi, rapor, soal) disimpan ke localStorage via usePersistedReducer.
 * - Komponen mengakses state via useApp() & dispatch action ber-typed.
 */
import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { LevelId } from "@/data/schoolLevels";
import { MODULE_TEMPLATES, type ModuleTemplate } from "@/data/moduleTemplates";

export interface TeacherProfile {
  name: string;
  school: string;
}

export interface ModuleDoc extends ModuleTemplate {
  createdAt: number;
  updatedAt: number;
}

export interface RubricDoc {
  id: string;
  level: LevelId;
  type: string;
  title: string;
  description: string;
  criteria: {
    id: string;
    name: string;
    icon: string;
    weight: number;
    descriptors: Record<1 | 2 | 3 | 4 | 5, string>;
  }[];
  createdAt: number;
}

export interface PresentationSlide {
  kind: string;
  title: string;
  bullets: string[];
}

export interface PresentationDoc {
  id: string;
  level: LevelId;
  subjectId: string;
  topic: string;
  teacher: string;
  slides: PresentationSlide[];
  createdAt: number;
}

export interface ReportDoc {
  id: string;
  level: LevelId;
  studentName: string;
  nis: string;
  className: string;
  semester: string;
  attitudes: Record<string, 1 | 2 | 3>; // 1=Mulai 2=Berkembang 3=Mahir
  grades: { subject: string; score: number }[];
  note: string;
  teacher: string;
  createdAt: number;
}

export interface QuestionDoc {
  id: string;
  level: LevelId;
  subjectId: string;
  competency: string; // CP / KD
  type: "pg" | "esai";
  question: string;
  choices?: string[]; // untuk PG
  correctIndex?: number; // untuk PG
  keyAnswer?: string; // untuk esai
  weight: number;
  createdAt: number;
}

interface State {
  level: LevelId;
  profile: TeacherProfile;
  modules: ModuleDoc[];
  rubrics: RubricDoc[];
  presentations: PresentationDoc[];
  reports: ReportDoc[];
  questions: QuestionDoc[];
  /** Modul yang user "promote" menjadi template lokal favorit. */
  promotedTemplates: ModuleDoc[];
}

type Action =
  | { type: "SET_LEVEL"; level: LevelId }
  | { type: "SET_PROFILE"; profile: Partial<TeacherProfile> }
  | { type: "ADD_MODULE"; module: ModuleDoc }
  | { type: "UPDATE_MODULE"; module: ModuleDoc }
  | { type: "DELETE_MODULE"; id: string }
  | { type: "PROMOTE_MODULE"; id: string }
  | { type: "ADD_RUBRIC"; rubric: RubricDoc }
  | { type: "DELETE_RUBRIC"; id: string }
  | { type: "ADD_PRESENTATION"; presentation: PresentationDoc }
  | { type: "UPDATE_PRESENTATION"; presentation: PresentationDoc }
  | { type: "DELETE_PRESENTATION"; id: string }
  | { type: "ADD_REPORT"; report: ReportDoc }
  | { type: "DELETE_REPORT"; id: string }
  | { type: "ADD_QUESTION"; question: QuestionDoc }
  | { type: "DELETE_QUESTION"; id: string }
  | { type: "HYDRATE"; state: State };

const STORAGE_KEY = "gp.state.v1";

const seedModules: ModuleDoc[] = MODULE_TEMPLATES.map((m) => ({
  ...m,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}));

const initialState: State = {
  level: "smp",
  profile: { name: "Bu/Pak Guru", school: "" },
  modules: seedModules,
  rubrics: [],
  presentations: [],
  reports: [],
  questions: [],
  promotedTemplates: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "SET_LEVEL":
      return { ...state, level: action.level };
    case "SET_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case "ADD_MODULE":
      return { ...state, modules: [action.module, ...state.modules] };
    case "UPDATE_MODULE":
      return {
        ...state,
        modules: state.modules.map((m) => (m.id === action.module.id ? action.module : m)),
      };
    case "DELETE_MODULE":
      return { ...state, modules: state.modules.filter((m) => m.id !== action.id) };
    case "PROMOTE_MODULE": {
      const found = state.modules.find((m) => m.id === action.id);
      if (!found) return state;
      return { ...state, promotedTemplates: [found, ...state.promotedTemplates] };
    }
    case "ADD_RUBRIC":
      return { ...state, rubrics: [action.rubric, ...state.rubrics] };
    case "DELETE_RUBRIC":
      return { ...state, rubrics: state.rubrics.filter((r) => r.id !== action.id) };
    case "ADD_PRESENTATION":
      return { ...state, presentations: [action.presentation, ...state.presentations] };
    case "UPDATE_PRESENTATION":
      return {
        ...state,
        presentations: state.presentations.map((p) =>
          p.id === action.presentation.id ? action.presentation : p,
        ),
      };
    case "DELETE_PRESENTATION":
      return { ...state, presentations: state.presentations.filter((p) => p.id !== action.id) };
    case "ADD_REPORT":
      return { ...state, reports: [action.report, ...state.reports] };
    case "DELETE_REPORT":
      return { ...state, reports: state.reports.filter((r) => r.id !== action.id) };
    case "ADD_QUESTION":
      return { ...state, questions: [action.question, ...state.questions] };
    case "DELETE_QUESTION":
      return { ...state, questions: state.questions.filter((q) => q.id !== action.id) };
    default:
      return state;
  }
}

interface Ctx {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate dari localStorage (client only).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        dispatch({ type: "HYDRATE", state: { ...initialState, ...parsed } });
      }
    } catch {
      /* abaikan */
    }
  }, []);

  // Persist setiap perubahan state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* abaikan */
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
