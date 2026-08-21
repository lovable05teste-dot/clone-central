// Imagens de variante servidas de /public com caminho absoluto minúsculo:
// funciona em qualquer host (Lovable, Vercel, etc.)
const furadeiraAzul = "/furadeira-azul.webp";
const furadeiraVerde = "/furadeira-verde.webp";

const VARIANT_IMAGE_OVERRIDES: Record<string, Record<string, string>> = {
  "1497000015": { Azul: furadeiraAzul, Verde: furadeiraVerde },
};

import { trackInitiateCheckout, trackInitiateCheckoutFallback } from "@/lib/tracking";
import { withUtms } from "@/lib/utm";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { getProduct, ALL_PRODUCTS, longDescription, genericSpecGroups, type Product } from "../lib/products";
import { SiteFooter } from "@/components/SiteFooter";
import { LazySection } from "@/components/LazySection";
import { REVIEWS_BY_PRODUCT } from "@/lib/reviews";

export const Route = createFileRoute("/produto/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.title} — R$ ${p.newPrice}` : "Produto";
    const desc = p ? `Aproveite ${p.title} por apenas R$ ${p.newPrice} no Pix.` : "Produto";
    const img = p?.carousel?.[0];
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(img
          ? [
              { property: "og:image", content: img },
              { name: "twitter:image", content: img },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p className="text-lg">Produto não encontrado.</p>
      <Link to="/" className="text-[#3483fa] underline">
        Voltar
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-red-600">{String(error)}</div>
  ),
  component: ProductPage,
});

const PLACEHOLDER = "/clone-assets/images/placeholder.svg";

// Algumas imagens hospedadas externamente podem ter sido removidas (404).
// Troca qualquer imagem quebrada por um placeholder para a página não ficar bugada.
function useBrokenImageFallback() {
  useEffect(() => {
    const onError = (e: Event) => {
      const el = e.target as HTMLImageElement | null;
      if (!el || el.tagName !== "IMG") return;
      if (el.dataset.fallbackApplied) return;
      el.dataset.fallbackApplied = "1";
      el.src = PLACEHOLDER;
    };
    document.addEventListener("error", onError, true);
    return () => document.removeEventListener("error", onError, true);
  }, []);
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  useBrokenImageFallback();
  return <ProductView p={product} />;
}

