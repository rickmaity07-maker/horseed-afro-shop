import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { CookieNotice } from "./components/CookieNotice";
import { STORE, openingHoursSpecification } from "@/lib/store-info";

// The sign's heavy geometric capitals; self-hosted by Next.js, so no request goes to Google.
const montserrat = Montserrat({ subsets: ["latin", "latin-ext"], variable: "--font-montserrat", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Local-business structured data: lets Google show address, hours and phone for the shop.
const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: STORE.name,

  description: "Afro Shop in Schweinfurt: somalische und afrikanische Lebensmittel, Haushaltsartikel, Kosmetik, Kleider und Anzüge.",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  image: `${SITE_URL}/images/horseed-shopfront.jpg`,
  telephone: STORE.phoneE164,
  priceRange: "€",
  paymentAccepted: "Cash",
  currenciesAccepted: "EUR",
  address: {
    "@type": "PostalAddress",
    streetAddress: STORE.street,
    postalCode: STORE.postalCode,
    addressLocality: STORE.city,
    addressCountry: STORE.countryCode,
  },
  hasMap: STORE.mapUrl,
  openingHoursSpecification: openingHoursSpecification(),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Horseed Afro Shop | Lebensmittel, Kosmetik & Kleidung in Schweinfurt",
    template: "%s | Horseed Afro Shop",
  },
  description:
    "Horseed Afro Shop, Schultesstraße 4, Schweinfurt: somalische und afrikanische Lebensmittel, Haushaltsartikel, Kosmetik und Parfums, Kleider und Anzüge. Online bestellen, abholen oder liefern lassen, bar bezahlen. Mo–Sa 9–20 Uhr.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  // The home page's own address; every other indexable route sets its own (layouts, product pages).
  alternates: { canonical: "/" },
  openGraph: {
    images: [{ url: "/images/horseed-shopfront.jpg", alt: "Schaufenster von Horseed Afro Shop in Schweinfurt" }],
    title: "Horseed Afro Shop, Schweinfurt",
    description: "Lebensmittel, Haushaltsartikel, Kosmetik, Kleider & Anzüge. Abholung oder Lieferung, bar bezahlen.",
    siteName: "Horseed Afro Shop",
    locale: "de_DE",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2a1913",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Per-request CSP nonce from middleware.ts. Reading headers also makes every
  // page render per request, which the nonce needs (a cached page would carry a stale one).
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    // suppressHydrationWarning: browser translation rewrites lang/class on <html> before React loads.
    <html lang="de" className={montserrat.variable} suppressHydrationWarning>
      <body>
        {/* suppressHydrationWarning: browsers hide nonce attributes from the DOM, so React sees nonce="" on the client. */}
        <script type="application/ld+json" nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd).replace(/</g, "\\u003c") }} />
        <Providers>
          {children}
          <CookieNotice />
        </Providers>
      </body>
    </html>
  );
}
