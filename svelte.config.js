import { postcss, sveltePreprocess } from "svelte-preprocess";
import { BROWSER, DEV, NODE } from "esm-env";

export default {
  compilerOptions: {
    accessors: true,
    dev: DEV,
  },
  moduleCompilerOptions: {
    dev: DEV,
    generate: "client",
    accessors: true,
  },
  preprocess: [postcss(), sveltePreprocess()],
};