function ProductView({ p }: { p: Product }) {
  const [idx, setIdx] = useState(0);
  const [color, setColor] = useState(p.activeColor ?? p.colors?.[0] ?? "");
  const [volt, setVolt] = useState(p.voltage?.active ?? "");
  const [extra, setExtra] = useState(p.extra?.active ?? "");
  const [showAllChars, setShowAllChars] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const overrides = VARIANT_IMAGE_OVERRIDES[p.id] ?? {};
  const baseVariant = p.colorVariants?.find((v) => v.name === color);
  const variant = baseVariant
    ? { ...baseVariant, image: overrides[color] ?? baseVariant.image ?? baseVariant.swatch }
    : overrides[color]
      ? { name: color, image: overrides[color] }
      : undefined;
  const variantCards = useMemo(() => {
    // Somente produtos com variantes de cor reais (ex.: furadeira) mostram os cards
    if (!p.colorVariants || p.colorVariants.length === 0) return [];
    if (!p.colors || p.colors.length === 0) return [];
    return p.colors.map((name) => {
      const v = p.colorVariants?.find((x) => x.name === name);
      return {
        name,
        image: overrides[name] ?? v?.image ?? v?.swatch ?? p.carousel[0],
        oldPrice: v?.oldPrice ?? p.oldPrice,
        newPrice: v?.newPrice ?? p.newPrice,
      };
    });
  }, [p, overrides]);
  const oldPrice = variant?.oldPrice ?? p.oldPrice;
  const newPrice = variant?.newPrice ?? p.newPrice;
  const carousel = variant?.image ? [variant.image, ...p.carousel] : p.carousel;
  const total = carousel.length;
  useEffect(() => {
    setIdx(0);
  }, [color]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const dx = useRef(0);

  const related = useMemo(
    () => ALL_PRODUCTS.filter((x) => x.id !== p.id).slice(0, 12),
    [p.id]
  );

  const alsoBought = useMemo(
    () => ALL_PRODUCTS.filter((x) => x.id !== p.id).slice().reverse().slice(0, 12),
    [p.id]
  );

  function onStart(x: number) {
    startX.current = x;
    dx.current = 0;
  }
  function onMove(x: number) {
    if (startX.current == null) return;
    dx.current = x - startX.current;
  }
  function onEnd() {
    if (startX.current == null) return;
    const d = dx.current;
    startX.current = null;
    dx.current = 0;
    if (Math.abs(d) > 40) {
      if (d < 0 && idx < total - 1) setIdx(idx + 1);
      if (d > 0 && idx > 0) setIdx(idx - 1);
    }
  }

  async function goCheckout() {
    // 1º: marca o IC na Utmify ANTES de qualquer outro rastreamento/navegação
    try {
      const icOk = await trackInitiateCheckout({
        content_ids: [p.id],
        content_name: p.title,
        value: newPrice,
        currency: "BRL",
      });
      if (!icOk) {
        console.warn("[IC] confirmação principal falhou; enviando fallback somente de IC.");
        trackInitiateCheckoutFallback({
          content_ids: [p.id],
          content_name: p.title,
          value: newPrice,
          currency: "BRL",
        });
      }
    } catch (e) {
      console.error("[IC] falha ao marcar InitiateCheckout:", e);
    }
    try {
      localStorage.setItem(
        "checkout_product",
        JSON.stringify({
          id: p.id,
          title: p.title,
          price: newPrice,
          image: carousel[0],
          color,
          voltage: volt,
        })
      );
    } catch {}
    window.location.href = withUtms("/endereco");
  }

  return (
    <div
      className="min-h-screen bg-white text-[#333]"
      style={{ fontFamily: "'Proxima Nova', -apple-system, Roboto, Arial, sans-serif" }}
    >
      <header className="w-full" style={{ backgroundColor: "#FDD835" }}>
        <div className="mx-auto max-w-[1200px] flex items-center gap-3 px-3 py-2">
          <Link to="/">
            <img
              src="https://i.ibb.co/G3Hqg1y5/ht-M1rqk-1.png"
              alt="Logo"
              width={110}
              height={44}
              fetchPriority="high"
              decoding="async"
              className="h-11 w-auto shrink-0"
            />
          </Link>
          <div className="flex-1 bg-white rounded-full px-4 py-[10px] text-sm text-gray-500 shadow-sm">
            Buscar em todo o site
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            width="30px"
            viewBox="0 -960 960 960"
            fill="#000000E6"
            style={{ margin: "0 10px" }}
            className="shrink-0 cursor-pointer"
            onClick={() => {
              window.location.href = withUtms("/carrinho");
            }}
          >
            <path d="M253.61-132.38q-16.43-16.85-16.43-41.04 0-24.2 16.57-40.9 16.56-16.71 40.78-16.71 24.21 0 40.92 16.85 16.7 16.85 16.7 41.04 0 24.19-16.84 40.9-16.85 16.7-41.06 16.7-24.22 0-40.64-16.84Zm375.38 0q-16.43-16.85-16.43-41.04 0-24.2 16.57-40.9 16.57-16.71 40.78-16.71 24.22 0 40.92 16.85 16.71 16.85 16.71 41.04 0 24.19-16.85 40.9-16.84 16.7-41.06 16.7-24.21 0-40.64-16.84ZM232-746.31l110.97 233.03h267.65q6.92 0 12.56-3.46 5.64-3.47 8.97-9.62l109.49-198.41q4.62-8.46.77-15-3.85-6.54-13.08-6.54H232Zm-17.28-33.84h520.62q26.08 0 39.23 21.34 13.15 21.35 1.23 43.89L663.77-510.53q-8.87 14.32-22.64 22.71-13.77 8.38-29.54 8.38H324l-52.51 96.52q-5.64 9.23-.13 20t17.05 10.77h439.13v33.84H291.33q-34.02 0-49.79-25.93-15.77-25.94-.21-54.58l63.23-113.39-149.33-313.94h-72V-860h93.64l37.85 79.85Zm128.25 266.87h282.26-282.26Z" />
          </svg>

        </div>
      </header>

      <main className="mx-auto max-w-[1200px] bg-white">
        <section className="px-4 md:px-8 py-4 md:py-6">

          <div className="flex items-start justify-between gap-3">
            <span className="text-xs text-gray-500">Novo | +5mil vendidos</span>
            <div className="flex items-center gap-1 text-xs text-gray-600 shrink-0">
              <span>4.8</span>
              <span className="inline-flex items-center gap-[1px] text-[#3483fa]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={12} />
                ))}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span
              className="text-white text-[10px] font-bold px-[6px] py-[2px] rounded-[3px] tracking-wider"
              style={{ backgroundColor: "#f28b3c" }}
            >
              MAIS VENDIDO
            </span>
            <span className="text-xs text-[#3483fa]">1º em {p.category}</span>
          </div>
          <h1 className="mt-2 text-base font-normal text-black/90 leading-snug break-words">
            {p.title}
          </h1>

          {/* Carousel */}
          <div
            className="mt-3 relative select-none"
            style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
          >
            <div className="text-xs text-gray-500 mb-1 px-4 md:px-8">
              {idx + 1} / {total}
            </div>
            <div
              ref={viewportRef}
              className="relative w-full aspect-square bg-white overflow-hidden touch-pan-y"
              onTouchStart={(e) => onStart(e.touches[0].clientX)}
              onTouchMove={(e) => onMove(e.touches[0].clientX)}
              onTouchEnd={onEnd}
              onMouseDown={(e) => onStart(e.clientX)}
              onMouseMove={(e) => startX.current != null && onMove(e.clientX)}
              onMouseUp={onEnd}
              onMouseLeave={onEnd}
            >
              <div
                className="flex h-full w-full transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${idx * 100}%)` }}
              >
                {carousel.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Foto ${i + 1}`}
                    width={900}
                    height={900}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    decoding={i === 0 ? "sync" : "async"}
                    className="w-full h-full object-contain shrink-0"
                    draggable={false}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-[6px] flex-wrap">
              {carousel.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className="h-[6px] rounded-full transition-all"
                  style={{
                    width: i === idx ? 18 : 6,
                    backgroundColor: i === idx ? "#3483fa" : "#d0d0d0",
                  }}
                  aria-label={`Ir para foto ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Colors */}
          {variantCards.length > 0 && (
            <div className="mt-6">
              <p className="text-sm">
                <span className="text-gray-600">Cor: </span>
                <span className="font-semibold">{color}</span>
              </p>
              <div className="mt-3 flex gap-3 flex-wrap">
                {variantCards.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setColor(v.name)}
                      className={`w-[150px] p-2 flex flex-col text-left rounded-lg border bg-white overflow-hidden ${
                        v.name === color ? "border-[#3483fa] border-2" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={v.image}
                        alt={v.name}
                        width={150}
                        height={110}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-[110px] object-contain bg-white"
                      />
                      <div className="min-w-0 mt-2">
                        <p className="text-[15px] leading-tight text-[#333] truncate">{v.name}</p>
                        <p className="mt-1 text-[17px] leading-tight font-semibold text-black/90 whitespace-nowrap">
                          R$ {v.newPrice}
                        </p>
                        <p className="mt-1 text-[13px] leading-tight text-gray-500 truncate">Disponível</p>
                      </div>
                    </button>
                ))}
              </div>
            </div>
          )}


          {/* Voltage */}
          {p.voltage && (
            <div className="mt-4">
              <p className="text-sm">
                <span className="text-gray-600">Voltagem: </span>
                <span className="font-semibold">{volt}</span>
              </p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {p.voltage.options.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVolt(v)}
                    className={`text-sm px-3 py-2 border rounded-sm ${
                      v === volt
                        ? "border-[#3483fa] text-[#3483fa]"
                        : "border-gray-300 text-gray-800"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra option (e.g. base dividida) */}
          {p.extra && (
            <div className="mt-4">
              <p className="text-sm">
                <span className="text-gray-600">{p.extra.label}: </span>
                <span className="font-semibold">{extra}</span>
              </p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {p.extra.options.map((v) => (
                  <button
                    key={v}
                    onClick={() => setExtra(v)}
                    className={`text-sm px-3 py-2 border rounded-sm ${
                      v === extra
                        ? "border-[#3483fa] text-[#3483fa]"
                        : "border-gray-300 text-gray-800"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            className="mt-6 w-max px-2 py-[2px] rounded-[3px]"
            style={{ backgroundColor: "#3483fa" }}
          >
            <span className="text-white text-[11px] font-bold tracking-wider">
              OFERTA DO DIA
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span
                className="text-white text-[11px] font-bold px-[6px] py-[2px] rounded"
                style={{ backgroundColor: "#00a650" }}
              >
                {computeOffPct(oldPrice, newPrice)}% OFF
              </span>
              <span className="text-sm text-gray-500 line-through">R$ {oldPrice}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[34px] leading-none text-black/90">
                R$ {newPrice.split(",")[0]}
                <sup className="text-lg">,{newPrice.split(",")[1]}</sup>
              </span>
              <span className="text-sm text-gray-600">no Pix</span>
            </div>
          </div>

          <div
            className="mt-4 w-max px-2 py-[2px] rounded-[3px]"
            style={{ backgroundColor: "#00A650" }}
          >
            <span className="text-white text-[11px] font-bold tracking-wider">
              FRETE GRÁTIS ACIMA DE R$ 50
            </span>
          </div>
          <p className="mt-2 text-sm text-[#00a650] font-semibold">
            Chegará até qua. 29 de Julho
          </p>

          <p className="mt-5 font-bold text-base text-black/90">Estoque disponível</p>
          <p className="text-sm text-gray-600">
            Armazenado e enviado pelo{" "}
            <span className="text-[#00a650] font-bold">⚡FULL</span>
          </p>

          <div className="mt-4 px-[12px] h-[52px] bg-[#f5f5f5] rounded-md flex items-center">
            <span className="text-sm text-black/90">Quantidade:</span>
            <span className="ml-[6px] font-bold text-sm text-black/90">1</span>
            <span className="ml-[6px] text-sm text-gray-500">(+29 disponíveis)</span>
            <span className="ml-auto text-[#3483fa] text-2xl">›</span>
          </div>

          <button
            onClick={goCheckout}
            className="mt-4 w-full h-12 rounded-md text-white font-semibold text-base"
            style={{ backgroundColor: "#3483fa" }}
          >
            Comprar agora
          </button>
          <button
            onClick={goCheckout}
            className="mt-3 w-full h-12 rounded-md text-[#3483fa] font-semibold text-base"
            style={{ backgroundColor: "#e6efff" }}
          >
            Adicionar ao carrinho
          </button>
        </section>

        {/* Seller info */}
        <section className="px-4 md:px-8 pb-6 border-t border-gray-200 pt-6 text-sm">
          <div className="flex items-start gap-3">
            <img
              src="https://i.imgur.com/kj8rtIL.png"
              alt="Mercado Livre"
              width={44}
              height={44}
              loading="lazy"
              decoding="async"
              className="w-11 h-11 rounded-full object-contain bg-white border border-gray-200 shrink-0"
            />
            <div>
              <p>
                <span className="text-gray-700">Loja oficial </span>
                <a className="text-[#3483fa] font-medium" href="#">
                  Mercado Livre
                </a>
                <svg className="inline ml-1 -mt-[2px]" width="14" height="14" viewBox="0 0 24 24" fill="#3483fa">
                  <path d="M12 2l2.39 4.84L20 8l-4 3.9.94 5.5L12 14.77 7.06 17.4 8 11.9 4 8l5.61-1.16L12 2z" />
                </svg>
              </p>
              <p className="text-gray-700 font-medium mt-1">+500mil vendas</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <p className="flex gap-2">
              <img src="https://i.imgur.com/1LbAYXx.png" alt="" loading="lazy" decoding="async" style={{ marginTop: 6, height: 12 }} />
              <span>
                <a className="text-[#3483fa]" href="#">Devolução grátis.</a>{" "}
                <span className="text-gray-700">Você tem 30 dias a partir da data de recebimento.</span>
              </span>
            </p>
            <p className="flex gap-2">
              <img src="https://i.imgur.com/oQGZ0eH.png" alt="" loading="lazy" decoding="async" style={{ marginTop: 6, height: 16 }} />
              <span>
                <a className="text-[#3483fa]" href="#">Compra Garantida.</a>{" "}
                <span className="text-gray-700">Receba o produto que está esperando ou devolvemos o dinheiro.</span>
              </span>
            </p>
            <p className="flex gap-2">
              <span style={{ marginTop: 2, fontSize: 14, color: "rgba(0,0,0,.55)" }}>🏅</span>
              <span style={{ fontWeight: 400, fontSize: 14, color: "rgba(0,0,0,.55)" }}>
                12 meses de garantia de fábrica.
              </span>
            </p>
          </div>
        </section>


        {/* Características */}
        <section className="px-4 md:px-8 py-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            O que você precisa saber sobre este produto
          </h2>
          <ul className="text-sm space-y-2 list-disc pl-5 text-[#333]">
            {(p.features ?? []).slice(0, 4).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
            {showAllChars && (
              <>
                {(p.features ?? []).slice(4).map((f, i) => (
                  <li key={`extra-${i}`}>{f}</li>
                ))}
              </>
            )}
          </ul>

          <button
            onClick={() => setShowAllChars((s) => !s)}
            className="mt-4 w-full border border-gray-200 rounded-md py-3 text-[#3483fa] text-sm flex items-center justify-between px-4 hover:bg-gray-50"
          >
            <span>
              {showAllChars ? "Ver menos características" : "Conferir todas as características"}
            </span>
            <span className="text-lg">{showAllChars ? "‹" : "›"}</span>
          </button>
        </section>

        {/* Produtos relacionados */}
        {related.length > 0 && (
          <LazySection minHeight={420}>
          <section className="px-4 md:px-8 py-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Produtos relacionados</h2>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 md:mx-0 md:px-0">
              {related.map((r) => (
                <div key={r.id} className="snap-start shrink-0 w-[70%] sm:w-[280px]">
                  <RelatedCard p={r} />
                </div>
              ))}
            </div>
          </section>
          </LazySection>
        )}

        {/* Características do produto */}
        {p.specGroups && p.specGroups.length > 0 && (
          <div
            id="caracteristicas-1"
            style={{ margin: "20px 16px 0", flexGrow: 1, display: "flex", flexFlow: "column" }}
          >
            <span
              style={{
                display: "block",
                marginBottom: "20px",
                fontWeight: 600,
                fontSize: "20px",
                color: "rgba(0,0,0,.9)",
              }}
            >
              Características do produto
            </span>
            <div
              id="caracteristicas-1-conteudo"
              style={{
                marginBottom: "25px",
                flexGrow: 1,
                display: "flex",
                flexFlow: "column",
                gap: "5px",
                ...(showAllChars ? {} : { maxHeight: "400px", overflow: "hidden" }),
              }}
            >
              {[
                ...(p.specGroups ?? []),
                ...(p.extraSpecGroups ?? []),
                ...genericSpecGroups(p),
              ].map((group, gi) => (
                <div key={gi} style={{ minHeight: "max-content" }}>
                  <div
                    style={{
                      flexGrow: 1,
                      padding: "10px 0",
                      display: "flex",
                      alignItems: "center",
                      minHeight: "max-content",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "16px", color: "rgba(0,0,0,.9)" }}>
                      {group.title}
                    </span>
                  </div>
                  <div
                    style={{
                      borderRadius: "5px",
                      border: "solid 1px #f5f5f5",
                      overflow: "hidden",
                      marginBottom: "15px",
                      minHeight: "max-content",
                    }}
                  >
                    {group.rows.map(([label, value], ri) => (
                      <div
                        key={ri}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          minHeight: "max-content",
                          padding: "10px 0",
                          backgroundColor: ri % 2 === 0 ? "rgba(0,0,0,.04)" : "rgba(0,0,0,0)",
                        }}
                      >
                        <div style={{ width: "50%", display: "flex", alignItems: "center", height: "max-content" }}>
                          <span style={{ marginLeft: "10px", fontSize: "14px", color: "rgba(0,0,0,.9)" }}>
                            {label}
                          </span>
                        </div>
                        <div style={{ width: "50%", display: "flex", alignItems: "center", minHeight: "max-content" }}>
                          <span style={{ marginLeft: "10px", fontSize: "14px", color: "rgba(0,0,0,.9)" }}>
                            {value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAllChars((s) => !s)}
              className="mb-6 w-full border border-gray-200 rounded-md py-3 text-[#3483fa] text-sm flex items-center justify-between px-4 hover:bg-gray-50"
            >
              <span>{showAllChars ? "Ver menos características" : "Ver todas as características"}</span>
              <span className="text-lg">{showAllChars ? "‹" : "›"}</span>
            </button>
          </div>
        )}



        {/* Store header */}
        <section className="border-b border-gray-200">
          <img
            src="https://i.imgur.com/8DokMVr.png"
            alt="Mercado Livre - Loja oficial"
            width={1920}
            height={512}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-contain"
          />
          <div className="px-4 md:px-8 relative">
            <img
              src="https://i.imgur.com/kj8rtIL.png"
              alt="Mercado Livre"
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
              className="w-14 h-14 rounded-full object-contain bg-white border border-gray-200 -mt-8 relative z-10"
            />
            <h2 className="mt-2 text-base font-bold text-black/90">Mercado Livre</h2>
            <p className="mt-[2px] text-[13px] text-gray-600 flex items-center gap-1">
              Loja oficial
              <svg width="15" height="15" viewBox="0 0 15 15" className="inline">
                <path
                  fill="#3483FA"
                  d="M6.91.93a1 1 0 0 1 1.18 0l.984.718a1 1 0 0 0 .592.193l1.219-.003a1 1 0 0 1 .954.693l.374 1.16a1 1 0 0 0 .366.503l.987.715a1 1 0 0 1 .365 1.121l-.38 1.16a1 1 0 0 0 0 .62l.38 1.16a1 1 0 0 1-.365 1.12l-.987.716a1 1 0 0 0-.366.503l-.374 1.16a1 1 0 0 1-.954.693l-1.22-.003a1 1 0 0 0-.59.192l-.986.72a1 1 0 0 1-1.178 0l-.985-.72a1 1 0 0 0-.592-.192l-1.219.003a1 1 0 0 1-.954-.693l-.374-1.16a1 1 0 0 0-.366-.503l-.987-.715a1 1 0 0 1-.365-1.121l.38-1.16a1 1 0 0 0 0-.62l-.38-1.16a1 1 0 0 1 .365-1.12l.987-.716a1 1 0 0 0 .366-.503l.374-1.16a1 1 0 0 1 .954-.693l1.22.003a1 1 0 0 0 .59-.193z"
                />
                <path fill="#fff" d="m6.72 9.53 4.02-4.02.7.7-4.72 4.72-2.3-2.3.7-.7z" />
              </svg>
            </p>
            <p className="text-[13px] text-gray-600">
              <span className="font-bold text-black/80">+10mil</span> Seguidores
            </p>
            <p className="mt-1 flex items-center gap-1 text-[13px] font-bold text-[#00a650]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#00a650">
                <path d="M12 2a5 5 0 0 1 5 5c0 2-1.2 3.7-3 4.5V14h-4v-2.5C8.2 10.7 7 9 7 7a5 5 0 0 1 5-5Zm-3 14h6l1 6-4-2-4 2 1-6Z" />
              </svg>
              MercadoLíder Platinum
            </p>
            <p className="text-[12px] text-[#00a650]">É um dos melhores do site!</p>
          </div>
          <div className="mt-4 px-4 md:px-8 pb-5 grid grid-cols-3 gap-3 text-center">
            {[
              {
                bar: "#f5c6c6",
                title: "+500mil",
                sub: "Vendas",
                icon: null as React.ReactNode,
              },
              {
                bar: "#c9edd6",
                title: "",
                sub: "Bom atendimento",
                icon: (
                  <svg width="18" height="17" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.4 11.016a1.8 1.8 0 0 0 1.8 1.8h.597v2.92l4.383-2.92h4.62a1.8 1.8 0 0 0 1.8-1.8v-7.2a1.8 1.8 0 0 0-1.8-1.8H3.2a1.8 1.8 0 0 0-1.8 1.8v7.2Zm11.399.6H7.817l-2.82 1.879v-1.88H3.2a.6.6 0 0 1-.6-.6V3.818a.6.6 0 0 1 .6-.6h9.598a.6.6 0 0 1 .6.6v7.199a.6.6 0 0 1-.6.6Z"
                      fill="#000"
                      fillOpacity=".9"
                    />
                    <rect x="10" y="8.616" width="8" height="8" rx="4" fill="#00A650" />
                    <path d="m13.31 13.333 2.605-2.604.585.585-3.19 3.19-1.81-1.81.585-.586 1.225 1.225Z" fill="#fff" />
                  </svg>
                ),
              },
              {
                bar: "#00a650",
                title: "",
                sub: "Entrega no prazo",
                icon: (
                  <svg width="18" height="17" fill="none" viewBox="0 0 18 17">
                    <path fill="#000" fillOpacity=".9" d="M9.8 2.017H6.204v-1.2H9.8zM5.332 11.82l-.537-1.072 2.604-1.303.003-3.829 1.2.001-.003 4.57z" />
                    <path
                      fill="#000"
                      fillOpacity=".9"
                      fillRule="evenodd"
                      d="M14.599 9.816a6.58 6.58 0 0 0-2.023-4.755l1.071-1.338-.936-.75L11.64 4.31a6.6 6.6 0 1 0 2.96 5.506m-12 0a5.4 5.4 0 1 1 10.8 0 5.4 5.4 0 0 1-10.8 0"
                      clipRule="evenodd"
                    />
                    <rect width="8" height="8" x="10" y="8.616" fill="#00a650" rx="4" />
                    <path fill="#fff" d="m13.31 13.333 2.605-2.604.585.585-3.19 3.19-1.81-1.81.585-.586z" />
                  </svg>
                ),
              },
            ].map((s) => (
              <div key={s.sub}>
                <div className="h-[3px] rounded-full" style={{ backgroundColor: s.bar }} />
                <div className="mt-3 flex flex-col items-center gap-1">
                  {s.title ? (
                    <span className="text-[15px] font-semibold text-black/90">{s.title}</span>
                  ) : (
                    s.icon
                  )}
                  <span className="text-[12px] text-gray-500">{s.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fotos do produto */}
        <section className="px-4 md:px-8 pb-6 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4">Fotos do produto</h2>
          <div className={showAllPhotos ? "flex flex-col gap-4" : "w-full"}>
            {(showAllPhotos ? p.photos : p.photos.slice(0, 1)).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Foto do produto ${i + 1}`}
                width={900}
                height={900}
                loading="lazy"
                decoding="async"
                className="w-full max-w-md mx-auto block"
              />
            ))}
          </div>
          {p.photos.length > 1 && (
            <button
              onClick={() => setShowAllPhotos((s) => !s)}
              className="mt-4 w-full border border-gray-200 rounded-md py-3 text-[#3483fa] text-sm flex items-center justify-between px-4 hover:bg-gray-50"
            >
              <span>{showAllPhotos ? "Ver menos imagens" : "Ver todas imagens"}</span>
              <span className="text-lg">{showAllPhotos ? "‹" : "›"}</span>
            </button>
          )}
        </section>

        {/* Descrição */}
        <section className="px-4 md:px-8 py-6 border-t border-gray-200 text-[#333]">
          <h2 className="text-lg font-semibold mb-4">Descrição</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            {longDescription(p).map((par, i) => (
              <p key={i}>{par}</p>
            ))}
            <p>
              Aproveite a promoção especial: de R$ {oldPrice} por apenas R$ {newPrice}{" "}
              no Pix, com aprovação imediata.
            </p>
          </div>
        </section>

        {/* Opiniões */}
        {!p.hideReviews && (
        <section className="px-4 md:px-8 py-6 border-t border-gray-200">
          <span
            style={{
              margin: "20px 0",
              display: "block",
              fontFamily: "proximanovasemibold, -apple-system, Roboto, Helvetica, sans-serif",
              fontWeight: 600,
              fontSize: 20,
              color: "rgba(0,0,0,.9)",
            }}
          >
            Opiniões do produto
          </span>

          <div className="mt-4 flex items-start gap-4">
            <div style={{ width: "50%" }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "proximanovasemibold, -apple-system, Roboto, Helvetica, sans-serif",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: 1.1,
                  color: "#3483fa",
                }}
              >
                4.8
              </span>
              <div style={{ marginTop: 5, display: "flex", alignItems: "center" }}>
                {[0, 1, 2, 3].map((i) => (
                  <svg key={i} style={{ marginRight: 5 }} aria-hidden width="18.8" height="18" viewBox="0 0 10 10">
                    <path
                      fill="#3483FA"
                      fillRule="evenodd"
                      d="M5.056 8L1.931 9.648l.597-3.49L0 3.684l3.494-.509L5.056 0l1.562 3.176 3.494.51-2.528 2.471.597 3.491z"
                    />
                  </svg>
                ))}
                <svg aria-hidden width="18.8" height="18" viewBox="0 0 10 10">
                  <g fill="none" fillRule="evenodd">
                    <path
                      fill="transparent"
                      d="M5.256 8L2.131 9.648l.597-3.49L.2 3.684l3.494-.509L5.256 0l1.562 3.176 3.494.51-2.528 2.471.597 3.491z"
                      stroke="rgba(0, 0, 0, 0.25)"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      fill="#3483FA"
                      d="M5.272 8.026L2.137 9.679l.6-3.502L.2 3.697l3.505-.51L5.272 0z"
                      stroke="#3483FA"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                </svg>
              </div>
              <span
                style={{
                  display: "block",
                  marginTop: 6,
                  fontFamily: "proximanovaregular, -apple-system, Roboto, Helvetica, sans-serif",
                  fontSize: 14,
                  color: "rgba(0,0,0,.55)",
                }}
              >
                {Math.max(p.reviews.length, 5)} avaliações
              </span>
            </div>

            <div style={{ width: "50%" }}>
              {[
                { n: 5, w: "88%" },
                { n: 4, w: "4%" },
                { n: 3, w: "2%" },
                { n: 2, w: "1%" },
                { n: 1, w: "1%" },
              ].map((row) => (
                <div key={row.n} style={{ width: "100%", display: "flex", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ flexGrow: 1 }}>
                    <div
                      style={{
                        borderRadius: 2.5,
                        height: 4,
                        backgroundColor: "rgba(0,0,0,.1)",
                        display: "flex",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          borderRadius: 2.5,
                          width: row.w,
                          backgroundColor: "rgba(0,0,0,.55)",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginLeft: 10, width: 14, textAlign: "center" }}>
                    <span
                      style={{
                        fontFamily: "proximanovaregular, -apple-system, Roboto, Helvetica, sans-serif",
                        fontSize: 14,
                        color: "rgba(0,0,0,.55)",
                      }}
                    >
                      {row.n}
                    </span>
                  </div>
                  <span style={{ marginTop: -3, fontSize: 18, color: "rgba(0,0,0,.2)" }}>★</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ margin: "20px 0", width: "100%", height: 1, backgroundColor: "rgba(0,0,0,.1)" }} />


          {(p.reviews.length
            ? p.reviews
            : DEFAULT_COMMENTS.map((_, i) =>
                p.carousel.slice(i % Math.max(1, p.carousel.length - 2), (i % Math.max(1, p.carousel.length - 2)) + 3)
              )
          ).map((imgs, i) => (
            <ReviewBlock
              key={i}
              n={i + 1}
              images={imgs}
              texts={REVIEWS_BY_PRODUCT[String(p.id)] ?? REVIEW_TEXTS}
              commentsOnly={false}
              imagesOnly={p.reviewImagesOnly}
            />
          ))}

          {p.commentsOnly && (
            <div className="space-y-4 mt-4">
              {EXTRA_COMMENTS.map((c, i) => (
                <ReviewBlock
                  key={`extra-${i}`}
                  n={p.reviews.length + i + 1}
                  images={[]}
                  texts={[{ author: c.author, text: c.text, likes: 10 + (i * 3) }]}
                  commentsOnly={true}
                />
              ))}
            </div>
          )}

        </section>
        )}

        {/* Quem viu este produto também comprou */}
        {alsoBought.length > 0 && (
          <LazySection minHeight={420}>
          <section className="px-4 md:px-8 py-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Quem viu este produto também comprou</h2>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 md:mx-0 md:px-0">
              {alsoBought.map((r) => (
                <div key={r.id} className="snap-start shrink-0 w-[70%] sm:w-[280px]">
                  <RelatedCard p={r} />
                </div>
              ))}
            </div>
          </section>
          </LazySection>
        )}

      </main>
      <SiteFooter />
    </div>
  );
}

function computeOffPct(oldP: string, newP: string): number {
  const o = Number(oldP.replace(/\./g, "").replace(",", "."));
  const n = Number(newP.replace(/\./g, "").replace(",", "."));
  if (!o || !n) return 0;
  return Math.round((1 - n / o) * 100);
}

function Star({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const REVIEW_TEXTS = [
  {
    author: "Ana Paula R.",
    text:
      "Confesso que fiquei com o pé atrás por causa do preço, mas o produto chegou em 4 dias, muito bem embalado e sem nenhum arranhão. A maleta é firme, tudo vem organizado no lugar certo e a qualidade dos acabamentos é bem melhor do que eu esperava. Já usei em vários serviços em casa e não deu nenhum problema, a bateria segura tranquilo por bastante tempo. Custo-benefício absurdo, já indiquei pra duas amigas e as duas compraram também.",
    likes: 362,
  },
  {
    author: "Rodrigo Santos",
    text:
      "Trabalho com manutenção e comprei meio na dúvida pra usar como reserva, mas acabou virando minha ferramenta principal do dia a dia. Tem força de sobra, encara parafuso apertado sem engasgar e o torque é bem distribuído. O carregamento é rápido e a bateria aguanta um dia inteiro de trabalho leve/médio sem precisar recarregar. Veio tudo certinho conforme o anúncio, entrega antes do prazo e a nota fiscal acompanhou. Recomendo demais.",
    likes: 289,
  },
  {
    author: "Carla Mendes",
    text:
      "Comprei pro meu marido de presente e ele amou. O que mais chamou atenção foi o acabamento e o peso: é leve o suficiente pra usar por um tempo bom sem cansar o braço, mas passa uma sensação de resistência. As pontas e acessórios que vêm na maleta cobrem praticamente tudo que a gente precisa em casa, então não foi preciso comprar nada separado. Chegou rapidinho e bem protegido. Já é a segunda compra que faço na loja e nunca tive problema.",
    likes: 244,
  },
  {
    author: "Fernando Lima",
    text:
      "Produto exatamente como descrito no anúncio, sem surpresa nenhuma. Montei dois móveis, troquei fechaduras e furei parede de alvenaria sem dificuldade. O reverso funciona perfeitamente e a luz de LED ajuda muito em lugar escuro, coisa que eu nem esperava por esse valor. A maleta facilita guardar tudo junto e não perder as peças. Entrega pelo FULL foi surpreendentemente rápida, chegou dois dias antes do previsto. Vale cada centavo.",
    likes: 198,
  },
  {
    author: "Juliana Alves",
    text:
      "Melhor compra que fiz esse ano, com sinceridade. Eu não entendo muito de ferramenta e mesmo assim consegui usar de primeira, é bem intuitivo. Já emprestei pro meu pai e ele, que é marceneiro, aprovou a força do aparelho. Uma dica: carregue completo antes do primeiro uso que a bateria rende bem mais. Chegou lacrado, com garantia e a embalagem toda reforçada. Atendimento da loja também respondeu rápido quando perguntei sobre a voltagem.",
    likes: 173,
  },
  {
    author: "Marcelo Torres",
    text:
      "Já tive outras marcas mais caras e essa aqui não fica devendo em nada pro uso doméstico e semiprofissional. Aperta e solta parafuso com facilidade, não esquenta rápido e o encaixe das pontas é firme, não fica dançando. O kit completo na maleta é o grande diferencial, porque você abre e tem tudo à mão. Comprei aproveitando a promoção e valeu muito a pena, se estiver na dúvida pode comprar tranquilo que não vai se arrepender.",
    likes: 156,
  },
];

const DEFAULT_COMMENTS: string[][] = [[], [], []];

const EXTRA_COMMENTS = [
  { author: "Cliente verificado", text: "Ótimo produto, funciona muito bem e o envio foi rápido." },
  { author: "Cliente verificado", text: "Vale muito o preço. Recomendo." },
  { author: "Cliente verificado", text: "Estou usando há algumas semanas e estou satisfeito com a compra." },
  { author: "Cliente verificado", text: "Chegou antes do prazo, produto original e de qualidade." },
];

function ReviewBlock({
  n,
  images,
  texts,
  commentsOnly,
  imagesOnly,
}: {
  n: number;
  images: string[];
  texts?: { author: string; text: string; likes?: number }[];
  commentsOnly?: boolean;
  imagesOnly?: boolean;
}) {
  const list = texts && texts.length ? texts : REVIEW_TEXTS;
  const r = list[(n - 1) % list.length];
  const [liked, setLiked] = useState(false);
  const base = r.likes ?? 10 + ((n * 7) % 23);
  const color = liked ? "#3483fa" : "rgba(0, 0, 0, 0.55)";
  if (imagesOnly) {
    return (
      <div className="border-t border-gray-100 py-4">
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Foto de avaliação ${n} — imagem ${i + 1}`}
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
              className="w-24 h-24 object-cover rounded border border-gray-100"
            />
          ))}
        </div>
        <div
          onClick={() => setLiked((v) => !v)}
          role="button"
          aria-pressed={liked}
          style={{
            cursor: "pointer",
            height: 30,
            border: `solid 1px ${color}`,
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 15,
            marginTop: 14,
            padding: "0 10px",
            backgroundColor: "#fff",
          }}
        >
          <span style={{ fontSize: 12, color, marginRight: 8, fontWeight: 600 }}>É útil</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={color}
            aria-hidden="true"
            style={{ marginRight: 6 }}
          >
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
          </svg>
          <span style={{ fontSize: 12, color, fontWeight: 600 }}>{liked ? base + 1 : base}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="border-t border-gray-100 pt-4 pb-4">
      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <span style={{ margin: "0 auto 0 0", color: "#3483fa", fontSize: 16, letterSpacing: 1 }}>★★★★★</span>
        <span
          style={{
            margin: "0 0 0 auto",
            fontFamily: "proximanovaregular, -apple-system, Roboto, Helvetica, sans-serif",
            fontSize: 12,
            color: "rgba(0,0,0,.55)",
          }}
        >
          {n === 1 ? "Há 1 dia" : `Há ${n} dias`}
        </span>
      </div>
      <p
        style={{
          marginTop: 10,
          fontFamily: "proximanovaregular, -apple-system, Roboto, Helvetica, sans-serif",
          fontSize: 16,
          lineHeight: 1.5,
          color: "rgba(0,0,0,.9)",
          wordBreak: "break-word",
        }}
      >
        {r.text}
      </p>
      <p
        style={{
          marginTop: 6,
          fontFamily: "proximanovaregular, -apple-system, Roboto, Helvetica, sans-serif",
          fontSize: 13,
          color: "rgba(0,0,0,.55)",
        }}
      >
        {r.author}
      </p>

      {!commentsOnly && images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Avaliação ${n} — foto ${i + 1}`}
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
              className="w-24 h-24 object-cover rounded border border-gray-100"
            />
          ))}
        </div>
      )}

      <div
        id={`botaoLike${n}`}
        onClick={() => setLiked((v) => !v)}
        role="button"
        aria-pressed={liked}
        style={{
          cursor: "pointer",
          height: 30,
          border: `solid 1px ${color}`,
          display: "inline-flex",
          alignItems: "center",
          borderRadius: 15,
          marginTop: 14,
        }}
      >
        <div style={{ margin: "0 0 0 10px", width: 30, textAlign: "left" }}>
          <span
            style={{
              display: "block",
              fontFamily: "proximanovasemibold, sans-serif",
              fontSize: 12,
              color,
            }}
          >
            É útil
          </span>
        </div>
        <div style={{ margin: 0, width: 30, textAlign: "center", lineHeight: 0 }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={color}
            style={{ display: "inline-block", verticalAlign: "middle", marginTop: 2 }}
            aria-hidden="true"
          >
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
          </svg>
        </div>
        <div style={{ margin: "0 10px 0 0", textAlign: "left" }}>
          <span
            id={`likes${n}`}
            style={{
              display: "block",
              fontFamily: "proximanovasemibold, sans-serif",
              fontSize: 12,
              color,
            }}
          >
            {liked ? base + 1 : base}
          </span>
        </div>
      </div>
    </div>
  );
}

function RelatedCard({ p }: { p: Product }) {
  return (
    <Link
      to="/produto/$id"
      params={{ id: p.id }}
      className="block border border-gray-100 rounded-md p-3 hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-white overflow-hidden rounded">
        <img
          src={p.carousel[0]}
          alt={p.title}
          className="w-full h-full object-contain"
          width={300}
          height={300}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="mt-3 text-[13px] text-gray-500 line-through">R$ {p.oldPrice}</div>
      <div className="text-[22px] leading-tight text-black/90">
        R$ {p.newPrice.split(",")[0]}
        <sup className="text-[12px]">,{p.newPrice.split(",")[1]}</sup>
        <span className="ml-2 align-middle text-[12px] font-bold text-[#00a650]">
          {computeOffPct(p.oldPrice, p.newPrice)}% OFF
        </span>
      </div>
      <div className="mt-2 text-[14px] text-gray-800 line-clamp-2 min-h-[40px]">
        {p.title}
      </div>
      <div className="text-[13px] text-[#00a650] font-semibold mt-2">Frete grátis</div>
    </Link>
  );
}
