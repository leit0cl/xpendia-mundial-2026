import type { Player, RostersFile, Team, TeamsFile } from '@/types/domain';

// `cache: 'no-cache'` fuerza al browser a revalidar con el server vía
// If-Modified-Since/ETag en cada carga. En dev el JSON siempre llega fresh
// (Vite responde 200 con el contenido nuevo); en prod, el CDN devuelve 304
// si nada cambió, así que es prácticamente gratis.
const FETCH_OPTS: RequestInit = { cache: 'no-cache' };

export async function loadTeams(): Promise<Team[]> {
  const res = await fetch('/data/teams-2026.json', FETCH_OPTS);
  if (!res.ok) throw new Error(`Error cargando teams-2026.json: ${res.status}`);
  const data: TeamsFile = await res.json();
  return data.teams;
}

export async function loadRosters(): Promise<Record<string, Player[]>> {
  const res = await fetch('/data/rosters-2026.json', FETCH_OPTS);
  if (!res.ok) throw new Error(`Error cargando rosters-2026.json: ${res.status}`);
  const data: RostersFile = await res.json();
  const out: Record<string, Player[]> = {};
  for (const [teamCode, list] of Object.entries(data.rosters)) {
    out[teamCode] = list.map((p) => ({ ...p, teamCode }));
  }
  return out;
}
