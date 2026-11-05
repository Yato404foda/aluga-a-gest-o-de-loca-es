import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Users, KeyRound, CalendarDays, Wallet, BarChart3, Settings, MoreHorizontal, Home,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/", label: "Visão geral", icon: LayoutDashboard },
  { to: "/produtos", label: "Meus produtos", icon: Package },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/locacoes", label: "Locações", icon: KeyRound },
  { to: "/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
        <Home className="h-5 w-5" />
      </span>
      <span className="font-display text-xl font-extrabold text-foreground">
        Aluga <span className="text-primary">Aí</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [more, setMore] = useState(false);
  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
  const mobileMain = NAV.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Menu lateral (computador) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <div className="px-2"><Logo /></div>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                isActive(n.to) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-muted",
              )}
            >
              <n.icon className="h-5 w-5" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
          <p className="font-bold">Precisa de ajuda?</p>
          <p className="mt-1 text-muted-foreground">Comece pela Visão geral. Os botões grandes mostram o que fazer.</p>
        </div>
      </aside>

      {/* Topo (celular) */}
      <header className="sticky top-0 z-20 flex h-16 items-center border-b border-border bg-card px-4 lg:hidden">
        <Logo />
      </header>

      <main className="pb-28 lg:pb-10 lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>

      {/* Barra inferior (celular) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
        {mobileMain.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-xs font-semibold",
              isActive(n.to) ? "text-primary" : "text-muted-foreground",
            )}
          >
            <n.icon className="h-6 w-6" />
            {n.label.replace("Meus ", "")}
          </Link>
        ))}
        <button
          onClick={() => setMore(true)}
          className={cn(
            "flex flex-col items-center gap-1 py-2.5 text-xs font-semibold",
            NAV.slice(4).some((n) => isActive(n.to)) ? "text-primary" : "text-muted-foreground",
          )}
        >
          <MoreHorizontal className="h-6 w-6" />
          Mais
        </button>
      </nav>

      <Sheet open={more} onOpenChange={setMore}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader><SheetTitle className="text-left text-xl">Mais opções</SheetTitle></SheetHeader>
          <div className="grid grid-cols-2 gap-3 p-4 pt-0">
            {NAV.slice(4).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMore(false)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-muted p-5 text-base font-semibold text-foreground"
              >
                <n.icon className="h-7 w-7 text-primary" />
                {n.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6", className)}>
      {title && <h2 className="mb-4 text-xl font-bold text-foreground">{title}</h2>}
      {children}
    </section>
  );
}

export function StatusPill({ className, label }: { className: string; label: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-sm font-bold", className)}>{label}</span>;
}
