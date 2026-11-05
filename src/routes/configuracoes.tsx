import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader, Panel } from "@/components/AppShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/configuracoes")({
  head: () => seo("Configurações", "Dados do seu negócio e preferências do sistema."),
  component: Configuracoes,
});

function Configuracoes() {
  const [prefs, setPrefs] = useState({ lembrete: true, atraso: true, letra: false });
  const save = (e: React.FormEvent) => { e.preventDefault(); toast.success("Configurações salvas com sucesso!"); };
  const toggles = [
    { k: "lembrete", l: "Avisar 1 dia antes da devolução" },
    { k: "atraso", l: "Avisar quando uma locação atrasar" },
    { k: "letra", l: "Usar letras maiores" },
  ] as const;

  return (
    <form onSubmit={save}>
      <PageHeader title="Configurações" subtitle="Ajuste o sistema do seu jeito." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Dados do seu negócio">
          <div className="space-y-5">
            {[
              { l: "Nome do negócio", d: "Locadora Bom Lar", p: "Ex.: Aluguéis da Ana" },
              { l: "Telefone", d: "(11) 3344-5566", p: "Ex.: (11) 99999-0000" },
              { l: "Cidade", d: "São Paulo - SP", p: "Ex.: Campinas - SP" },
            ].map((f) => (
              <div key={f.l} className="space-y-2"><Label className="text-base font-bold">{f.l}</Label><Input className="h-12 text-base" defaultValue={f.d} placeholder={f.p} /></div>
            ))}
          </div>
        </Panel>
        <Panel title="Avisos e preferências">
          <ul className="space-y-3">
            {toggles.map((t) => (
              <li key={t.k} className="flex items-center justify-between gap-4 rounded-xl bg-muted p-4">
                <span className="text-base font-semibold text-foreground">{t.l}</span>
                <Switch checked={prefs[t.k]} onCheckedChange={(v) => setPrefs({ ...prefs, [t.k]: v })} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Button type="submit" size="lg" className="mt-6 h-14 w-full px-8 text-lg sm:w-auto"><Save className="h-5 w-5" /> Salvar configurações</Button>
    </form>
  );
}
