import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import prerender from "@prerenderer/rollup-plugin";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    prerender({
      routes: ["/", "/past-events"],
      postProcess(renderedRoute) {
        const baseUrl = "https://rathacks.com";
        const canonicalUrl = baseUrl + renderedRoute.route;

        let html = renderedRoute.html;
        html = html.replace(
          "</head>",
          ` <link rel="canonical" href="${canonicalUrl}" />\n </head>`,
        );
        // Remove that toastify stuff from the outputed html file since it's not needed
        html = html.replace(
          /<style>[\s\S]*?--toastify-color-light[\s\S]*?<\/style>/,
          "",
        );
        html = html.replace(/<section class="Toastify"[\s\S]*?<\/section>/, "");

        const descriptionRegex =
          /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i;
        const pastEventsDescriptionTag = `<meta name="description" content="Check out past hackathons and CTFs hosted by Rat Hacks, including Campfire Roanoke, at RVGS and the SMWV. View awesome pictures and stats from the events!" />`;
        if (renderedRoute.route === "/past-events") {
          html = html.replace(descriptionRegex, pastEventsDescriptionTag);
        }
        renderedRoute.html = html;
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        spa: path.resolve(__dirname, "spa.html"),
      },
    },
  },
});
