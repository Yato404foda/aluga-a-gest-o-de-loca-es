import { createContext, useContext, useState, type ReactNode } from "react";
import carro from "@/assets/p-carro.jpg";
import ferramenta from "@/assets/p-ferramenta.jpg";
import vestido from "@/assets/p-vestido.jpg";
import salao from "@/assets/p-salao.jpg";

// Data fixa para o protótipo (evita diferenças entre servidor e navegador)
export const TODAY = "2026-11-05";

export type Billing = "diária" | "semanal" | "mensal";
export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  billing: Billing;
  photo?: string | undefined;
  available: boolean;
};
export type Client = { id: string; name: string; phone: string; email?: string | undefined; notes?: string | undefined };
export type RentalStatus = "andamento" | "aguardando" | "finalizada" | "atrasada";
export type Rental = {
  id: string;
  clientId: string;
  productId: string;
  start: string;
  end: string;
  total: number;
  status: RentalStatus;
  paid: boolean;
};
export type Activity = { id: string; text: string; when: string; kind: "produto" | "cliente" | "locacao" | "pagamento" };

export const CATEGORIES = ["Veículos", "Ferramentas e equipamentos", "Roupas e acessórios", "Espaços para eventos", "Imóveis", "Outros"];

export const STATUS_INFO: Record<RentalStatus, { label: string; className: string; dot: string }> = {
  andamento: { label: "Em andamento", className: "bg-info-soft text-info", dot: "bg-info" },
  aguardando: { label: "Aguardando retirada", className: "bg-warning-soft text-warning", dot: "bg-warning" },
  finalizada: { label: "Finalizada", className: "bg-success-soft text-success", dot: "bg-success" },
  atrasada: { label: "Atrasada", className: "bg-danger-soft text-destructive", dot: "bg-destructive" },
};

function seed() {
  const products: Product[] = [
    { id: "p1", name: "Carro Hatch Automático", category: "Veículos", description: "Carro econômico, 5 lugares, ar-condicionado.", price: 180, billing: "diária", photo: carro, available: false },
    { id: "p2", name: "Kit Furadeira + Misturador", category: "Ferramentas e equipamentos", description: "Furadeira sem fio com 2 baterias e misturador de argamassa.", price: 60, billing: "diária", photo: ferramenta, available: true },
    { id: "p3", name: "Vestido de Festa Azul", category: "Roupas e acessórios", description: "Vestido longo, tamanho M, ideal para casamentos.", price: 250, billing: "semanal", photo: vestido, available: false },
    { id: "p4", name: "Salão Jardim — 120 pessoas", category: "Espaços para eventos", description: "Salão com mesas, cadeiras e cozinha de apoio.", price: 2800, billing: "diária", photo: salao, available: true },
    { id: "p5", name: "Apartamento 2 quartos — Centro", category: "Imóveis", description: "Mobiliado, 1 vaga de garagem.", price: 2400, billing: "mensal", available: false },
    { id: "p6", name: "Betoneira 400 litros", category: "Ferramentas e equipamentos", description: "Betoneira elétrica para obras.", price: 350, billing: "semanal", available: true },
  ];
  const clients: Client[] = [
    { id: "c1", name: "Maria Aparecida Souza", phone: "(11) 98765-4321", email: "maria.souza@email.com" },
    { id: "c2", name: "João Carlos Pereira", phone: "(11) 97654-3210", email: "joao.pereira@email.com" },
    { id: "c3", name: "Ana Beatriz Lima", phone: "(21) 99876-5432" },
    { id: "c4", name: "Construtora Bom Lar", phone: "(11) 3344-5566", email: "contato@bomlar.com.br", notes: "Cliente empresa. Paga por boleto." },
    { id: "c5", name: "Roberto Alves", phone: "(31) 98888-1122", email: "roberto.alves@email.com" },
  ];
  const rentals: Rental[] = [
    { id: "r1", clientId: "c1", productId: "p1", start: "2026-11-03", end: "2026-11-08", total: 900, status: "andamento", paid: true },
    { id: "r2", clientId: "c3", productId: "p3", start: "2026-11-01", end: "2026-11-04", total: 250, status: "atrasada", paid: false },
    { id: "r3", clientId: "c4", productId: "p6", start: "2026-11-07", end: "2026-11-14", total: 350, status: "aguardando", paid: false },
    { id: "r4", clientId: "c2", productId: "p4", start: "2026-11-14", end: "2026-11-15", total: 5600, status: "aguardando", paid: false },
    { id: "r5", clientId: "c5", productId: "p5", start: "2026-10-01", end: "2026-11-30", total: 4800, status: "andamento", paid: true },
    { id: "r6", clientId: "c1", productId: "p2", start: "2026-10-20", end: "2026-10-22", total: 120, status: "finalizada", paid: true },
    { id: "r7", clientId: "c4", productId: "p2", start: "2026-10-10", end: "2026-10-15", total: 300, status: "finalizada", paid: true },
    { id: "r8", clientId: "c2", productId: "p1", start: "2026-10-05", end: "2026-10-09", total: 720, status: "finalizada", paid: true },
    { id: "r9", clientId: "c4", productId: "p6", start: "2026-09-12", end: "2026-09-26", total: 700, status: "finalizada", paid: true },
  ];
  const activities: Activity[] = [
    { id: "a1", text: "Maria Aparecida retirou o Carro Hatch Automático", when: "Há 2 dias", kind: "locacao" },
    { id: "a2", text: "Pagamento de R$ 900,00 recebido de Maria Aparecida", when: "Há 2 dias", kind: "pagamento" },
    { id: "a3", text: "Nova locação registrada: Salão Jardim para João Carlos", when: "Ontem", kind: "locacao" },
    { id: "a4", text: "Cliente cadastrado: Roberto Alves", when: "Há 5 dias", kind: "cliente" },
    { id: "a5", text: "Produto cadastrado: Betoneira 400 litros", when: "Há 1 semana", kind: "produto" },
  ];
  return { products, clients, rentals, activities };
}

