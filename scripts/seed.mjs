// Loads a small demo catalog into an EMPTY database (fresh setup / staging).
// Does nothing if any product already exists, so it can never touch a live
// catalog. Usage: npm run db:seed   (after npm run db:migrate)
import { readFileSync, existsSync } from "fs";
import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";

if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

// Bundled photos in /public/images/somali (Unsplash licence). Products without one show the camel placeholder
// until the owner uploads a photo in the admin. Prices and stock are starting values for the owner to correct.
const IMG = (name) => (name ? `/images/somali/${name}.jpg` : null);

// The four ranges on the shop sign: Lebensmittel · Haushaltsartikel · Kleider & Anzüge · Kosmetikartikel.
// sizes: [label, price €, stock]. Clothes use clothing sizes as variants.
const CLOTHES = (price, stock = 4) => ["S", "M", "L", "XL", "XXL"].map((s) => [s, price, stock]);
const ONE_SIZE = (price, stock = 10) => [["Einheitsgröße", price, stock]];

const CATALOG = [
  { category: "Reis, Mehl & Pasta", name: "Basmatireis", sizes: [["5 kg", 11.99, 30]], old: 13.99 },
  { category: "Reis, Mehl & Pasta", name: "Spaghetti", sizes: [["500 g", 1.29, 60]] },
  { category: "Reis, Mehl & Pasta", name: "Sorghummehl (Bur Haruur)", sizes: [["1 kg", 3.49, 25]] },
  { category: "Gewürze & Tee", name: "Xawaash Gewürzmischung", img: "xawaash", sizes: [["200 g", 4.49, 40]] },
  { category: "Gewürze & Tee", name: "Grüner Kardamom (Heyl)", sizes: [["100 g", 4.99, 30]] },
  { category: "Gewürze & Tee", name: "Schwarzer Tee, lose (Shaah)", sizes: [["500 g", 3.99, 40]] },
  { category: "Brot, Datteln & Snacks", name: "Canjeero", img: "canjeero", sizes: [["10 Stück", 3.99, 20]] },
  { category: "Brot, Datteln & Snacks", name: "Sambuusa, tiefgekühlt", img: "sambuusa", sizes: [["12 Stück", 6.49, 15]], old: 7.49 },
  { category: "Brot, Datteln & Snacks", name: "Medjool Datteln", img: "dates", sizes: [["1 kg", 8.99, 20]], old: 10.99 },
  { category: "Fleisch & Milch", name: "Ziegenfleisch (Hilib Ari)", unit: "pro kg", img: "cat-meat", sizes: [["1 kg", 14.99, 10]] },
  { category: "Fleisch & Milch", name: "Kamelmilch (Caano Geel)", img: "camel", sizes: [["500 ml", 5.49, 12]] },
  { category: "Fleisch & Milch", name: "Ghee (Subag)", sizes: [["500 g", 7.99, 15]] },

  { category: "Haushaltsartikel", name: "Uunsi Räucherwerk", img: "uunsi", sizes: [["100 g", 6.49, 25]] },
  { category: "Haushaltsartikel", name: "Dabqaad Räuchergefäß aus Ton", sizes: [["1 Stück", 12.99, 8]] },
  { category: "Haushaltsartikel", name: "Thermoskanne", sizes: [["1,5 L", 14.99, 10], ["2 L", 17.99, 6]] },
  { category: "Haushaltsartikel", name: "Kochtopf, Aluminium", sizes: [["24 cm", 19.99, 6], ["28 cm", 24.99, 5]] },

  { category: "Kosmetik & Parfum", name: "Oud Parfum", sizes: [["100 ml", 24.99, 12]] },
  { category: "Kosmetik & Parfum", name: "Duftöl (Attar)", sizes: [["12 ml", 7.99, 20]] },
  { category: "Kosmetik & Parfum", name: "Henna-Pulver", sizes: [["100 g", 3.49, 30]] },
  { category: "Kosmetik & Parfum", name: "Sheabutter", sizes: [["250 g", 6.99, 15]] },
  { category: "Kosmetik & Parfum", name: "Haaröl", sizes: [["200 ml", 5.99, 15]] },

  { category: "Kleider & Anzüge", name: "Dirac (Damenkleid)", sizes: CLOTHES(39.9) },
  { category: "Kleider & Anzüge", name: "Garbasaar (Schal)", sizes: ONE_SIZE(14.9) },
  { category: "Kleider & Anzüge", name: "Macawis (Herren-Wickelrock)", sizes: ONE_SIZE(19.9) },
  { category: "Kleider & Anzüge", name: "Khamiis (Herrengewand)", sizes: CLOTHES(34.9) },
  { category: "Kleider & Anzüge", name: "Herrenanzug, zweiteilig", sizes: ["46", "48", "50", "52", "54"].map((s) => [s, 129, 2]) },
].map((item) => ({ tags: [], ...item }));

const slug = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const prisma = new PrismaClient();
try {
  const existing = await prisma.$queryRawUnsafe(`select count(*)::int as n from products`);
  if (existing[0].n > 0) {
    console.log(`catalog already has ${existing[0].n} products — seed skipped`);
  } else {
    let sort = 0;
    for (const item of CATALOG) {
      const catSlug = slug(item.category);
      const cat = await prisma.$queryRawUnsafe(
        `insert into categories (name, slug, sort_order) values ($1, $2, $3)
         on conflict (slug) do update set name = excluded.name returning id`,
        item.category, catSlug, sort++
      );
      const product = await prisma.$queryRawUnsafe(
        `insert into products (category_id, name, slug, image_url, unit_note, tags)
         values ($1::uuid, $2, $3, $4, $5, $6::text[]) returning id`,
        cat[0].id, item.name, slug(item.name), IMG(item.img), item.unit ?? null, item.tags
      );
      for (const [i, [label, price, stock]] of item.sizes.entries()) {
        await prisma.$executeRawUnsafe(
          `insert into product_variants (product_id, sku, size_label, price, compare_at_price, stock_quantity, sort_order)
           values ($1::uuid, $2, $3, $4, $5, $6, $7)`,
          product[0].id, `${slug(item.name).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`,
          label, price, i === 0 && item.old ? item.old : null, stock, i
        );
      }
    }
    console.log(`seeded ${CATALOG.length} demo products`);
  }
} catch (err) {
  console.error("seed failed:", err.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
