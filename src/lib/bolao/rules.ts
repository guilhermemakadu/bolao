export const TIEBREAKER_OPTIONS = ["most_exact_scores"] as const;

export type TiebreakerOption = (typeof TIEBREAKER_OPTIONS)[number];

export type BolaoModes = {
  exactScore: boolean;
  result: boolean;
  tournamentExtras: boolean;
};

export type BolaoPoints = {
  exactScore: number;
  result: number;
  champion: number;
  topScorer: number;
};

export type BolaoRules = {
  modes: BolaoModes;
  points: BolaoPoints;
  tiebreaker: TiebreakerOption;
};

export const DEFAULT_BOLAO_RULES: BolaoRules = {
  modes: {
    exactScore: true,
    result: false,
    tournamentExtras: false,
  },
  points: {
    exactScore: 5,
    result: 3,
    champion: 10,
    topScorer: 10,
  },
  tiebreaker: "most_exact_scores",
};

export function isValidBolaoRules(value: unknown): value is BolaoRules {
  if (!value || typeof value !== "object") return false;
  const rules = value as BolaoRules;
  return (
    typeof rules.modes?.exactScore === "boolean" &&
    typeof rules.modes?.result === "boolean" &&
    typeof rules.modes?.tournamentExtras === "boolean" &&
    typeof rules.points?.exactScore === "number" &&
    typeof rules.points?.result === "number" &&
    typeof rules.points?.champion === "number" &&
    typeof rules.points?.topScorer === "number" &&
    TIEBREAKER_OPTIONS.includes(rules.tiebreaker)
  );
}

export function hasAtLeastOneMode(modes: BolaoModes): boolean {
  return modes.exactScore || modes.result || modes.tournamentExtras;
}
