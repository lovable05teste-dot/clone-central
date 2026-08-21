import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/endereco")({
  head: () => ({
    meta: [
      { title: "Entrega da sua compra" },
      { name: "description", content: "Informe seu endereço para entrega." },
      { property: "og:title", content: "Entrega da sua compra" },
      { property: "og:description", content: "Informe seu endereço para entrega." },
    ],
  }),
  component: EnderecoPage,
});

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  full = true,
  inputMode,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
  inputMode?: "text" | "tel" | "email" | "numeric" | "decimal";
  autoComplete?: string;
}) {
  return (
    <label className={`relative block ${full ? "w-full" : ""}`}>
      <span className="absolute left-3 top-1.5 text-[11px] text-gray-500">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-gray-300 bg-white pt-5 pb-2 px-3 text-[16px] text-gray-900 outline-none focus:border-blue-500"
      />
    </label>
  );
}

function EnderecoPage() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    phone: "",
    email: "",
    name: "",
    cpf: "",
  });

  useEffect(() => {
    // Capture UTMs/click IDs if user landed directly on checkout
    try {
      const qs = window.location.search.replace(/^\?/, "");
      if (qs) {
        const existing = localStorage.getItem("tracking_utm") || "";
        if (!existing) localStorage.setItem("tracking_utm", qs);
      }
      const saved = localStorage.getItem("checkout_customer");
      if (saved) setForm((f) => ({ ...f, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const cpf = form.cpf.replace(/\D+/g, "");
    const phone = form.phone.replace(/\D+/g, "").replace(/^55(?=\d{10,11}$)/, "");
    if (cpf.length !== 11 && cpf.length !== 14) {
      setErro("Informe um CPF válido com 11 dígitos.");
      return;
    }
    if (phone.length !== 10 && phone.length !== 11) {
      setErro("Informe um telefone válido com DDD (ex: 11987654321).");
      return;
    }
    setErro("");
    try {
      localStorage.setItem("checkout_customer", JSON.stringify({ ...form, cpf, phone }));
    } catch {}
    navigate({ to: "/entrega" });
  };

  return (
    <div className="min-h-screen bg-[#ededed] py-4 sm:py-6" style={{ fontFamily: "'Proxima Nova', -apple-system, Roboto, Arial, sans-serif" }}>
      <div className="mx-auto w-full max-w-[720px] px-3 sm:px-4">
        <h1 className="text-[20px] sm:text-[22px] font-semibold text-gray-900 mb-3 sm:mb-4">Entrega da sua compra</h1>

        <section className="bg-white rounded-lg p-4 sm:p-6 mb-3 sm:mb-4">
          <h2 className="text-[17px] sm:text-[18px] font-semibold text-gray-900 mb-3 sm:mb-4">Endereço</h2>
          <div className="space-y-3">
            <Field label="CEP" name="cep" value={form.cep} onChange={set("cep")} inputMode="numeric" autoComplete="postal-code" />
            <div className="text-right -mt-1">
              <a href="#" className="text-[13px] text-blue-600 underline">Não sei meu CEP</a>
            </div>
            <div className="grid grid-cols-[1fr_110px] sm:grid-cols-[1fr_140px] gap-3">
              <Field label="Rua/Avenida" name="rua" value={form.rua} onChange={set("rua")} autoComplete="address-line1" />
              <Field label="Número" name="numero" value={form.numero} onChange={set("numero")} inputMode="numeric" />
            </div>
            <Field label="Complemento (opcional)" name="complemento" value={form.complemento} onChange={set("complemento")} autoComplete="address-line2" />
            <Field label="Bairro" name="bairro" value={form.bairro} onChange={set("bairro")} />
            <div className="grid grid-cols-[1fr_110px] sm:grid-cols-[1fr_200px] gap-3">
              <Field label="Cidade" name="cidade" value={form.cidade} onChange={set("cidade")} autoComplete="address-level2" />
              <label className="relative block">
                <span className="absolute left-3 top-1.5 text-[11px] text-gray-500">Estado</span>
                <select
                  value={form.estado}
                  onChange={(e) => set("estado")(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-300 bg-white pt-5 pb-2 px-3 text-[16px] text-gray-900 outline-none focus:border-blue-500"
                >
                  <option value="">Selecione</option>
                  {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </label>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg p-4 sm:p-6 mb-3 sm:mb-4">
          <h2 className="text-[17px] sm:text-[18px] font-semibold text-gray-900 mb-3 sm:mb-4">Contato</h2>
          <div className="space-y-3">
            <Field label="Telefone" name="telefone" type="tel" value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" />
            <Field label="Email" name="email" type="email" value={form.email} onChange={set("email")} inputMode="email" autoComplete="email" />
            <Field label="Nome completo" name="nome" value={form.name} onChange={set("name")} autoComplete="name" />
            <Field label="Documento (CPF)" name="cpf" value={form.cpf} onChange={set("cpf")} inputMode="numeric" />
          </div>
        </section>

        {erro && (
          <p className="mb-3 rounded-md bg-red-50 px-4 py-3 text-[14px] text-red-700">{erro}</p>
        )}

        <button
          onClick={submit}
          className="block w-full rounded-md bg-[#3483fa] hover:bg-[#2968c8] text-white text-center py-4 text-[16px] font-semibold transition-colors"
        >
          Continuar
        </button>

        <p className="text-center text-[12px] text-gray-500 mt-4 px-2">
          Termos e condições · Como cuidamos da sua privacidade · Acessibilidade
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}
