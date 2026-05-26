import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadRosters, loadTeams } from '@/services/rosters/rostersService';
import type { Confederation, Player, Team } from '@/types/domain';

type RostersState =
  | { status: 'loading' }
  | { status: 'ready'; teams: Team[]; rosters: Record<string, Player[]> }
  | { status: 'error'; error: Error };

type RostersApi = RostersState & {
  getTeam: (code: string) => Team | undefined;
  getRoster: (teamCode: string) => Player[];
  getPlayer: (playerId: string) => Player | undefined;
  byConfederation: () => Record<Confederation, Team[]>;
};

const RostersContext = createContext<RostersApi | null>(null);

export function RostersProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RostersState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadTeams(), loadRosters()])
      .then(([teams, rosters]) => {
        if (!cancelled) setState({ status: 'ready', teams, rosters });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ status: 'error', error });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const api = useMemo<RostersApi>(() => {
    if (state.status !== 'ready') {
      return {
        ...state,
        getTeam: () => undefined,
        getRoster: () => [],
        getPlayer: () => undefined,
        byConfederation: () => ({}) as Record<Confederation, Team[]>,
      };
    }
    const { teams, rosters } = state;
    return {
      ...state,
      getTeam: (code) => teams.find((t) => t.code === code),
      getRoster: (teamCode) => rosters[teamCode] ?? [],
      getPlayer: (playerId) => {
        for (const list of Object.values(rosters)) {
          const p = list.find((x) => x.id === playerId);
          if (p) return p;
        }
        return undefined;
      },
      byConfederation: () => {
        const out: Record<Confederation, Team[]> = {
          CONMEBOL: [],
          CONCACAF: [],
          UEFA: [],
          CAF: [],
          AFC: [],
          OFC: [],
        };
        for (const t of teams) out[t.confederation].push(t);
        return out;
      },
    };
  }, [state]);

  return <RostersContext.Provider value={api}>{children}</RostersContext.Provider>;
}

export function useRosters() {
  const ctx = useContext(RostersContext);
  if (!ctx) throw new Error('useRosters debe usarse dentro de RostersProvider');
  return ctx;
}
