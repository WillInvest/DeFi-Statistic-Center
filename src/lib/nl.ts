export type NlResult = { sql: string } | { error: string };

export async function nlToQuery(prompt: string): Promise<NlResult> {
  const r = await fetch('/api/nl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const text = await r.text();
  if (!r.ok) {
    let msg = text || `HTTP ${r.status}`;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* keep text */
    }
    return { error: msg };
  }
  try {
    const data = JSON.parse(text) as { sql?: string };
    return data.sql ? { sql: data.sql } : { error: 'No SQL returned' };
  } catch {
    return { error: 'Invalid response from /api/nl' };
  }
}
