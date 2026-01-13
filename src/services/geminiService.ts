import { GoogleGenAI } from "@google/genai";
import { JOB_PROFILES_TEXT } from "../constants";
import { AnalysisResponseSchema, CareerRelevance } from "../types";

let client: GoogleGenAI | null = null;

export const initializeGemini = (apiKey: string) => {
  client = new GoogleGenAI({ apiKey });
};

export const isGeminiInitialized = () => client !== null;

const getClient = () => {
  if (!client) throw new Error("API Key not set");
  return client;
};

const timeoutPromise = <T,>(ms: number, promise: Promise<T>): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
};

export const analyzeRoom = async (
  roomName: string,
  signal?: AbortSignal
): Promise<{ metadata: AnalysisResponseSchema['metadata']; analysis: CareerRelevance[] }> => {
  if (signal?.aborted) throw new Error("Aborted");
  
  const ai = getClient();

  const prompt = `
Du bist ein Cybersecurity-Experte und analysierst TryHackMe Räume.

Analysiere den TryHackMe Raum mit dem Namen "${roomName}".

1. Metadata:
- Gib eine kurze Zusammenfassung (summary) auf Deutsch (max 180 Zeichen).
- Eine etwas längere Beschreibung (description) auf Deutsch (max 450 Zeichen).
- Schwierigkeit (difficulty): Info/Easy/Medium/Hard/Insane.
- Hauptkategorie (mainCategory): z.B. Windows/AD, Linux, Network, Cloud, Web, Malware/RE, Blue Team/DFIR, Other.
- Umgebung (environment): z.B. Windows, Linux, Mixed.
- Key Takeaways (keyTakeaways): 3-6 Bulletpoints als Text.
- Zeitschätzung (timeEstimate): z.B. "2-4h".
- Typ (type): Walkthrough oder Challenge.
- Optional Release Date (releaseDate) wenn bekannt.
- Tags (tags): 6-14 relevante Tags.
- Tools (tools): 3-10 relevante Tools/Technologien.

2. Career Relevance:
Bewerte die Relevanz dieses Raums für jedes der folgenden Teams (0-10):
${JOB_PROFILES_TEXT}

Gib für jedes Team:
- score (0-10)
- reason (kurz, 1-2 Sätze auf Deutsch)

WICHTIG: Antworte NUR mit validem JSON in genau diesem Schema:
{
  "metadata": {
    "summary": "...",
    "description": "...",
    "difficulty": "Easy",
    "tags": ["..."],
    "tools": ["..."],
    "mainCategory": "Windows/AD",
    "environment": "Windows",
    "keyTakeaways": "- ...\n- ...",
    "timeEstimate": "2-4h",
    "type": "Walkthrough",
    "releaseDate": "YYYY-MM-DD"
  },
  "analysis": {
    "windowsClient": {"score": 0, "reason": "..."},
    "windowsServer": {"score": 0, "reason": "..."},
    "network": {"score": 0, "reason": "..."},
    "dba": {"score": 0, "reason": "..."},
    "linux": {"score": 0, "reason": "..."}
  }
}
`;

  try {
    if (signal?.aborted) throw new Error("Aborted");
    
    const response = await timeoutPromise(30000, ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    }));

    if (signal?.aborted) throw new Error("Aborted");

    let text = response.text;
    if (!text) throw new Error("Keine Antwort von der KI");
    
    text = text.replace(/```json/g, '').replace(/```/g, '');

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');

    if (start === -1 || end === -1 || start > end) {
      console.error("Invalid Response Text:", text);
      throw new Error("Antwort enthält kein valides JSON");
    }

    const jsonString = text.substring(start, end + 1);

    let data: AnalysisResponseSchema;
    try {
      data = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parse Error. Extracted String:", jsonString);
      throw new Error("Antwort enthält ungültiges JSON");
    }

    if (!data.metadata) throw new Error("Antwort fehlt metadata");
    if (!data.analysis) throw new Error("Antwort fehlt analysis");

    // Ensure required arrays
    data.metadata.tags = Array.isArray(data.metadata.tags) ? data.metadata.tags : [];
    data.metadata.tools = Array.isArray(data.metadata.tools) ? data.metadata.tools : [];

    // Truncate long fields
    if (data.metadata.summary && data.metadata.summary.length > 180) {
      data.metadata.summary = data.metadata.summary.substring(0, 177) + '...';
    }
    if (data.metadata.description && data.metadata.description.length > 450) {
      data.metadata.description = data.metadata.description.substring(0, 447) + '...';
    }
    if (data.metadata.keyTakeaways && data.metadata.keyTakeaways.length > 800) {
      data.metadata.keyTakeaways = data.metadata.keyTakeaways.substring(0, 797) + '...';
    }
    if (data.metadata.timeEstimate && data.metadata.timeEstimate.length > 15) {
      data.metadata.timeEstimate = data.metadata.timeEstimate.substring(0, 15) + '...';
    }

    // Normalize type
    const typeLower = (data.metadata.type || '').toLowerCase();
    if (typeLower.includes('ctf') || typeLower.includes('challenge')) {
      data.metadata.type = 'Challenge';
    } else {
      data.metadata.type = 'Walkthrough';
    }

    // Convert analysis object to array
    const analysisArray: CareerRelevance[] = [
      { jobId: 'windowsClient', score: data.analysis.windowsClient?.score ?? 0, reason: data.analysis.windowsClient?.reason ?? '' },
      { jobId: 'windowsServer', score: data.analysis.windowsServer?.score ?? 0, reason: data.analysis.windowsServer?.reason ?? '' },
      { jobId: 'network', score: data.analysis.network?.score ?? 0, reason: data.analysis.network?.reason ?? '' },
      { jobId: 'dba', score: data.analysis.dba?.score ?? 0, reason: data.analysis.dba?.reason ?? '' },
      { jobId: 'linux', score: data.analysis.linux?.score ?? 0, reason: data.analysis.linux?.reason ?? '' },
    ];

    return { metadata: data.metadata, analysis: analysisArray };

  } catch (error) {
    if (signal?.aborted) throw new Error("Aborted");
    console.error("Gemini Analyse Fehler:", error);
    throw error;
  }
};
