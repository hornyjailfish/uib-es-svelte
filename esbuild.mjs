import { BROWSER, DEV, NODE } from 'esm-env';
import * as esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import { livereloadPlugin } from "@jgoz/esbuild-plugin-livereload";
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';

import { default as svelteConfig } from './svelte.config.js';

console.log(`build ${DEV ? "development" : "production"}`);

let ctx = await esbuild.context({
  platform: "browser",
  entryPoints: ["./src/main.ts"],
  bundle: true,
  write: true,
  format: "esm",
  target: "esnext",
  metafile: true,
  minify: !DEV,
  sourcemap: "inline",
  splitting: true,
  mainFields: ["svelte", "browser", "module", "main"],
  conditions: ["browser", "svelte"],
  outdir: "./public/build/", // and bundle.css
  // outfile: "./public/build/bundle.js", // and bundle.css
  pure: !DEV ? ["console.log", "console.time", "console.timeEnd"] : [],
  legalComments: "none",
  plugins: [
    esbuildSvelte(svelteConfig),
    tailwindPlugin({ configPath: "./tailwind.config.js" }),
    livereloadPlugin({ port: 42069 }),
  ],
}).catch((error, location) => {
  console.warn(`Errors: `, error, location);
  process.exit(1);
});

if (DEV) {
  const { host, port } = await ctx.serve({
    port: 8000,
    servedir: "public",
  });
  console.log(`Serving on http://${host}:${port}`);
  await ctx.watch();
  console.log("watching...");
}
else { console.log("building..."); }
