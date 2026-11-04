// Small display helpers shared by storefront components.
import { PLACEHOLDER_IMAGE } from "@/lib/images";
import { STORE } from "@/lib/store-info";
import { formatEuro } from "@/lib/format";
import { useLanguage } from "@/lib/i18n";

export const MAP_URL = STORE.mapUrl;
export const PHONE = STORE.phoneDisplay;
export const PHONE_LINK = `tel:${STORE.phoneE164}`;

/** Swaps a photo that fails to load for the camel-on-sand placeholder instead of a broken-image icon. */
export function imageFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "1";
  img.src = PLACEHOLDER_IMAGE;
}

export function slotLabel(slot: { date: string; start: string; end: string }, language: string) {
  const d = new Date(`${slot.date}T12:00:00Z`).toLocaleDateString(language === "de" ? "de-DE" : "en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
  return `${d}, ${slot.start}–${slot.end}`;
}

/** Price formatter in the page language: "43,89 €" in German, "€43.89" in English. */
export function useEuro() {
  const { language } = useLanguage();
  return (n: number) => formatEuro(n, language);
}
