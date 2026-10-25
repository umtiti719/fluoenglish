// Fluo · yapay zekâ çevirisi (Supabase Edge Function: "ceviri")
// Giriş yapmış kullanıcının isteğini Claude'a iletir. Anthropic anahtarı yalnızca burada,
// Supabase'in gizli değişkeninde (ANTHROPIC_API_KEY) durur; sitede görünmez.
// Kişi başı günlük sınır veritabanındaki ai_kullan() fonksiyonuyla tutulur (belgeler/yapay-zeka.sql).
import { createClient } from "jsr:@supabase/supabase-js@2";

const GUNLUK_SINIR = 100;
const MODEL = "claude-haiku-5-5";
const SISTEM =
  "Sen Fluo adlı, Türkçe konuşanlara İngilizce öğreten uygulamanın çeviri yardımcısısın. " +
  "Yalnızca İngilizce–Türkçe çeviri, kelime anlamı, örnek cümle ve çeviri değerlendirmesi isteklerine cevap ver. " +
  "Bunların dışındaki isteklere (sohbet, kod, ödev yazma vb.) yalnızca boş bir cevap ver. " +
  "İstekteki biçim kurallarına tam olarak uy.";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const yanit = (govde: unknown, durum = 200) =>
  new Response(JSON.stringify(govde), { status: durum, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return yanit({ error: "yontem" }, 405);
  try {
    // 1) Kullanıcıyı doğrula
    const yetki = req.headers.get("Authorization") ?? "";
    const anahtar = req.headers.get("apikey") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, anahtar, { global: { headers: { Authorization: yetki } } });
    const { data: { user } } = await sb.auth.getUser(yetki.replace(/^Bearer\s+/i, ""));
    if (!user) return yanit({ error: "giris" }, 401);

    // 2) İsteği kontrol et
    const { prompt, json } = await req.json().catch(() => ({}));
    if (typeof prompt !== "string" || prompt.length < 2 || prompt.length > 4000) return yanit({ error: "istek" }, 400);

    // 3) Günlük sınır (sayaç bir artar; sınır dolduysa -1 döner)
    const { data: sayi, error: sayacHata } = await sb.rpc("ai_kullan", { sinir: GUNLUK_SINIR });
    if (sayacHata) return yanit({ error: "sayac", detay: sayacHata.message }, 500);
    if (typeof sayi !== "number" || sayi < 0) return yanit({ error: "limit", limit: GUNLUK_SINIR }, 429);

    // 4) Claude'a sor
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: SISTEM + (json ? " Cevabını yalnızca geçerli JSON olarak ver; kod bloğu ya da açıklama ekleme." : ""),
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!r.ok) return yanit({ error: "ai", durum: r.status }, 502);
    const d = await r.json();
    const text = (d.content ?? []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("").trim();
    return yanit({ text, kalan: Math.max(0, GUNLUK_SINIR - sayi) });
  } catch (_e) {
    return yanit({ error: "sunucu" }, 500);
  }
});
