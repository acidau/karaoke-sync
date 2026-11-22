// POST /api/transcribe — sends a short WAV clip from the page to Whisper and returns the words heard,
// with start/end times in seconds from the start of the clip.
// The API key stays here on the server. Set GROQ_API_KEY in the Vercel project's environment variables.
// Any OpenAI-compatible transcription API works: set TRANSCRIBE_BASE_URL, TRANSCRIBE_MODEL and
// TRANSCRIBE_API_KEY instead.

const BASE_URL = process.env.TRANSCRIBE_BASE_URL || "https://api.groq.com/openai/v1";
const MODEL = process.env.TRANSCRIBE_MODEL || "whisper-large-v3-turbo";
const MAX_BYTES = 1_000_000;          // ~30 s of 16 kHz mono 16-bit WAV; the page sends 8 s (~256 KB)

const json = (body, status = 200, extra = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });

export async function POST(request) {
  const key = process.env.GROQ_API_KEY || process.env.TRANSCRIBE_API_KEY;
  if (!key) return json({ error: "Lyric listening isn't set up yet: add GROQ_API_KEY in the Vercel project settings" }, 503);

  // Only this site's own page may use the key (stops other websites calling it from a browser).
  const origin = request.headers.get("origin");
  if (origin) {
    let ok = false;
    try { ok = new URL(origin).host === request.headers.get("host"); } catch {}
    if (!ok) return json({ error: "Not allowed" }, 403);
  }

  if (!(request.headers.get("content-type") || "").startsWith("audio/wav")) return json({ error: "Send audio/wav" }, 415);
  if (+request.headers.get("content-length") > MAX_BYTES) return json({ error: "Clip too long" }, 413);
  const audio = await request.arrayBuffer();
  if (audio.byteLength > MAX_BYTES) return json({ error: "Clip too long" }, 413);
  if (audio.byteLength < 1000) return json({ error: "Clip too short" }, 400);

  const params = new URL(request.url).searchParams;
  const form = new FormData();
  form.append("file", new Blob([audio], { type: "audio/wav" }), "clip.wav");
  form.append("model", MODEL);
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  form.append("temperature", "0");
  const prompt = (params.get("prompt") || "").slice(0, 500);      // the provider caps prompts at 224 tokens
  if (prompt) form.append("prompt", prompt);
  const lang = params.get("lang");
  if (lang && /^[a-z]{2}$/.test(lang)) form.append("language", lang);

  let res;
  try {
    res = await fetch(`${BASE_URL}/audio/transcriptions`, {
      method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form,
    });
  } catch {
    return json({ error: "Couldn't reach the transcription service" }, 502);
  }
  if (!res.ok) {
    const retry = res.headers.get("retry-after");
    let detail = "";
    try { detail = (await res.json())?.error?.message || ""; } catch {}
    console.error("transcription failed", res.status, detail);
    return json({ error: res.status === 429 ? "Too many requests, slowing down" : "Transcription failed (" + res.status + ")" },
                res.status === 429 ? 429 : 502, retry ? { "Retry-After": retry } : {});
  }

  const data = await res.json();
  const words = (data.words || (data.segments || []).flatMap(s => s.words || []))
    .map(w => ({ word: String(w.word ?? w.text ?? ""), start: +w.start, end: +w.end }))
    .filter(w => w.word.trim() && Number.isFinite(w.start));
  return json({ text: data.text || "", language: data.language || "", words });
}
