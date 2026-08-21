import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/pagamento")({
  head: () => ({
    meta: [
      { title: "Escolha como pagar" },
      { name: "description", content: "Selecione o método de pagamento." },
      { property: "og:title", content: "Escolha como pagar" },
      { property: "og:description", content: "Selecione o método de pagamento." },
    ],
  }),
  component: PagamentoPage,
});

function useCheckoutPrice(): string {
  const [price, setPrice] = useState("61,93");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("checkout_product");
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.price) setPrice(String(p.price));
      }
    } catch {}
  }, []);
  return price;
}


function PixIcon() {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#d5f5e3] shrink-0">
      <img src="https://i.imgur.com/nNfU78q.png" alt="Pix" className="max-w-[24px] max-h-[24px]" />
    </span>
  );
}

function PagamentoPage() {
  const price = useCheckoutPrice();
  return (
    <div className="min-h-screen bg-[#ededed] flex flex-col" style={{ fontFamily: "'Proxima Nova', -apple-system, Roboto, Arial, sans-serif" }}>
      <div className="flex-1 py-4 sm:py-6 pb-24">
        <div className="mx-auto w-full max-w-[720px] px-3 sm:px-4">
          <section className="bg-white rounded-lg p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Link to="/entrega" className="text-gray-800" aria-label="Voltar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </Link>
              <h1 className="text-[18px] sm:text-[20px] font-semibold text-gray-900">Escolha como pagar</h1>
            </div>

            <h2 className="text-[14px] font-semibold text-gray-800 mb-3">Recomendados</h2>

            <Link to="/revisao" className="flex items-center gap-3 sm:gap-4 rounded-md border border-gray-200 px-3 sm:px-4 py-3 sm:py-4 hover:bg-gray-50">
              <PixIcon />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-gray-900">Pix</div>
                <div className="text-[13px] text-gray-600">Aprovação imediata</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </section>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 sm:static">
        <div className="mx-auto w-full max-w-[720px] px-4 py-4 sm:py-5 flex items-center justify-between">
          <span className="text-[15px] sm:text-[16px] font-semibold text-gray-900">Você pagará</span>
          <span className="text-[17px] sm:text-[18px] font-bold text-gray-900">R$ {price}</span>
        </div>
      </footer>
      <SiteFooter />
    </div>
  );
}

