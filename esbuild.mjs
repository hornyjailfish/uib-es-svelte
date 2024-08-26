import * as esbuild from 'esbuild'
import sveltePreprocess from 'svelte-preprocess'
import sveltePlugin from 'esbuild-svelte' // esbuild plugin svelte
import { livereloadPlugin } from '@jgoz/esbuild-plugin-livereload'

import { EventEmitter } from 'events'
let production = process.env.NODE_ENV === 'production'

console.log(`build ${production? 'production' : 'development'}`)

const emitter = new EventEmitter()
const onRebuildPlug = {
  name: 'on-end',
  setup(build) {
    build.onEnd((result) => {
      if (result.error)
        console.log(`build ended with ${result.errors.length} errors`);
      else {
        emitter.emit('refresh', '123123')
        console.log('esbuild: Watch build succeeded')
      }
    });
  },
};

let ctx = await esbuild.context({
  entryPoints: ['./src/main.ts'],
  bundle: true,
  format: 'iife',
  target: 'es6',
  minify: production,
  sourcemap: false,
  outfile: './public/build/bundle.js', // and bundle.css
  pure: production ? ['console.log', 'console.time', 'console.timeEnd'] : [],
  legalComments: 'none',
  plugins: [
    sveltePlugin({ preprocess: sveltePreprocess() }),
    onRebuildPlug,
    livereloadPlugin({ urlHostname: 'localhost', port: 8000 }),
  ]})

await ctx.watch()
console.log('watching...')

let { host, port } = await ctx.serve({
  servedir: 'public',
})
console.log(`Serving on http://${host}:${port}`)
