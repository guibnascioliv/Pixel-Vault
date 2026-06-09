import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Gamepad2,
  ShoppingCart,
  X,
  Send,
  MessageCircle,
  Sparkles,
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import switchImg from "@/assets/console-switch.jpg";
import vortexImg from "@/assets/console-vortex.jpg";
import pixeldeckImg from "@/assets/console-pixeldeck.jpg";
import nebulaImg from "@/assets/console-nebula.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pixel Vault Games — Jogos e Consoles" },
      {
        name: "description",
        content:
          "Os melhores jogos e consoles com preços que cabem no seu bolso. Entrega rápida para todo o Brasil.",
      },
      { property: "og:title", content: "Pixel Vault Games" },
      {
        property: "og:description",
        content: "Loja brasileira de jogos e consoles — entrega para todo o Brasil.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
};

const games: Product[] = [
  {
    id: "g1",
    name: "Cyber Drift 2077",
    category: "Ação / RPG",
    price: 199.9,
    oldPrice: 299.9,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
  },
  {
    id: "g2",
    name: "Forest Legends",
    category: "Aventura",
    price: 149.9,
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop",
  },
  {
    id: "g3",
    name: "Neon Racer X",
    category: "Corrida",
    price: 129.9,
    oldPrice: 179.9,
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop",
  },
  {
    id: "g4",
    name: "Galaxy Warfare",
    category: "FPS",
    price: 179.9,
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop",
  },
  {
    id: "g5",
    name: "Shadow Realm",
    category: "Terror / Souls-like",
    price: 219.9,
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
  },
  {
    id: "g6",
    name: "Pixel Kingdoms",
    category: "Estratégia",
    price: 99.9,
    oldPrice: 149.9,
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
  },
  {
    id: "g7",
    name: "Aqua Odyssey",
    category: "Mundo Aberto",
    price: 189.9,
    image:
      "https://images.unsplash.com/photo-1556438064-2d7646166914?w=600&h=400&fit=crop",
  },
  {
    id: "g8",
    name: "Mecha Storm IV",
    category: "Ação",
    price: 159.9,
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=400&fit=crop",
  },
  {
    id: "g9",
    name: "Hyper League",
    category: "Esportes / MOBA",
    price: 89.9,
    oldPrice: 129.9,
    image:
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&h=400&fit=crop",
  },
];

const consoles: Product[] = [
  {
    id: "c1",
    name: "PlayStation 5",
    category: "Sony • 825GB SSD",
    price: 3899.0,
    image:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&h=400&fit=crop",
  },
  {
    id: "c2",
    name: "Xbox Series X",
    category: "Microsoft • 1TB",
    price: 3799.0,
    oldPrice: 4299.0,
    image:
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop",
  },
  {
    id: "c3",
    name: "Nintendo Switch OLED",
    category: "Nintendo • 7\"",
    price: 2499.0,
    image: switchImg,
  },
  {
    id: "c4",
    name: "Vortex One",
    category: "VortexTech • 2TB",
    price: 4599.0,
    oldPrice: 4999.0,
    image: vortexImg,
  },
  {
    id: "c5",
    name: "Pixel Deck",
    category: "Retro Handheld • 512GB",
    price: 1899.0,
    image: pixeldeckImg,
  },
  {
    id: "c6",
    name: "Nebula Cube",
    category: "Stellar • Cloud Gaming",
    price: 2999.0,
    oldPrice: 3499.0,
    image: nebulaImg,
  },
];

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type CartItem = Product & { qty: number };

