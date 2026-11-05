import { normalize } from "./text";

const FORBIDDEN: { label: string; pattern: RegExp }[] = [
  { label: "remboursement", pattern: /rembours\w*|refund\w*|rückerstatt\w*|erstatten/gi },
  { label: "geste commercial", pattern: /geste commercial|goodwill|kulanz/gi },
  { label: "réduction", pattern: /réduction|rabais|ristourne|code promo|bon d'achat|discount|voucher|rabatt|gutschein/gi },
  { label: "gratuité", pattern: /gratuit\w*|offert\w*|sans frais|aucun frais|free of charge|for free|kostenlos|gratis/gi },
  { label: "prise en charge", pattern: /(nous|on) (prenons|prendrons|prendra) en charge|dédommag\w*|indemnis\w*|compensat\w*|we will cover|übernehmen (wir )?die kosten/gi },
  { label: "garantie", pattern: /garanti\w*|nous vous (assurons|promettons)|guarantee\w*|we promise|versprechen|garantier\w*/gi },
  { label: "annulation des frais", pattern: /(annul\w*|supprim\w*) (les|des|vos|ces) frais|ne (vous )?sera pas factur\w*|waive\w*/gi },
];

export type PromiseHit = { label: string; text: string };

export function findForbiddenPromises(reply: string, allowedSources: string[]): PromiseHit[] {
  const allowed = normalize(allowedSources.join(" "));
  const hits: PromiseHit[] = [];
  for (const { label, pattern } of FORBIDDEN) {
    for (const match of reply.matchAll(pattern)) {
      const stem = normalize(match[0]).slice(0, 7);
      if (!allowed.includes(stem)) hits.push({ label, text: match[0] });
    }
  }
  return hits;
}
