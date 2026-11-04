// The static marketing sections of the home page: hero, ranges, cosmetics band, story, visit.
// Look and wording follow the Horseed Afro Shop sign: espresso band, sand card, camel in an orange sun.
import { ArrowRight, Check, CookingPot, MapPin, Navigation, Phone, Shirt, ShoppingBasket, Sparkles } from "lucide-react";
import { OPENING_HOURS, STORE, type storeOpenState } from "@/lib/store-info";
import type { Translate } from "./types";
import { MAP_URL, PHONE, PHONE_LINK } from "./ui";

type OpenState = ReturnType<typeof storeOpenState> | null;

/** "öffnet um 09:00 Uhr" / "opens Tuesday 09:00", in the visitor's language. */
function opensText(o: NonNullable<OpenState>, t: Translate) {
  const n = o.nextOpenAt;
  if (!n) return "";
  if (n.today) return t(`öffnet um ${n.time} Uhr`, `opens at ${n.time}`);
  const day = OPENING_HOURS.find((h) => h.day === n.weekday);
  return t(`öffnet ${day?.de ?? ""} um ${n.time} Uhr`, `opens ${day?.en ?? ""} at ${n.time}`);
}

function OpenBadge({ openState, long, t }: { openState: NonNullable<OpenState>; long: boolean; t: Translate }) {
  const closed = openState.holiday
    ? t(`Heute geschlossen (${openState.holiday.de})`, `Closed today (${openState.holiday.en})`)
    : t("Geschlossen", "Closed");
  const label = long
    ? openState.open
      ? t(`Jetzt geöffnet bis ${openState.closesAt} Uhr`, `Open now until ${openState.closesAt}`)
      : `${closed}, ${opensText(openState, t)}`
    : openState.open
      ? t("Jetzt geöffnet", "Open now")
      : closed;
  return (
    <span className={openState.open ? "open-badge open" : "open-badge"}>
      <i />
      {label}
    </span>
  );
}

/** The four ranges printed on the shop sign. */
const RANGES = [
  { key: "food", de: "Lebensmittel", en: "Groceries", icon: ShoppingBasket },
  { key: "home", de: "Haushaltsartikel", en: "Household goods", icon: CookingPot },
  { key: "clothing", de: "Kleider & Anzüge", en: "Clothes & suits", icon: Shirt },
  { key: "beauty", de: "Kosmetikartikel", en: "Cosmetics", icon: Sparkles },
] as const;

export function Hero({ openState, t }: { openState: OpenState; t: Translate }) {
  return (
    <>
      <section id="top" className="hero reveal mx-auto grid max-w-7xl gap-6 px-5 pb-8 pt-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:pt-10">
        <div className="hero-copy">
          <div className="eyebrow">{t("Afro Shop in Schweinfurt", "Afro shop in Schweinfurt")}</div>
          <h1>
            {t("Alles von zu Hause,", "Everything from home,")}
            <br />
            <em>{t("mitten in Schweinfurt.", "right here in Schweinfurt.")}</em>
          </h1>
          <p>
            {t(
              "Somalische und afrikanische Lebensmittel, Haushaltsartikel, Kosmetik und Oud-Parfums, Kleider und Anzüge. Online bestellen und im Laden abholen oder liefern lassen.",
              "Somali and African groceries, household goods, cosmetics and oud perfumes, dresses and suits. Order online, then collect in store or have it delivered."
            )}
          </p>
          <div className="hero-actions">
            <a href="#shop" className="primary-btn">
              {t("Sortiment ansehen", "Browse the shop")} <ArrowRight size={18} />
            </a>
            <a href={MAP_URL} target="_blank" rel="noreferrer" className="text-btn">
              <MapPin size={17} /> {STORE.street}
            </a>
          </div>
          <div className="trust-row">
            {openState && <OpenBadge openState={openState} long t={t} />}
            <span>
              <Check /> {t("Abholung im Laden", "Click & collect")}
            </span>
            <span>
              <Check /> {t("Lieferung in Schweinfurt", "Delivery in Schweinfurt")}
            </span>
            <span>
              <Check /> {t("Bar bezahlen", "Pay cash")}
            </span>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img src="/images/somali/mat-spices.jpg" alt={t("Gewürze in geflochtenen Schalen auf einer somalischen Matte", "Spices in woven bowls on a Somali mat")} className="hero-image" />
          <div className="hero-card">
            <span>{t("Frisch im Laden", "In the shop now")}</span>
            <b>
              {t("Xawaash, Canjeero", "Xawaash, canjeero")}
              <br />
              {t("& Oud-Parfums", "& oud perfumes")}
            </b>
            <a href="#shop">
              {t("Zum Sortiment", "See the range")} <ArrowRight size={14} />
            </a>
          </div>
          <div className="hero-stamp" aria-hidden>
            <img src="/logo.png" alt="" style={{ width: 70, height: "auto" }} />
          </div>
        </div>
      </section>

      <section className="benefits reveal" aria-label={t("Unser Sortiment", "What we sell")}>
        {RANGES.map(({ key, de, en, icon: Icon }) => (
          <div key={key}>
            <Icon />
            <b>{t(de, en)}</b>
            <span>{t("Im Laden und online", "In store and online")}</span>
          </div>
        ))}
      </section>
    </>
  );
}

