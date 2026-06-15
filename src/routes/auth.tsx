import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Pixel Vault Games" },
      { name: "description", content: "Cadastre-se ou faça login na Pixel Vault Games." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setMsg({ type: "ok", text: "Cadastro realizado! Verifique seu e-mail para confirmar." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      }
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Erro inesperado" });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setMsg({ type: "err", text: "Falha no login com Google" });
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4 py-12"
          style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(0,255,136,0.08), transparent 60%)" }}>
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/30 bg-neutral-900/80 backdrop-blur p-8 shadow-[0_0_40px_rgba(0,255,136,0.15)]">
        <Link to="/" className="text-emerald-400 text-sm hover:underline">← Voltar à loja</Link>
        <h1 className="mt-4 text-3xl font-bold text-emerald-400" style={{ textShadow: "0 0 12px rgba(0,255,136,0.5)" }}>
          {mode === "signin" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          {mode === "signin" ? "Acesse sua conta Pixel Vault" : "Junte-se à Pixel Vault Games"}
        </p>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-white text-neutral-900 font-semibold py-2.5 hover:bg-neutral-100 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.2 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.8 6.4 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.8 6.4 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5 0 9.6-1.9 13-5l-6-5.1c-1.9 1.4-4.3 2.1-7 2.1-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C8.9 38.9 15.9 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2.1-2.1 3.9-3.9 5.3l6 5.1c-.4.4 6.6-4.8 6.6-14.4 0-1.2-.1-2.3-.4-3.5z"/></svg>
          Continuar com Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-neutral-500">
          <div className="h-px flex-1 bg-neutral-700" /> ou <div className="h-px flex-1 bg-neutral-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="text-sm text-neutral-300">Nome completo</label>
              <input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={100}
                className="mt-1 w-full rounded-lg bg-neutral-800 border border-neutral-700 focus:border-emerald-500 focus:outline-none px-3 py-2 text-white"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm text-neutral-300">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg bg-neutral-800 border border-neutral-700 focus:border-emerald-500 focus:outline-none px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-neutral-300">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg bg-neutral-800 border border-neutral-700 focus:border-emerald-500 focus:outline-none px-3 py-2 text-white"
            />
          </div>

          {msg && (
            <div
              role="alert"
              aria-live="polite"
              className={`text-sm rounded-md px-3 py-2 ${msg.type === "ok" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-red-500/15 text-red-300 border border-red-500/30"}`}
            >
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-green-400 text-neutral-900 font-bold py-2.5 hover:brightness-110 disabled:opacity-50"
            style={{ boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
          >
            {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-400">
          {mode === "signin" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
          <button
            type="button"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }}
            className="text-emerald-400 hover:underline font-semibold"
          >
            {mode === "signin" ? "Criar conta" : "Entrar"}
          </button>
        </p>
      </div>
    </main>
  );
}
