import { beforeEach, describe, expect, it, vi } from "vitest";
import { PLACEHOLDER_IMAGE, sizedImage } from "@/lib/images";

const STORED = "https://res.cloudinary.com/a2x0mlwu/image/upload/f_auto,q_auto/v1792521535/almadina/products/durra.webp";

describe("sizedImage", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "a2x0mlwu");
  });

  it("serves our Cloudinary photos through the own-domain /img proxy, resized", () => {
    expect(sizedImage(STORED, 600)).toBe("/img/f_auto,q_auto,c_limit,w_600/v1792521535/almadina/products/durra.webp");
  });

  it("works for stored URLs without a transformation", () => {
    expect(sizedImage("https://res.cloudinary.com/a2x0mlwu/image/upload/v1/almadina/products/x.webp", 200)).toBe(
      "/img/f_auto,q_auto,c_limit,w_200/v1/almadina/products/x.webp"
    );
  });

  it("never proxies other Cloudinary accounts (the proxy only allows ours)", () => {
    const other = "https://res.cloudinary.com/someone-else/image/upload/v1/pic.jpg";
    expect(sizedImage(other, 600)).toBe(other);
  });

  it("leaves local and other URLs unchanged, and shows the placeholder for products without a photo", () => {
    expect(sizedImage("/logo.png", 600)).toBe("/logo.png");
    expect(sizedImage(null, 600)).toBe(PLACEHOLDER_IMAGE);
    expect(sizedImage(undefined, 600)).toBe(PLACEHOLDER_IMAGE);
    expect(sizedImage("", 600)).toBe(PLACEHOLDER_IMAGE);
  });

  it("passes every URL through unchanged when no Cloudinary account is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "");
    expect(sizedImage(STORED, 600)).toBe(STORED);
  });
});