type Store = ReturnType<typeof seed> & {
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (p: Product) => void;
  addClient: (c: Omit<Client, "id">) => void;
  addRental: (r: Omit<Rental, "id">) => void;
  finishRental: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);
let counter = 100;
const nid = (p: string) => `${p}${++counter}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(seed);
  const log = (text: string, kind: Activity["kind"]) => ({ id: nid("a"), text, when: "Agora mesmo", kind });
  const store: Store = {
    ...data,
    addProduct: (p) =>
      setData((d) => ({ ...d, products: [{ ...p, id: nid("p") }, ...d.products], activities: [log(`Produto cadastrado: ${p.name}`, "produto"), ...d.activities] })),
    updateProduct: (p) =>
      setData((d) => ({ ...d, products: d.products.map((x) => (x.id === p.id ? p : x)), activities: [log(`Produto atualizado: ${p.name}`, "produto"), ...d.activities] })),
    addClient: (c) =>
      setData((d) => ({ ...d, clients: [{ ...c, id: nid("c") }, ...d.clients], activities: [log(`Cliente cadastrado: ${c.name}`, "cliente"), ...d.activities] })),
    addRental: (r) =>
      setData((d) => {
        const prod = d.products.find((p) => p.id === r.productId);
        const cli = d.clients.find((c) => c.id === r.clientId);
        return {
          ...d,
          rentals: [{ ...r, id: nid("r") }, ...d.rentals],
          products: d.products.map((p) => (p.id === r.productId ? { ...p, available: false } : p)),
          activities: [log(`Nova locação: ${prod?.name} para ${cli?.name}`, "locacao"), ...d.activities],
        };
      }),
    finishRental: (id) =>
      setData((d) => {
        const r = d.rentals.find((x) => x.id === id);
        return {
          ...d,
          rentals: d.rentals.map((x) => (x.id === id ? { ...x, status: "finalizada", paid: true } : x)),
          products: d.products.map((p) => (p.id === r?.productId ? { ...p, available: true } : p)),
          activities: [log("Uma locação foi finalizada e o produto voltou a ficar disponível", "locacao"), ...d.activities],
        };
      }),
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore fora do StoreProvider");
  return s;
}

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
export const daysBetween = (a: string, b: string) =>
  Math.max(1, Math.round((Date.parse(b) - Date.parse(a)) / 86400000));

export function calcTotal(price: number, billing: Billing, start: string, end: string) {
  const days = daysBetween(start, end);
  const unit = billing === "diária" ? 1 : billing === "semanal" ? 7 : 30;
  return Math.ceil(days / unit) * price;
}
