/* Server Express untuk Bento Ceria! — melayani API Gemini (gemini-2.5-flash) dan frontend Vite */
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const GEMINI_TIMEOUT_MS = 8000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Gemini request timeout')), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

interface BentoItemInput {
  id: string;
  name: string;
  category: string;
  health_status: 'makanan_super' | 'camilan_sesekali';
}

interface EvaluateBentoBody {
  animalName?: string;
  selectedItems?: BentoItemInput[];
  healthyCandidates?: Array<{ id: string; name: string }>;
}

interface GenerateRiddleBody {
  gameType?: 'tebak_makanan' | 'sortir' | 'kebersihan';
  targetItem?: {
    id: string;
    name: string;
    category: string;
    color: string;
    kid_benefit: string;
  };
  extraLabel?: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, hasGeminiKey: Boolean(getGeminiClient()) });
  });

  /* Evaluasi susunan kotak bekal anak pada mini-game Rakit Bento Sehat */
  app.post('/api/evaluate-bento', async (req, res) => {
    const body = (req.body || {}) as EvaluateBentoBody;
    const selectedItems = Array.isArray(body.selectedItems) ? body.selectedItems : [];
    const animalName = typeof body.animalName === 'string' && body.animalName.trim()
      ? body.animalName.trim()
      : 'Riko Kelinci';
    const healthyCandidates = Array.isArray(body.healthyCandidates) ? body.healthyCandidates : [];

    if (selectedItems.length === 0) {
      res.status(400).json({ error: 'Daftar makanan bekal tidak boleh kosong.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY belum tersedia di server.',
        fallbackRecommended: true,
      });
      return;
    }

    const superCount = selectedItems.filter((item) => item.health_status === 'makanan_super').length;
    const hasProduce = selectedItems.some(
      (item) => item.category === 'sayur' || item.category === 'buah',
    );
    const computedStatus = superCount >= 3 && hasProduce ? 'bento_sempurna' : 'perlu_tukar_lembut';
    const computedExpression = computedStatus === 'bento_sempurna' ? 'bersorak' : 'berpikir';

    const candidateListText = healthyCandidates
      .map((c) => `${c.id} (${c.name})`)
      .join(', ');

    const systemInstruction = [
      'Kamu adalah Koki Moomoo, seekor sapi lucu bertopi koki yang ramah untuk anak TK usia 4-6 tahun di Indonesia.',
      'Gunakan bahasa Indonesia sangat sederhana, hangat, dan positif.',
      'DILARANG keras memakai kata: kalah, salah, gagal, jahat, racun, jelek, atau tidak boleh.',
      'Balas maksimal 2 kalimat pendek (maksimal 20 kata total) yang enak dibacakan dengan suara lantang.',
      'Jika status adalah bento_sempurna, puji susunan bekalnya dengan ceria untuk teman hewan.',
      'Jika status adalah perlu_tukar_lembut, puji usaha anak terlebih dahulu lalu sarankan menukar 1 camilan manis/asin dengan 1 makanan sehat dari daftar kandidat.',
    ].join(' ');

    const prompt = [
      `Teman hewan: ${animalName}.`,
      `Isi kotak bekal anak: ${selectedItems.map((i) => `${i.name} [${i.category}, ${i.health_status}]`).join(', ')}.`,
      `Jumlah Makanan Super: ${superCount} dari ${selectedItems.length}. Ada sayur/buah: ${hasProduce ? 'Ya' : 'Belum'}.`,
      `Status wajib: ${computedStatus}. Ekspresi wajib: ${computedExpression}.`,
      candidateListText ? `Kandidat pengganti sehat (pilih satu id jika perlu_tukar_lembut): ${candidateListText}.` : '',
    ].join('\n');

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                moomoo_voice_text: {
                  type: Type.STRING,
                  description: 'Kalimat pujian dan saran hangat maksimal 2 kalimat pendek (maks 20 kata).',
                },
                suggested_swap_id: {
                  type: Type.STRING,
                  description: 'Salah satu id kandidat makanan sehat jika perlu_tukar_lembut, atau string kosong jika bento_sempurna.',
                },
              },
              required: ['moomoo_voice_text', 'suggested_swap_id'],
            },
          },
        }),
        8000,
      );

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText) as {
        moomoo_voice_text?: string;
        suggested_swap_id?: string;
      };

      const validSwapIds = new Set(healthyCandidates.map((c) => c.id));
      const safeSwapId =
        computedStatus === 'perlu_tukar_lembut' &&
        typeof parsed.suggested_swap_id === 'string' &&
        validSwapIds.has(parsed.suggested_swap_id)
          ? parsed.suggested_swap_id
          : computedStatus === 'perlu_tukar_lembut'
            ? (healthyCandidates[0]?.id ?? null)
            : null;

      res.json({
        status: computedStatus,
        mascot_expression: computedExpression,
        moomoo_voice_text:
          typeof parsed.moomoo_voice_text === 'string' && parsed.moomoo_voice_text.trim().length > 0
            ? parsed.moomoo_voice_text.trim()
            : 'Wah, bekal buatanmu seru sekali! Ayo tambahkan sayur atau buah agar makin kuat.',
        suggested_swap_id: safeSwapId,
        source: 'gemini',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghubungi Gemini API';
      res.status(502).json({
        error: message,
        fallbackRecommended: true,
      });
    }
  });

  /* Membuat variasi teka-teki & cerita pendek ramah anak untuk mini-game lainnya */
  app.post('/api/generate-riddle', async (req, res) => {
    const body = (req.body || {}) as GenerateRiddleBody;
    const gameType = body.gameType ?? 'tebak_makanan';
    const targetItem = body.targetItem;

    if (!targetItem || !targetItem.name) {
      res.status(400).json({ error: 'Data makanan target diperlukan.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY belum tersedia di server.',
        fallbackRecommended: true,
      });
      return;
    }

    const systemInstruction = [
      'Kamu adalah Koki Moomoo, sapi bertopi koki yang ceria untuk anak TK usia 4-6 tahun.',
      'Gunakan bahasa Indonesia sangat sederhana, ceria, dan maksimal 2 kalimat pendek (maks 20 kata).',
      'DILARANG menyebut nama makanannya langsung jika diminta membuat teka-teki.',
      'DILARANG memakai kata menakutkan atau negatif seperti racun, jahat, salah, kalah.',
    ].join(' ');

    const prompt =
      gameType === 'tebak_makanan'
        ? `Buatlah teka-teki suara singkat dengan 3 petunjuk (warna ${targetItem.color}, bentuk/rasa, dan manfaatnya) untuk makanan "${targetItem.name}". Jangan sebut kata "${targetItem.name}" di dalam teka-teki!`
        : `Buatlah 1 kalimat cerita pendek yang ceria tentang manfaat atau aturan makan "${targetItem.name}" (${targetItem.category}) untuk anak TK. Info dasar: ${targetItem.kid_benefit}`;

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                voice_text: {
                  type: Type.STRING,
                  description: 'Teka-teki atau cerita pendek maksimal 2 kalimat (maks 20 kata).',
                },
                fun_fact: {
                  type: Type.STRING,
                  description: 'Kalimat pujian dan fakta seru 1 kalimat setelah anak berhasil menebak.',
                },
              },
              required: ['voice_text', 'fun_fact'],
            },
          },
        }),
        GEMINI_TIMEOUT_MS,
      );

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText) as {
        voice_text?: string;
        fun_fact?: string;
      };

      res.json({
        voice_text: parsed.voice_text?.trim() || '',
        fun_fact: parsed.fun_fact?.trim() || targetItem.kid_benefit,
        source: 'gemini',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal membuat variasi cerita';
      res.status(502).json({
        error: message,
        fallbackRecommended: true,
      });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bento Ceria! server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
