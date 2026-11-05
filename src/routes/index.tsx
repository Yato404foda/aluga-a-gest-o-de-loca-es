import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, CheckCircle2, KeyRound, Clock, CalendarClock, PackagePlus, UserPlus, FilePlus2, Search, Users, Wallet } from "lucide-react";
import { Panel } from "@/components/AppShell";
import { ProductForm, ClientForm, RentalForm } from "@/components/Forms";
import { useStore, TODAY, daysBetween } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Visão geral", "Acompanhe seus produtos, clientes e locações em um só lugar."),
  component: Dashboard,
});

const kindIcon = { produto: Package, cliente: Users, locacao: KeyRound, pagamento: Wallet };

function Dashboard() {
  const { products, rentals, activities } = useStore();
  const [open, setOpen] = useState<"p" | "c" | "r" | null>(null);
  const active = rentals.filter((r) => r.status === "andamento" || r.status === "atrasada");
  const soon = active.filter((r) => r.end >= TODAY && daysBetween(TODAY, r.end) <= 7);

  const stats = [
    { label: "Produtos cadastrados", value: products.length, icon: Package, tone: "bg-accent text-primary" },
    { label: "Disponíveis", value: products.filter((p) => p.available).length, icon: CheckCircle2, tone: "bg-success-soft text-success" },
    { label: "Alugados", value: products.filter((p) => !p.available).length, icon: KeyRound, tone: "bg-info-soft text-info" },
    { label: "Locações em andamento", value: active.length, icon: Clock, tone: "bg-accent text-primary" },
    { label: "Devoluções próximas", value: soon.length, icon: CalendarClock, tone: "bg-warning-soft text-warning" },
  ];

  const actions = [
    { label: "Cadastrar produto", desc: "Adicione um item para alugar", icon: PackagePlus, onClick: () => setOpen("p") },
    { label: "Cadastrar cliente", desc: "Salve os dados de quem aluga", icon: UserPlus, onClick: () => setOpen("c") },
    { label: "Registrar locação", desc: "Anote um novo aluguel", icon: FilePlus2, onClick: () => setOpen("r") },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-soft sm:p-8">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Bom dia! Seja bem-vindo ao Aluga Aí.</h1>
        <p className="mt-2 text-lg opacity-90">Gerencie suas locações de forma simples e organizada.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tone}`}><s.icon className="h-6 w-6" /></span>
            <p className="mt-4 text-3xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-base font-semibold text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">O que você deseja fazer?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((a) => (
            <button key={a.label} onClick={a.onClick} className="group flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-left shadow-soft transition-all hover:border-primary hover:bg-accent">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><a.icon className="h-7 w-7" /></span>
              <span><span className="block text-lg font-bold text-foreground">{a.label}</span><span className="text-sm text-muted-foreground">{a.desc}</span></span>
            </button>
          ))}
          <Link to="/locacoes" className="flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 shadow-soft transition-all hover:border-primary hover:bg-accent">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Search className="h-7 w-7" /></span>
            <span><span className="block text-lg font-bold text-foreground">Consultar locações</span><span className="text-sm text-muted-foreground">Veja todos os aluguéis</span></span>
          </Link>
        </div>
      </section>

      <Panel title="Atividades recentes">
        <ul className="divide-y divide-border">
          {activities.slice(0, 6).map((a) => {
            const Icon = kindIcon[a.kind];
            return (
              <li key={a.id} className="flex items-center gap-4 py-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary"><Icon className="h-5 w-5" /></span>
                <span className="flex-1 text-base text-foreground">{a.text}</span>
                <span className="shrink-0 text-sm text-muted-foreground">{a.when}</span>
              </li>
            );
          })}
        </ul>
      </Panel>

      <ProductForm open={open === "p"} onOpenChange={(o) => setOpen(o ? "p" : null)} />
      <ClientForm open={open === "c"} onOpenChange={(o) => setOpen(o ? "c" : null)} />
      <RentalForm open={open === "r"} onOpenChange={(o) => setOpen(o ? "r" : null)} />
    </div>
  );
}
