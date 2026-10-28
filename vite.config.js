import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// <!-- @include header.html --> pulls in partials/header.html at dev and build time.
const includePartials = () => ({
  name: 'include-partials',
  transformIndexHtml(html) {
    return html.replace(/<!--\s*@include\s+([\w.-]+)\s*-->/g, (_, file) =>
      readFileSync(resolve(__dirname, 'partials', file), 'utf8'));
  },
  handleHotUpdate({ file, server }) {
    if (file.includes('/partials/')) server.ws.send({ type: 'full-reload' });
  },
});

export default defineConfig({
  base: './',
  plugins: [includePartials()],
  server: { host: '0.0.0.0', port: 5173 },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        toll: resolve(__dirname, 'toll-manufacturing.html'),
      },
    },
  },
});