function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const addToCart = (p: Product) => {
    setCart((c) => {
      const found = c.find((i) => i.id === p.id);
      if (found) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...p, qty: 1 }];
    });
    setCartOpen(true);
  };
  const changeQty = (id: string, delta: number) =>
    setCart((c) =>
      c
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  const removeItem = (id: string) => setCart((c) => c.filter((i) => i.id !== id));

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div
      className="min-h-screen text-slate-100"
      style={{
        fontFamily: "'Exo 2', sans-serif",
        background:
          "radial-gradient(ellipse at top, #0f1f1a 0%, #06090c 60%, #04060a 100%)",
      }}
    >
      <style>{`
        .font-display { font-family: 'Orbitron', monospace; letter-spacing: 0.02em; }
        .neon-green { color: #00ff88; text-shadow: 0 0 8px rgba(0,255,136,0.6), 0 0 24px rgba(0,255,136,0.3); }
        .neon-border { border: 1px solid rgba(0,255,136,0.25); }
        .neon-border:hover { border-color: rgba(0,255,136,0.7); box-shadow: 0 0 24px rgba(0,255,136,0.18); }
        .grid-bg {
          background-image:
            linear-gradient(rgba(0,255,136,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.06) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .btn-green {
          background: linear-gradient(135deg, #00ff88 0%, #00c46a 100%);
          color: #04150f;
          font-weight: 700;
          transition: transform .2s, box-shadow .2s;
        }
        .btn-green:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,255,136,0.35); }
        @keyframes fadeUp { from {opacity:0; transform: translateY(12px);} to {opacity:1; transform:none;} }
        .fade-up { animation: fadeUp .5s ease both; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-30 backdrop-blur bg-black/40 border-b border-emerald-400/15">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 neon-green" />
            <span className="font-display text-xl font-black neon-green">
              PIXEL VAULT
            </span>
          </a>
          <nav className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-wider">
            <a href="#jogos" className="text-emerald-400 hover:text-emerald-300 transition">
              Jogos
            </a>
            <a href="#consoles" className="text-emerald-400 hover:text-emerald-300 transition">
              Consoles
            </a>
            <a href="#ofertas" className="text-emerald-400 hover:text-emerald-300 transition">
              Ofertas
            </a>
          </nav>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-lg hover:bg-emerald-400/10 transition"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="w-6 h-6 text-emerald-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="grid-bg">
        <div className="max-w-7xl mx-auto px-5 py-24 text-center fade-up">
          <p className="text-emerald-400/80 font-semibold tracking-[0.4em] text-xs mb-4">
            ▸ PRESS START
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-black neon-green mb-6">
            NEXT LEVEL GAMING
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-lg mb-8">
            Os melhores jogos e consoles com preços que cabem no seu bolso. Entrega
            rápida para todo o Brasil.
          </p>
          <a
            href="#jogos"
            className="btn-green inline-block px-8 py-3 rounded-full uppercase text-sm tracking-wider"
          >
            Ver Catálogo
          </a>
        </div>
      </section>

      {/* JOGOS */}
      <Section id="jogos" title="Jogos em Destaque" subtitle="Os títulos mais quentes do momento">
        <Carousel>
          {games.map((g) => (
            <ProductCard key={g.id} product={g} onAdd={addToCart} />
          ))}
        </Carousel>
      </Section>

      {/* CONSOLES */}
      <Section id="consoles" title="Consoles" subtitle="A nova geração na sua sala">
        <Carousel>
          {consoles.map((c) => (
            <ProductCard key={c.id} product={c} onAdd={addToCart} />
          ))}
        </Carousel>
      </Section>

      {/* OFERTAS */}
      <Section id="ofertas" title="Ofertas" subtitle="Promoções por tempo limitado 🔥">
        <Carousel>
          {[...games, ...consoles]
            .filter((p) => p.oldPrice)
            .map((p) => (
              <ProductCard key={"o-" + p.id} product={p} onAdd={addToCart} />
            ))}
        </Carousel>
      </Section>

      <footer className="border-t border-emerald-400/15 py-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Pixel Vault Games. Todos os direitos reservados.
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <aside className="w-full max-w-md bg-[#0a1410] border-l border-emerald-400/30 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-emerald-400/15">
              <h3 className="font-display text-lg neon-green">Carrinho</h3>
              <button onClick={() => setCartOpen(false)} aria-label="Fechar">
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {purchased ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 neon-green mx-auto mb-3" />
                  <h4 className="font-display text-xl neon-green">Compra realizada!</h4>
                  <p className="text-slate-400 mt-2">Obrigado pela preferência 🎮</p>
                </div>
              ) : cart.length === 0 ? (
                <p className="text-slate-400 text-center mt-12">Carrinho vazio</p>
              ) : (
                cart.map((i) => (
                  <div
                    key={i.id}
                    className="flex gap-3 p-3 rounded-lg bg-black/40 neon-border"
                  >
                    <img
                      src={i.image}
                      alt=""
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{i.name}</p>
                      <p className="text-emerald-400 text-sm">{brl(i.price)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => changeQty(i.id, -1)}
                          className="p-1 rounded bg-emerald-400/10 hover:bg-emerald-400/20"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{i.qty}</span>
                        <button
                          onClick={() => changeQty(i.id, 1)}
                          className="p-1 rounded bg-emerald-400/10 hover:bg-emerald-400/20"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(i.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {!purchased && (
              <div className="p-5 border-t border-emerald-400/15">
                <div className="flex justify-between mb-3">
                  <span className="text-slate-400">Total</span>
                  <span className="font-display neon-green">{brl(total)}</span>
                </div>
                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    setPurchased(true);
                    setTimeout(() => {
                      setPurchased(false);
                      setCart([]);
                      setCartOpen(false);
                    }, 2200);
                  }}
                  className="btn-green w-full py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* CHAT */}
      <ChatWidget open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-7xl mx-auto px-5 py-16">
      <div className="mb-8">
        <h2 className="font-display text-3xl md:text-4xl font-bold neon-green">
          {title}
        </h2>
        {subtitle && <p className="text-slate-400 mt-2">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Carousel({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const items = Array.isArray(children) ? children : [children];

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-item]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const next = el.scrollLeft + dir * step * 1.5;

    // Looping: jump to the other end when we go past either edge.
    if (dir === 1 && el.scrollLeft >= maxScroll - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (dir === -1 && el.scrollLeft <= 4) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }
    el.scrollTo({
      left: Math.max(0, Math.min(maxScroll, next)),
      behavior: "smooth",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollBy(-1);
    }
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div
        ref={scrollerRef}
        tabIndex={0}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 px-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded-lg"
        aria-label={`${label} — use as setas do teclado para navegar`}
      >
        {items.map((child, i) => (
          <div
            key={i}
            data-carousel-item
            role="group"
            aria-roledescription="slide"
            aria-label={`Item ${i + 1} de ${items.length}`}
            className="snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-[31%] xl:w-[23%]"
          >
            {child}
          </div>
        ))}
      </div>
      <button
        type="button"
        aria-label={`Anterior em ${label}`}
        onClick={() => scrollBy(-1)}
        className="hidden md:flex absolute left-[-18px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full items-center justify-center bg-black/80 border border-emerald-400/40 text-emerald-400 hover:bg-emerald-400 hover:text-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 shadow-lg shadow-emerald-500/20"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={`Próximo em ${label}`}
        onClick={() => scrollBy(1)}
        className="hidden md:flex absolute right-[-18px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full items-center justify-center bg-black/80 border border-emerald-400/40 text-emerald-400 hover:bg-emerald-400 hover:text-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 shadow-lg shadow-emerald-500/20"
      >
        <ChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  return (
    <article className="neon-border rounded-xl overflow-hidden bg-black/40 transition fade-up flex flex-col">
      <div className="aspect-[4/3] overflow-hidden bg-black">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-emerald-400/70 uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          {product.oldPrice && (
            <span className="text-slate-500 line-through text-sm">
              {brl(product.oldPrice)}
            </span>
          )}
          <span className="font-display text-xl neon-green">{brl(product.price)}</span>
        </div>
        <button
          onClick={() => onAdd(product)}
          className="btn-green mt-4 py-2 rounded-full text-sm uppercase tracking-wide"
        >
          Adicionar
        </button>
      </div>
    </article>
  );
}

/* -------------------- CHAT WIDGET -------------------- */

const chatId = "pixel-vault-chat";
const transport = new DefaultChatTransport({ api: "/api/chat" });

function ChatWidget({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const initialMessages = useMemo<UIMessage[]>(
    () => [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Olá! 👋 Sou o assistente da Pixel Vault. Posso te ajudar com dúvidas sobre jogos, consoles, frete ou pagamento. Como posso ajudar?",
          },
        ],
      },
    ],
    [],
  );

  const { messages, sendMessage, status } = useChat({
    id: chatId,
    messages: initialMessages,
    transport,
  });

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-30 btn-green rounded-full p-4 shadow-lg flex items-center gap-2"
          aria-label="Abrir chat de dúvidas"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden sm:inline pr-2 font-semibold">Dúvidas?</span>
        </button>
      )}

      {/* Panel */}
      <div
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-40 w-full sm:w-96 h-[80vh] sm:h-[560px] transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-[120%]"
        }`}
      >
        <div className="flex flex-col h-full bg-[#0a1410] sm:rounded-2xl neon-border shadow-2xl overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-emerald-400/15 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-emerald-400/15 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 neon-green" />
              </div>
              <div>
                <p className="font-display text-sm neon-green leading-tight">
                  Pixel Assist
                </p>
                <p className="text-xs text-slate-400">Online agora</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fechar chat">
              <X className="w-5 h-5 text-slate-300 hover:text-white" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={
                      isUser
                        ? "max-w-[80%] px-3 py-2 rounded-2xl rounded-br-sm bg-emerald-400 text-black text-sm whitespace-pre-wrap"
                        : "max-w-[85%] text-sm text-slate-200 whitespace-pre-wrap"
                    }
                  >
                    {text}
                  </div>
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="text-xs text-emerald-400/70 italic">
                Pixel Assist está digitando…
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="p-3 border-t border-emerald-400/15 bg-black/40 flex gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre jogos, consoles, frete…"
              className="flex-1 bg-black/50 border border-emerald-400/20 focus:border-emerald-400/60 focus:outline-none rounded-full px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="btn-green rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Enviar"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
