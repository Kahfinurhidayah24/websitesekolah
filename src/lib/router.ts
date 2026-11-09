/**
 * Router ringan berbasis path (tanpa library).
 * Setiap halaman (/, /pendaftaran, /admin) adalah halaman penuh: pindah halaman = redirect sungguhan,
 * bukan scroll/anchor. Folder `pendaftaran/` dan `admin/` ikut dibuat saat build sehingga berjalan
 * di Apache/XAMPP tanpa konfigurasi rewrite tambahan.
 */

/** Path folder tempat website dipasang, mis. "/" atau "/sdn04/". */
export const APP_BASE: string = import.meta.env.DEV ? '/' : new URL('../', import.meta.url).pathname;

export type Route = 'home' | 'pendaftaran' | 'admin';

export function currentRoute(): Route {
  let p = window.location.pathname;
  if (p.startsWith(APP_BASE)) p = p.slice(APP_BASE.length);
  p = p.replace(/index\.html$/, '').replace(/^\/+|\/+$/g, '');
  if (p === 'pendaftaran') return 'pendaftaran';
  if (p === 'admin') return 'admin';
  return 'home';
}

/** Ubah path aplikasi ("/pendaftaran") menjadi URL yang benar sesuai folder instalasi. */
export function hrefFor(path: string): string {
  const clean = path.replace(/^\/+/, '');
  // Halaman berupa folder (pendaftaran/, admin/): selalu pakai "/" di akhir agar aset relatif terbaca
  // tanpa bergantung pada redirect server.
  const m = clean.match(/^([^?#]*)(.*)$/);
  const pathPart = m ? m[1] : clean;
  const rest = m ? m[2] : '';
  const isPage = pathPart === 'pendaftaran' || pathPart === 'admin';
  return `${APP_BASE}${pathPart}${isPage ? '/' : ''}${rest}`;
}

/**
 * URL tombol yang bisa diatur admin. Mendukung: "/pendaftaran" (path internal),
 * "https://..." (eksternal), "#id" (anchor di beranda), "mailto:" / "tel:".
 */
export function resolveUrl(url: string, fallback = '/pendaftaran'): string {
  const u = (url || '').trim() || fallback;
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  if (u.startsWith('#')) return `${APP_BASE}${u}`;
  if (u.startsWith('/')) return hrefFor(u);
  return hrefFor(u);
}

export function goTo(path: string) {
  window.location.assign(hrefFor(path));
}

/**
 * URL berkas/foto unggahan (mis. "api/uploads/abc.jpg") menjadi URL absolut sesuai folder instalasi,
 * sehingga gambar tampil dari halaman mana pun (/, /pendaftaran/, /admin/) baik mode dev maupun produksi.
 */
export function assetUrl(url: string | undefined | null): string {
  const u = (url || '').trim();
  if (!u) return '';
  if (/^(https?:|data:|blob:|\/\/)/i.test(u)) return u;
  if (u.startsWith('/')) return u;
  return `${APP_BASE}${u.replace(/^\.\//, '')}`;
}
