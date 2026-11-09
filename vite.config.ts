import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, type Plugin} from 'vite';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

// Alamat folder proyek di Apache saat mode dev (npm run dev).
// Contoh XAMPP: http://localhost/sdn04  ->  folder C:\\xampp\\htdocs\\sdn04
const PHP_SERVER = process.env.PHP_SERVER ?? 'http://localhost/sdn04/public';

/**
 * Halaman /pendaftaran dan /admin dibuat sebagai folder sungguhan di hasil build
 * (dist/pendaftaran/index.html dan dist/admin/index.html), sehingga alamat tersebut
 * langsung bisa dibuka di Apache/XAMPP tanpa aturan rewrite. <base href="../"> memastikan
 * aset (JS/CSS/api) tetap terbaca dari folder utama.
 */
function subPages(): Plugin {
  return {
    name: 'sdn04-subpages',
    apply: 'build',
    closeBundle() {
      const out = join(process.cwd(), 'dist');
      const html = readFileSync(join(out, 'index.html'), 'utf-8');
      const withBase = html.replace('<head>', '<head>\n    <base href="../" />');
      for (const dir of ['pendaftaran', 'admin']) {
        mkdirSync(join(out, dir), {recursive: true});
        writeFileSync(join(out, dir, 'index.html'), withBase);
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), subPages()],
  server: {
    proxy: {
      '/api': { target: PHP_SERVER, changeOrigin: true },
    },
  },
});
