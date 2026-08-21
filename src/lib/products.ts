import data from "./products-data.json";

export type Product = {
  id: string;
  title: string;
  oldPrice: string;
  newPrice: string;
  colors: string[] | null;
  activeColor?: string;
  colorVariants?: {
    name: string;
    swatch?: string;
    image?: string;
    oldPrice?: string;
    newPrice?: string;
  }[];
  voltage: { options: string[]; active: string } | null;
  extra?: { label: string; options: string[]; active: string };
  carousel: string[];
  photos: string[];
  reviews: string[][];
  commentsOnly?: boolean;
  hideReviews?: boolean;
  reviewImagesOnly?: boolean;
  category: string;
  features?: string[];
  specGroups?: { title: string; rows: [string, string][] }[];
  extraSpecGroups?: { title: string; rows: [string, string][] }[];
};



export const MAIN_PRODUCT: Product = {
  id: "6549324",
  title: "Jogo De Panelas Indução Antiaderente Cerâmica 10 Peças PPG PFOA Free Baunilha",
  oldPrice: "236,73",
  newPrice: "61,93",
  colors: ["Cereja", "Preto", "Preto Co...", "Rose"],
  activeColor: "Cereja",
  voltage: null,
  carousel: [
    "https://i.postimg.cc/Gtj1SkJR/D-NQ-NP-2X-754218-MLA98733384331-112025-F.webp",
    "https://i.postimg.cc/nr1twvYD/D-NQ-NP-2X-896529-MLA98735006295-112025-F.webp",
    "https://i.postimg.cc/C1YPr9vP/D-NQ-NP-2X-623728-MLA98261019906-112025-F.webp",
    "https://i.postimg.cc/RF9sp2Pc/D-NQ-NP-2X-665578-MLA98735006309-112025-F.webp",
    "https://i.postimg.cc/0QxWXhtS/D-NQ-NP-2X-668852-MLA98735006315-112025-F.webp",
    "https://i.postimg.cc/sXy6HbnZ/D-NQ-NP-2X-824478-MLA109899348503-032026-F.webp",
    "https://i.postimg.cc/9MV8gsxM/D-NQ-NP-2X-938495-MLA109064063000-032026-F.webp",
    "https://i.postimg.cc/cHZ9kPDD/D-NQ-NP-2X-972456-MLA98734876921-112025-F.webp",
    "https://i.postimg.cc/tTySv8rF/D-NQ-NP-2X-985877-MLA98261019930-112025-F.webp",
  ],
  photos: ["https://i.postimg.cc/SRmWhh8X/D-Q-NP-2X-663481-MLA97124665440-112025-F.webp"],
  reviews: [],
  category: "Casa, Móveis e Decoração",
  features: [
    "Material: Cerâmica antiaderente.",
    "Peças: 10.",
    "Compatível com indução: Sim.",
    "Livre de PFOA: Sim.",
    "Revestimento antiaderente cerâmico facilita o preparo e a limpeza diária.",
    "Compatível com todos os tipos de fogão, incluindo indução.",
    "Cabos ergonômicos e resistentes ao calor garantem uso seguro.",
    "Distribuição uniforme de calor para cocção eficiente dos alimentos.",
    "Livre de PFOA, mais seguro para a saúde da família.",
    "Design moderno em tom baunilha combina com qualquer cozinha.",
  ],
  specGroups: [
    { title: "Características gerais", rows: [["Marca","PPG"],["Modelo","Baunilha"],["Cor","Baunilha"],["Material","Cerâmica antiaderente"]] },
    { title: "Especificações", rows: [["Quantidade de peças","10"],["Compatível com indução","Sim"],["Livre de PFOA","Sim"]] },
  ],
  extraSpecGroups: [
    { title: "Dimensões e peso", rows: [["Altura da embalagem","25 cm"],["Largura da embalagem","45 cm"],["Profundidade da embalagem","35 cm"],["Peso","5,2 kg"]] },
    { title: "Outros", rows: [["Vai à lava-louças","Não"],["Vai ao forno","Sim, até 180°C"],["Cabo removível","Não"],["Garantia","3 meses"]] },
  ],
};



// Estes itens chegaram ao repositório com todos os arquivos de imagem vazios
// (0 bytes). Mantê-los no catálogo cria cards brancos e páginas sem fotos.
// Os dados permanecem no JSON para poderem ser recuperados depois, mas os
// produtos ficam fora da navegação até receberem imagens válidas.
const PRODUCTS_WITHOUT_IMAGES = new Set([
  "1497000015",
  "5521000018",
  "8834000019",
  "2278000022",
]);

export const PRODUCTS: Product[] = (data as Product[]).filter(
  (product) => !PRODUCTS_WITHOUT_IMAGES.has(product.id),
);

function safeAssetPart(value: string, allowDots = false): string {
  const pattern = allowDots ? /[^A-Za-z0-9_.()-]+/g : /[^A-Za-z0-9_-]+/g;
  return value.replace(pattern, "-").replace(/^-+|-+$/g, "");
}