export function FreshBand({ t }: { t: Translate }) {
  return (
    <section id="kosmetik" className="feature-band reveal">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <span className="eyebrow light">{t("Kosmetik & Parfum", "Cosmetics & perfume")}</span>
          <h2>
            {t("Oud, Bakhoor", "Oud, bakhoor")}
            <br />
            <em>{t("und Pflege.", "and care.")}</em>
          </h2>
          <p>
            {t(
              "Arabische Parfums, Duftöle, Uunsi-Räucherwerk, Haar- und Hautpflege: eine ganze Wand voll im Laden, eine Auswahl online.",
              "Arabian perfumes, fragrance oils, uunsi incense, hair and skin care: a whole wall of it in the shop, a selection online."
            )}
          </p>
          <a href="#shop" className="light-btn">
            {t("Kosmetik ansehen", "Shop cosmetics")} <ArrowRight size={17} />
          </a>
        </div>
        <div className="feature-photo">
          <img loading="lazy" src="/images/somali/uunsi.jpg" alt={t("Uunsi-Räucherwerk", "Uunsi incense")} />
          <div>
            <b>{t("Uunsi & Bakhoor", "Uunsi & bakhoor")}</b>
            <span>{t("Für Zuhause und Feste", "For the home and celebrations")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Story({ t }: { t: Translate }) {
  return (
    <section id="story" className="story reveal mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
      <div className="story-photo">
        <img loading="lazy" src="/images/horseed-shopfront.jpg" alt={t("Schaufenster von Horseed Afro Shop mit Öffnungszeiten und Parfumregal", "Horseed Afro Shop window with opening hours and a perfume wall")} />
      </div>
      <div className="story-copy">
        <span className="eyebrow">{t("Über uns", "About us")}</span>
        <h2>
          {t("Ein Laden für", "One shop for")} <em>{t("die ganze Familie.", "the whole family.")}</em>
        </h2>
        <p>
          {t(
            `Horseed Afro Shop in der ${STORE.street} führt, was die afrikanische Gemeinschaft in Schweinfurt im Alltag braucht: vom Basmatireis bis zum Anzug für die Hochzeit.`,
            `Horseed Afro Shop on ${STORE.street} stocks what Schweinfurt's African community needs every day: from basmati rice to a suit for the wedding.`
          )}
        </p>
        <ul className="quote" style={{ listStyle: "none" }}>
          {RANGES.map((r) => (
            <li key={r.key}>
              <p style={{ margin: "2px 0" }}>{t(r.de, r.en)}</p>
            </li>
          ))}
        </ul>
        <p>
          {t("Inhaber", "Owner")}: {STORE.owner}
        </p>
        <a href={STORE.directionsUrl} target="_blank" rel="noreferrer" className="outline-btn">
          <MapPin size={17} /> {t("Route planen", "Get directions")}
        </a>
      </div>
    </section>
  );
}

export function Visit({ openState, t }: { openState: OpenState; t: Translate }) {
  return (
    <section id="visit" className="visit reveal">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="visit-grid">
          <div>
            <span className="eyebrow">{t("Kommen Sie vorbei", "Come visit")}</span>
            <h2>
              {t("Wir sehen uns bei", "See you at")} <em>Horseed.</em>
            </h2>
            <p>
              {STORE.street}
              <br />
              {STORE.postalCode} {STORE.city}, {t("Deutschland", "Germany")}
            </p>
            <ul className="service-list">
              {STORE.services.map((svc) => (
                <li key={svc.key}>
                  <Check size={15} /> {t(svc.de, svc.en)}
                </li>
              ))}
            </ul>
            <div className="visit-links">
              <a href={STORE.directionsUrl} target="_blank" rel="noreferrer">
                <Navigation size={17} /> {t("Route planen", "Get directions")}
              </a>
              <a href={PHONE_LINK}>
                <Phone size={17} /> {PHONE}
              </a>
            </div>
            <div className="hours">
              <b style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {t("Öffnungszeiten", "Opening hours")}
                {openState && <OpenBadge openState={openState} long={false} t={t} />}
              </b>
              {OPENING_HOURS.map((h) => (
                <span key={h.day} className={openState && new Date().getDay() === h.day ? "today" : undefined}>
                  {t(h.de, h.en)} <strong>{h.open ? `${h.open} — ${h.close}` : t("Geschlossen", "Closed")}</strong>
                </span>
              ))}
              <span>
                {t("Feiertage", "Public holidays")} <strong>{t("Geschlossen", "Closed")}</strong>
              </span>
            </div>
          </div>
          <div className="map-card">
            <div className="map-grid"></div>
            <div className="pin">
              <MapPin size={26} />
              <b>Horseed Afro Shop</b>
              <small>{STORE.street}</small>
            </div>
            <a href={MAP_URL} target="_blank" rel="noreferrer" className="map-overlay">
              {t("In Google Maps öffnen", "Open in Google Maps")} <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
