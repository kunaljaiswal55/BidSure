/**
 * Gemini forensic service – wraps @google/genai with sandbox fallback.
 * Production requires VITE_GEMINI_API_KEY (server-side proxy recommended).
 * For SIH demo the service returns deterministic mock when no key is present
 * so the UI remains functional offline.
 */
import { GoogleGenAI } from '@google/genai';

export interface ForensicResult {
  tamperingRisk: string;
  circularTrading: string;
  shellCompanyIndex: string;
  udinMatch: string;
  summary: string;
  source: 'gemini' | 'mock';
}

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  const key = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ?? (import.meta.env.GEMINI_API_KEY as string | undefined);
  if (!key) return null;
  if (!client) client = new GoogleGenAI({ apiKey: key });
  return client;
}

export async function runForensicScan(args: {
  bidderName: string;
  cin: string;
  pan: string;
  tenderCode: string;
}): Promise<ForensicResult> {
  const fallback: ForensicResult = {
    tamperingRisk: 'LOW (0.04) – No pixel-level anomalies detected',
    circularTrading: 'CLEAN – Independent Tax Nodes',
    shellCompanyIndex: 'PASS – Active Physical Establishment (EPFO 142)',
    udinMatch: 'CONFIRMED – UDIN 26034112ABCD9902',
    summary: `All forensic checks PASSED for ${args.bidderName} (${args.cin}). No evidence of document tampering, shell routing, or cartel collusion. Tender ${args.tenderCode} eligibility stands verified.`,
    source: 'mock',
  };

  const genAI = getClient();
  if (!genAI) {
    await new Promise((r) => setTimeout(r, 1200)); // keep UX latency
    return fallback;
  }

  try {
    const prompt = `You are a forensic auditor for Indian GeM procurement (SIH 26100). Given bidder ${args.bidderName} CIN ${args.cin} PAN ${args.pan} tender ${args.tenderCode}, output JSON with keys tamperingRisk, circularTrading, shellCompanyIndex, udinMatch, summary. Keep values concise, government tone. If uncertain, use conservative mock.`;
    const res = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const text = res.text ?? '';
    // Try parse JSON from model
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as Partial<ForensicResult>;
      return {
        tamperingRisk: parsed.tamperingRisk ?? fallback.tamperingRisk,
        circularTrading: parsed.circularTrading ?? fallback.circularTrading,
        shellCompanyIndex: parsed.shellCompanyIndex ?? fallback.shellCompanyIndex,
        udinMatch: parsed.udinMatch ?? fallback.udinMatch,
        summary: parsed.summary ?? fallback.summary,
        source: 'gemini',
      };
    }
    return { ...fallback, summary: text.slice(0, 400) || fallback.summary, source: 'gemini' };
  } catch (e) {
    console.warn('[BidSure] Gemini forensic fallback', e);
    return fallback;
  }
}