function localProductImage(src: string): string {
  return src;
}


function localizeProductImages(product: Product): Product {
  return {
    ...product,
    carousel: product.carousel.map(localProductImage),
    photos: product.photos.map(localProductImage),
    reviews: product.reviews.map((review) => review.map(localProductImage)),
  };
}

export const ALL_PRODUCTS: Product[] = [MAIN_PRODUCT, ...PRODUCTS].map(localizeProductImages);

export function getProduct(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export function priceToNumber(p: string): number {
  return Number(p.replace(/\./g, "").replace(",", "."));
}

/** Descrição longa gerada para qualquer produto. */
export function longDescription(p: Product): string[] {
  const feats = p.features ?? [];
  return [
    `${p.title} é a escolha certa para quem procura qualidade, durabilidade e um excelente custo-benefício. Produto novo, original, lacrado na caixa e com nota fiscal, enviado com toda a segurança e agilidade do envio FULL do Mercado Livre.`,
    `Desenvolvido com materiais de alta resistência e acabamento premium, este item passa por rigoroso controle de qualidade antes do envio. Cada unidade é testada para garantir o perfeito funcionamento, a segurança de uso e a durabilidade que você espera de um produto campeão de vendas na plataforma.`,
    feats.length
      ? `Principais destaques: ${feats.slice(0, 6).join(" ")}`
      : `Design moderno, prático no dia a dia e fácil de usar por toda a família.`,
    `PRATICIDADE NO DIA A DIA — Pensado para facilitar sua rotina, o produto é simples de usar, fácil de limpar e ocupa pouco espaço para armazenamento. O acabamento resistente evita desgaste precoce, mesmo com uso frequente, mantendo a aparência de novo por muito mais tempo.`,
    `QUALIDADE COMPROVADA — Mais de 500 mil vendas realizadas e milhares de avaliações positivas de clientes reais que aprovaram o produto. Nota média 4.8 de 5 estrelas, com destaque para o custo-benefício, a rapidez da entrega e a qualidade do material.`,
    `SEGURANÇA NA COMPRA — Você conta com a Compra Garantida do Mercado Livre: receba o produto que está esperando ou devolvemos o seu dinheiro. Além disso, a devolução é grátis em até 30 dias a partir da data de recebimento, sem burocracia e sem custo adicional.`,
    `GARANTIA DE FÁBRICA — O produto acompanha 12 meses de garantia de fábrica contra defeitos de fabricação. Em caso de qualquer problema, basta acionar o atendimento pela própria plataforma que resolvemos rapidamente para você.`,
    `ENVIO IMEDIATO — Estoque disponível e pronto para envio. Pedidos aprovados são despachados no mesmo dia útil, com rastreio completo pelo aplicativo. Frete grátis para compras acima de R$ 19 e prazos reduzidos com o selo FULL.`,
    `FORMAS DE PAGAMENTO — Pague no Pix com aprovação imediata e o melhor preço, ou parcele no cartão de crédito. A promoção é por tempo limitado: de R$ ${p.oldPrice} por apenas R$ ${p.newPrice} no Pix.`,
    `IMPORTANTE — As imagens são meramente ilustrativas; pequenas variações de tonalidade podem ocorrer de acordo com a configuração da sua tela. Verifique as medidas e especificações técnicas antes de finalizar a compra. Em caso de dúvidas, envie uma pergunta ao vendedor — respondemos em poucos minutos.`,
  ];
}

/** Grupos extras de especificações comuns a todos os produtos. */
export function genericSpecGroups(p: Product): { title: string; rows: [string, string][] }[] {
  return [
    {
      title: "Informações do anúncio",
      rows: [
        ["Código do anúncio", p.id],
        ["Categoria", p.category],
        ["Condição", "Novo"],
        ["Nota fiscal", "Sim, emitida para todos os pedidos"],
        ["Unidades vendidas", "+500 mil"],
      ],
    },
    {
      title: "Envio e entrega",
      rows: [
        ["Tipo de envio", "Mercado Envios FULL"],
        ["Prazo estimado", "1 a 5 dias úteis"],
        ["Frete grátis", "Acima de R$ 19"],
        ["Rastreamento", "Sim, pelo aplicativo"],
        ["Origem", "Nacional"],
      ],
    },
    {
      title: "Garantia e devolução",
      rows: [
        ["Garantia de fábrica", "12 meses"],
        ["Devolução grátis", "Sim, em até 30 dias"],
        ["Compra Garantida", "Sim"],
        ["Suporte", "Atendimento pela plataforma"],
      ],
    },
    {
      title: "Pagamento",
      rows: [
        ["Pix", "Aprovação imediata"],
        ["Cartão de crédito", "Parcelamento disponível"],
        ["Boleto", "Não disponível nesta oferta"],
        ["Preço promocional", `R$ ${p.newPrice}`],
      ],
    },
  ];
}
