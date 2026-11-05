export const HOURLY_RATE = 43.9;

export const VISITS_PER_YEAR = {
  chaque_semaine: 52,
  deux_semaines: 26,
  quatre_semaines: 13,
} as const;

export type Frequency = keyof typeof VISITS_PER_YEAR;

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  chaque_semaine: "chaque semaine",
  deux_semaines: "toutes les deux semaines",
  quatre_semaines: "toutes les quatre semaines",
};

export function monthlyCost(hours: number, frequency: Frequency, rate = HOURLY_RATE): number {
  return Math.round((hours * rate * VISITS_PER_YEAR[frequency]) / 12);
}

export function formatHours(hours: number): string {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return minutes ? `${whole} h ${String(minutes).padStart(2, "0")}` : `${whole} h`;
}
