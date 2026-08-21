import { createFileRoute } from "@tanstack/react-router";
import html from "../clone-site.html?raw";
import { ALL_PRODUCTS } from "../lib/products";
import { SELLER_MODAL_HTML, SELLER_MODAL_SCRIPT } from "../lib/seller-modal";

const PLACEHOLDER = "/clone-assets/images/placeholder.svg";
const MAIN_PRODUCT_ID = "6549324";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function priceNumber(value: string) {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

function discountPercent(oldPrice: string, newPrice: string) {
  const oldValue = priceNumber(oldPrice);
  const newValue = priceNumber(newPrice);
  if (!oldValue || !newValue) return 0;
  return Math.round((1 - newValue / oldValue) * 100);
}

function productCard(product: (typeof ALL_PRODUCTS)[number], index = 0) {
  const [reais, centavos = "00"] = product.newPrice.split(",");
  const image = product.carousel[0] || PLACEHOLDER;
  const href = `/produto/${encodeURIComponent(product.id)}`;

  const eager = index < 2;

  return `<a href="${href}" onclick="event.preventDefault();window.location.href='${href}';" data-product-card="${escapeHtml(product.id)}" style="display:block !important;flex:0 0 46% !important;width:46% !important;min-width:46% !important;max-width:46% !important;scroll-snap-align:start;border:1px solid #eeeeee;border-radius:6px;padding:8px;background:#fff;color:#333;text-decoration:none;box-sizing:border-box;position:relative;z-index:999;pointer-events:auto;visibility:visible !important;opacity:1 !important;min-height:340px;">
    <div style="width:100%;aspect-ratio:1/1;min-height:150px;background:#fff;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;"><img src="${escapeHtml(image)}" alt="${escapeHtml(product.title)}" width="300" height="300" style="display:block !important;width:100% !important;height:100% !important;aspect-ratio:1/1;object-fit:contain;visibility:visible !important;opacity:1 !important;" loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""} onerror="this.onerror=null;this.src='${PLACEHOLDER}';" /></div>
    <div style="margin-top:8px;font-size:12px;color:#777;text-decoration:line-through;">R$ ${escapeHtml(product.oldPrice)}</div>
    <div style="font-size:16px;color:#222;line-height:1.15;">R$ ${escapeHtml(reais)}<sup style="font-size:10px;">,${escapeHtml(centavos)}</sup></div>
    <div style="margin-top:4px;font-size:11px;color:#00a650;font-weight:700;">${discountPercent(product.oldPrice, product.newPrice)}% OFF</div>
    <div style="margin-top:4px;font-size:12px;color:#333;line-height:1.25;min-height:45px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(product.title)}</div>
    <div style="margin-top:6px;font-size:11px;color:#00a650;font-weight:700;">Frete grátis</div>
    <div style="margin-top:8px;height:32px;border-radius:5px;background:#3483fa;color:#fff;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;">Ver produto</div>
  </a>`;
}

function buildRelatedSection() {
  const cards = ALL_PRODUCTS.filter((product) => product.id !== MAIN_PRODUCT_ID)
    .map(productCard)
    .join("");

  return `<section id="related-products-fixed" data-related-products="true" style="display:block !important;padding:24px 16px;border-top:1px solid #e5e7eb;max-width:1200px;margin:0 auto;background:#fff;clear:both;overflow:visible;visibility:visible !important;opacity:1 !important;min-height:390px;"><h2 style="font-size:18px;line-height:1.25;font-weight:600;margin:0 0 16px;color:#333;">Quem viu este produto também comprou</h2><div data-related-scroller="true" style="display:flex !important;gap:12px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;padding-bottom:14px;-webkit-overflow-scrolling:touch;min-height:350px;visibility:visible !important;opacity:1 !important;">${cards}</div></section>`;
}

function buildRelatedFallbackScript() {
  const cards = ALL_PRODUCTS.filter((product) => product.id !== MAIN_PRODUCT_ID)
    .map(productCard)
    .join("");

  return `<script>(function(){var cards=${JSON.stringify(cards)};function forceStyles(section,scroller){section.id='related-products-fixed';section.setAttribute('data-related-products','true');section.style.cssText='display:block !important;padding:24px 16px;border-top:1px solid #e5e7eb;max-width:1200px;margin:0 auto;background:#fff;clear:both;overflow:visible;visibility:visible !important;opacity:1 !important;min-height:390px;';scroller.setAttribute('data-related-scroller','true');scroller.style.cssText='display:flex !important;gap:12px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;padding-bottom:14px;-webkit-overflow-scrolling:touch;min-height:350px;visibility:visible !important;opacity:1 !important;';}function mount(){var section=document.getElementById('related-products-fixed')||document.querySelector('[data-related-products="true"]');if(!section){section=document.createElement('section');section.innerHTML='<h2 style="font-size:18px;line-height:1.25;font-weight:600;margin:0 0 16px;color:#333;">Quem viu este produto também comprou</h2><div data-related-scroller="true"></div>';var footer=document.querySelector('footer');if(footer&&footer.parentNode){footer.parentNode.insertBefore(section,footer)}else{document.body.appendChild(section)}}var scroller=section.querySelector('[data-related-scroller="true"]');if(!scroller){scroller=document.createElement('div');section.appendChild(scroller)}forceStyles(section,scroller);if(scroller.querySelectorAll('[data-product-card]').length<5){scroller.innerHTML=cards}Array.prototype.forEach.call(scroller.querySelectorAll('[data-product-card]'),function(card){card.style.setProperty('display','block','important');card.style.setProperty('visibility','visible','important');card.style.setProperty('opacity','1','important');card.style.pointerEvents='auto';var img=card.querySelector('img');if(img){img.style.setProperty('display','block','important');img.style.setProperty('visibility','visible','important');img.style.setProperty('opacity','1','important')}card.onclick=function(e){e.preventDefault();var href=card.getAttribute('href');if(href) window.location.href=href.split('?')[0]+(window.location.search||'');};});}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mount)}else{mount()}setTimeout(mount,100);setTimeout(mount,500);setTimeout(mount,1500);window.addEventListener('pageshow',mount);})();</script>`;
}

const relatedSectionPattern = /<section class="px-4 md:px-8 py-6 border-t border-gray-200 max-w-\[1200px\] mx-auto"><h2 class="text-lg font-semibold mb-4">Quem viu este produto também comprou<\/h2>[\s\S]*?<\/section>/;
const relatedSection = buildRelatedSection();
const pageHtmlWithoutOldRelated = html.replace(relatedSectionPattern, "");
const footerOpenIndex = pageHtmlWithoutOldRelated.search(/<footer[\s>]/);
const pageHtmlWithRelated =
  footerOpenIndex >= 0
    ? pageHtmlWithoutOldRelated.slice(0, footerOpenIndex) +
      relatedSection +
      pageHtmlWithoutOldRelated.slice(footerOpenIndex)
    : pageHtmlWithoutOldRelated.includes("</body>")
      ? pageHtmlWithoutOldRelated.replace("</body>", `${relatedSection}</body>`)
      : `${pageHtmlWithoutOldRelated}${relatedSection}`;

const relatedFallbackScript = buildRelatedFallbackScript();
const injectedTail = `${relatedFallbackScript}${SELLER_MODAL_HTML}${SELLER_MODAL_SCRIPT}`;
const pageHtml = pageHtmlWithRelated.includes("</body>")
  ? pageHtmlWithRelated.replace("</body>", `${injectedTail}</body>`)
  : `${pageHtmlWithRelated}${injectedTail}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jogo de Panelas Antiaderente 10 Peças" },
      {
        name: "description",
        content:
          "Oferta de jogo de panelas antiaderente com frete grátis, avaliações e produtos relacionados.",
      },
      { property: "og:title", content: "Jogo de Panelas Antiaderente 10 Peças" },
      {
        property: "og:description",
        content:
          "Oferta de jogo de panelas antiaderente com frete grátis, avaliações e produtos relacionados.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  server: {
    handlers: {
      GET: () =>
        new Response(pageHtml, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
            pragma: "no-cache",
          },
        }),
    },
  },
});
