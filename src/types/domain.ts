export type Confederation = 'CONMEBOL' | 'CONCACAF' | 'UEFA' | 'CAF' | 'AFC' | 'OFC';

export type Team = {
  code: string;
  name: string;
  isoCountry: string;
  confederation: Confederation;
  kitHome: string;
  kitAway: string;
  group?: string;
  host?: boolean;
};

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export type Player = {
  id: string;
  name: string;
  number: number | null;
  position: PlayerPosition;
  birthDate?: string;
  /** Edad reportada (alternativa a birthDate cuando solo se conoce edad pública). */
  age?: number;
  /** Club al momento de la convocatoria. */
  club?: string;
  teamCode: string;
};

export type MediaKind = 'image' | 'video';

export type MediaAsset = {
  id: string;
  playerId: string;
  kind: MediaKind;
  mimeType: string;
  filename: string;
  sizeBytes: number;
  createdAt: number;
  storageKey: string;
};

export type TeamsFile = {
  tournament: {
    id: string;
    name: string;
    hosts: string[];
    startDate: string;
    endDate: string;
    note: string;
  };
  teams: Team[];
};

export type RostersFile = {
  note: string;
  rosters: Record<string, Omit<Player, 'teamCode'>[]>;
};
