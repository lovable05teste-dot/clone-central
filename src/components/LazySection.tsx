import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Monta o conteúdo apenas quando a seção se aproxima da viewport.
 * Reserva altura mínima (evita CLS) e mantém o thread principal livre
 * no carregamento inicial (melhora TBT/INP).
 */
export function LazySection({
  children,
  minHeight = 320,
  rootMargin = "600px",
}: {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          const mount = () => setShow(true);
          if ("requestIdleCallback" in window) {
            (window as unknown as { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void })
              .requestIdleCallback(mount, { timeout: 300 });
          } else {
            requestAnimationFrame(mount);
          }
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return <div ref={ref} style={show ? undefined : { minHeight }}>{show ? children : null}</div>;
}

export default LazySection;
