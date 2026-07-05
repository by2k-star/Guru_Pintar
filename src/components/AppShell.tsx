/**
 * AppShell — kerangka aplikasi.
 * Desktop: sidebar kiri. Mobile: bottom navigation.
 * Memasang AppProvider, sonner Toaster, dan men-set tema per jenjang.
 */
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  BookOpen,
  ClipboardList,
  Presentation,
  GraduationCap,
  FileQuestion,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Toaster } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { AppProvider } from "@/context/AppContext";
import { useLevelTheme } from "@/hooks/useLevelTheme";
import { UI_LABELS } from "@/data/uiLabels";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: UI_LABELS.nav.dashboard, icon: Home },
  { to: "/modul", label: UI_LABELS.nav.modul, icon: BookOpen },
  { to: "/rubrik", label: UI_LABELS.nav.rubrik, icon: ClipboardList },
  { to: "/presentasi", label: UI_LABELS.nav.presentasi, icon: Presentation },
  { to: "/rapor", label: UI_LABELS.nav.rapor, icon: GraduationCap },
  { to: "/bank-soal", label: UI_LABELS.nav.bankSoal, icon: FileQuestion },
  { to: "/pengaturan", label: UI_LABELS.nav.pengaturan, icon: Settings },
] as const;

function ShellInner() {
  const level = useLevelTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--gp-surface)] text-foreground">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r border-border bg-background/60 backdrop-blur sticky top-0 h-screen p-4 gap-2">
        <div className="flex items-center gap-2 px-2 py-3">
          <div
            className="size-10 rounded-[var(--gp-radius)] grid place-items-center font-bold text-[var(--gp-primary-foreground)]"
            style={{ background: "var(--gp-primary)" }}
          >
            G
          </div>
          <div>
            <div className="font-semibold leading-tight">{UI_LABELS.app.name}</div>
            <div className="text-xs text-muted-foreground">{level.label} · {level.tagline}</div>
          </div>
        </div>
        <nav className="mt-2 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[var(--gp-radius)] text-sm transition-colors",
                  active
                    ? "bg-[var(--gp-primary)] text-[var(--gp-primary-foreground)]"
                    : "text-foreground/80 hover:bg-accent",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto text-[11px] text-muted-foreground px-3">
          v1.0 · Dibuat untuk guru Indonesia ❤️
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur border-b border-border">
          <div
            className="size-9 rounded-[var(--gp-radius)] grid place-items-center font-bold text-[var(--gp-primary-foreground)]"
            style={{ background: "var(--gp-primary)" }}
          >
            G
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold leading-tight">{UI_LABELS.app.name}</div>
            <div className="text-[11px] text-muted-foreground truncate">{level.tagline}</div>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md hover:bg-accent"
          >
            <Menu className="size-5" />
          </button>
        </header>
        
        {mobileOpen && (
  <div
    className="fixed inset-0 z-40"
    onClick={() => setMobileOpen(false)}
  >
    <div className="absolute inset-0 bg-black/40" />

    <div
      className="absolute top-0 left-0 h-full w-72 bg-background shadow-xl border-r p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-lg">
          {UI_LABELS.app.name}
        </div>

        <button onClick={() => setMobileOpen(false)}>
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-2">

        {NAV_ITEMS.map((item) => {

          const Icon = item.icon;

          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname.startsWith(item.to);

          return (

            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3",
                active
                  ? "bg-[var(--gp-primary)] text-white"
                  : "hover:bg-accent"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>

          );

        })}

      </nav>
    </div>
  </div>
)}


        <main className="flex-1 px-4 md:px-8 lg:px-10 py-6 pb-24 md:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="max-w-6xl mx-auto w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom nav mobile */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border no-print">
          <ul className="grid grid-cols-6 gap-0.5 px-1 py-1">
            {NAV_ITEMS.slice(0, 6).map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg text-[10px]",
                      active ? "text-[var(--gp-primary)]" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                    <span className="leading-none">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}

export function AppShell() {
  return (
    <AppProvider>
      <ShellInner />
    </AppProvider>
  );
}
