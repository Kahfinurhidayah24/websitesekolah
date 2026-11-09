/** Hanya izinkan tautan http(s); cegah "javascript:" dsb. pada href. */
export function safeHttpUrl(url: string, fallback = '#'): string {
  const u = (url || '').trim();
  return /^https?:\/\//i.test(u) ? u : fallback;
}

/** "0812-9840-0404" / "+62 812..." -> "628129840404" untuk tautan wa.me. */
export function waLink(raw: string): string {
  let d = (raw || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  return d ? `https://wa.me/${d}` : '';
}

export function telLink(raw: string): string {
  const d = (raw || '').replace(/[^\d+]/g, '');
  return d ? `tel:${d}` : '';
}

const ALLOWED_EMBED = /^https:\/\/(www\.google\.com\/maps\/embed|www\.google\.com\/maps\?|maps\.google\.com\/maps\?)/i;

/**
 * Ubah isian admin menjadi alamat iframe peta.
 * - Kode <iframe ...> dari Google Maps (Bagikan > Sematkan peta) -> pakai src-nya.
 * - Teks biasa -> dianggap kata pencarian lokasi.
 * - URL lain yang tidak bisa disematkan -> pakai kata pencarian cadangan.
 */
export function mapEmbedSrc(input: string, fallbackQuery: string): string {
  const raw = (input || '').trim();
  const iframe = /<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i.exec(raw);
  const candidate = (iframe ? iframe[1] : raw).replace(/&amp;/g, '&');

  if (ALLOWED_EMBED.test(candidate)) return candidate;

  const query = raw && !/^https?:\/\//i.test(raw) && !iframe ? raw : fallbackQuery;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query || 'SDN Lubang Buaya 04 Pagi')}&z=16&hl=id&output=embed`;
}
