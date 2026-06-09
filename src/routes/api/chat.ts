import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM_PROMPT = `Você é o assistente virtual da Pixel Vault Games, uma loja brasileira de jogos e consoles.
Seja amigável, direto e use português do Brasil. Ajude com dúvidas sobre:
- Jogos em destaque, lançamentos e gêneros
- Consoles (PlayStation, Xbox, Nintendo Switch, PC)
- Compatibilidade, especificações e recomendações
- Pagamento, frete (entregamos para todo o Brasil) e prazos
- Trocas, garantia e suporte

Use emojis com moderação 🎮. Mantenha respostas curtas (2-4 frases) sempre que possível.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
