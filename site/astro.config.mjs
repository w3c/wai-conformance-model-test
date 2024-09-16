import { defineConfig } from 'astro/config';

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://w3c.github.io",
  base: "wai-conformance-model-test",
  trailingSlash: "always",
  server: {
    host: true,
    port: 4323
  },
  integrations: [
    icon({
      iconDir: "src/assets/icons",
    }),
  ]
});