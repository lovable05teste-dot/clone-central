import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { captureUtms } from "../lib/utm";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jogo de Panelas Antiaderente 10 Peças" },
      { name: "description", content: "Oferta de jogo de panelas antiaderente com frete grátis, avaliações e produtos relacionados." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Jogo de Panelas Antiaderente 10 Peças" },
      { property: "og:description", content: "Oferta de jogo de panelas antiaderente com frete grátis, avaliações e produtos relacionados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Jogo de Panelas Antiaderente 10 Peças" },
      { name: "twitter:description", content: "Oferta de jogo de panelas antiaderente com frete grátis, avaliações e produtos relacionados." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/aa1807fb-ea33-4a60-8091-6c5467de5669/id-preview-381c2d80--0989b885-61c7-4789-94e0-5e2e83a22aff.lovable.app-1785216312300.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/aa1807fb-ea33-4a60-8091-6c5467de5669/id-preview-381c2d80--0989b885-61c7-4789-94e0-5e2e83a22aff.lovable.app-1785216312300.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://cdn.utmify.com.br", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://tracking.utmify.com.br", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://i.postimg.cc", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://i.imgur.com" },
      { rel: "dns-prefetch", href: "https://i.ibb.co" },
      { rel: "dns-prefetch", href: "https://connect.facebook.net" },
      { rel: "dns-prefetch", href: "https://go.fortpayplataforma.com.br" },
    ],
    scripts: [
      {
        // Pixel Utmify — carregado fora do caminho crítico (idle / primeira interação),
        // sem perder eventos: o pixelId é definido imediatamente.
        children:
          'window.pixelId = "6a5adf30a9b7f7643b523796";(function(){var done=false;function load(){if(done)return;done=true;["https://cdn.utmify.com.br/scripts/pixel/pixel.js","https://cdn.utmify.com.br/scripts/utms/latest.js"].forEach(function(src,i){var s=document.createElement("script");s.async=true;s.defer=true;s.src=src;if(i===1){s.setAttribute("data-utmify-prevent-xcod-sck","");s.setAttribute("data-utmify-prevent-subids","");}document.head.appendChild(s);});}["pointerdown","keydown","touchstart","scroll"].forEach(function(e){window.addEventListener(e,load,{once:true,passive:true});});function schedule(){if("requestIdleCallback"in window){requestIdleCallback(load,{timeout:2500});}else{setTimeout(load,1200);}}if(document.readyState==="complete"){schedule();}else{window.addEventListener("load",schedule,{once:true});}})();',
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    captureUtms();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
