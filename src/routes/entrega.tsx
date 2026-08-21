import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/entrega")({
  head: () => ({
    meta: [
      { title: "Escolha a forma de entrega" },
      { name: "description", content: "Selecione a forma de entrega." },
      { property: "og:title", content: "Escolha a forma de entrega" },
      { property: "og:description", content: "Selecione a forma de entrega." },
    ],
  }),
  component: EntregaPage,
});

function EntregaPage() {
  const [endereco, setEndereco] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("checkout_customer");
      if (!raw) return;
      const c = JSON.parse(raw) as { rua?: string; numero?: string };
      const text = [c.rua, c.numero].filter(Boolean).join(", ");
      if (text) setEndereco(text);
    } catch {}
  }, []);
  return (
    <div className="min-h-screen bg-[#ededed] py-4 sm:py-6" style={{ fontFamily: "'Proxima Nova', -apple-system, Roboto, Arial, sans-serif" }}>
      <div className="mx-auto w-full max-w-[720px] px-3 sm:px-4">
        <section className="bg-[#f5f5f5] rounded-lg p-4 sm:p-6 border border-gray-200">
          <h1 className="text-[20px] font-semibold text-gray-900 mb-3">Escolha a forma de entrega</h1>
          <div className="flex items-center gap-2 text-[14px] text-gray-600 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {endereco ? `Envio para ${endereco}` : "Envio para o endereço informado"}
          </div>

          <div className="bg-white rounded-md">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <span className="text-[15px] font-semibold text-gray-900">Envio</span>
              <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#00a650] italic">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                FULL
              </span>
            </div>
            <label className="flex items-center gap-3 px-4 py-4 cursor-pointer">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#3483fa]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#3483fa]" />
              </span>
              <span className="flex-1 text-[15px] text-gray-800">Chegará até quinta-feira, 30 de Julho</span>
              <span className="text-[15px] font-semibold text-[#00a650]">Grátis</span>
            </label>
          </div>

          <Link to="/pagamento" className="block w-full rounded-md bg-[#3483fa] hover:bg-[#2968c8] text-white text-center py-4 text-[15px] font-semibold mt-6 transition-colors">
            Ir para pagamento
          </Link>
        </section>

        <p className="text-center text-[13px] text-gray-500 mt-6">
          Termos e condições Como cuidamos da sua privacidade Acessibilidade Informações sobre seguros Blog Afiliados Tendências
          <br />
          <span className="text-[12px]">Mercado Livre LTDA 03.007.331/0001-41</span>
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}
