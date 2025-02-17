import fs from "fs";
// import legacy from '@vitejs/plugin-legacy';
import { svelte } from "@sveltejs/vite-plugin-svelte";
import urlToModule from "rollup-plugin-import-meta-url-to-module";
import sveltePreprocess from "svelte-preprocess";
import cssHash from "svelte-preprocess-css-hash";
import htmlAsset from "svelte-preprocess-html-asset";
import preloadLink from "./svelte-preprocess-preload-link.js";

export default ({ ssrBuild }) => {
  const mode = process.env.VITE_MODE;

  const preprocess = [
    sveltePreprocess({ postcss: true }),
    htmlAsset(),
    cssHash(),
  ];

  if (ssrBuild) {
    preprocess.push(
      preloadLink(
        JSON.parse(fs.readFileSync("./dist/client/ssr-manifest.json", "utf-8"))
      )
    );
  }

  return {
    mode,

    plugins: [
      svelte({
        preprocess,

        compilerOptions: {
          hydratable: Boolean(Number(process.env.VITE_SVELTE_HYDRATABLE)),
        },
      }),

      urlToModule({
        optimizeHref: true,
      }),

      // legacy()
    ],

    build: {
      cssCodeSplit: false,
      assetsInlineLimit: 0,
      assetsDir: "_assets",
      emptyOutDir: false,
    },
  };
};
