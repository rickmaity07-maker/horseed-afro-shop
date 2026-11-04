// Single source of truth for the shop's public business details, as printed on the shop sign.
// Used by the storefront, legal pages, emails and structured data (JSON-LD).

export const STORE = {
  name: "Horseed Afro Shop",
  owner: "Said Mahamud",
  tagline: { de: "Afro Shop: Lebensmittel, Haushalt, Kosmetik & Kleidung", en: "Afro shop: groceries, household, cosmetics & clothing" },
  street: "Schultesstraße 4",
  postalCode: "97421",
  city: "Schweinfurt",
  country: "Germany",
  countryCode: "DE",
  phoneDisplay: "01520 9442155",
  phoneE164: "+4915209442155",
  // TODO: confirm the map pin. Approximate centre of Schultesstraße, Schweinfurt (from the address, not surveyed).
  geo: { lat: 50.0447, lng: 10.2297 },
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Horseed%20Afro%20Shop%2C%20Schultesstra%C3%9Fe%204%2C%2097421%20Schweinfurt",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Schultesstra%C3%9Fe%204%2C%2097421%20Schweinfurt",
  services: [
    { key: "instore", de: "Einkaufen im Laden", en: "In-store shopping" },
    { key: "pickup", de: "Abholung im Laden", en: "Click & collect" },
    { key: "delivery", de: "Lieferung in Schweinfurt und Umgebung", en: "Delivery around Schweinfurt" },
  ],
} as const;

/** 0 = Sunday … 6 = Saturday, same as Date#getDay(). null = closed all day. */
export const OPENING_HOURS: { day: number; de: string; en: string; open: string | null; close: string | null }[] = [
  { day: 1, de: "Montag", en: "Monday", open: "09:00", close: "20:00" },
  { day: 2, de: "Dienstag", en: "Tuesday", open: "09:00", close: "20:00" },
  { day: 3, de: "Mittwoch", en: "Wednesday", open: "09:00", close: "20:00" },
  { day: 4, de: "Donnerstag", en: "Thursday", open: "09:00", close: "20:00" },
  { day: 5, de: "Freitag", en: "Friday", open: "09:00", close: "20:00" },
  { day: 6, de: "Samstag", en: "Saturday", open: "09:00", close: "20:00" },
  { day: 0, de: "Sonntag", en: "Sunday", open: null, close: null }, // Sundays and public holidays closed (shop sign)
];

/** Current open/closed state in the store's own timezone (Europe/Berlin). */
export function storeOpenState(now: Date = new Date()): { open: boolean; closesAt: string | null; nextOpen: string | null } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  const time = `${hh === "24" ? "00" : hh}:${mm}`;

  const today = OPENING_HOURS.find((h) => h.day === day);
  if (today?.open && today.close && time >= today.open && time < today.close) {
    return { open: true, closesAt: today.close, nextOpen: null };
  }
  // Next opening: later today, or the next day that has hours.
  if (today?.open && time < today.open) return { open: false, closesAt: null, nextOpen: today.open };
  for (let i = 1; i <= 7; i++) {
    const next = OPENING_HOURS.find((h) => h.day === (day + i) % 7);
    if (next?.open) return { open: false, closesAt: null, nextOpen: `${next.de.slice(0, 2)} ${next.open}` };
  }
  return { open: false, closesAt: null, nextOpen: null };
}

/** schema.org openingHoursSpecification for JSON-LD. */
export function openingHoursSpecification() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return OPENING_HOURS.filter((h) => h.open).map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: names[h.day],
    opens: h.open,
    closes: h.close,
  }));
}
