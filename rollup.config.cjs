const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel').default;
const alias = require('@rollup/plugin-alias');
const path = require('path');
const postcss = require('rollup-plugin-postcss');
const json = require('@rollup/plugin-json');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const replace = require('@rollup/plugin-replace');
const url = require('@rollup/plugin-url');
const copy = require('rollup-plugin-copy');
const image = require('@rollup/plugin-image');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/react-sdk.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/react-sdk.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: (id) => id === 'react' || id === 'react-dom' || id === 'react/jsx-runtime' || id === 'react-router-dom',
  onwarn: function (warning, warn) {
    if (warning.message && warning.message.includes('use client')) {
      return;
    }
    if (warning.code === 'CIRCULAR_DEPENDENCY' || warning.code === 'UNUSED_EXTERNAL_IMPORT') {
      return;
    }
    warn(warning);
  },
  plugins: [
    peerDepsExternal(),
    alias({
      entries: [
        { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
        { find: '@services', replacement: path.resolve(__dirname, 'src/services') },
        { find: '@styles', replacement: path.resolve(__dirname, 'src/styles') },
        { find: '@constants', replacement: path.resolve(__dirname, 'src/constants') },
        { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
        { find: '@', replacement: path.resolve(__dirname, 'src') },
      ],
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.mjs', '.js', '.jsx', '.json', '.woff', '.woff2', '.eot', '.ttf', '.svg'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx'],
    }),
    postcss({
      extract: 'veripass-react-sdk.css',
      inject: false,
      modules: false,
      minimize: true,
      sourceMap: true,
    }),
    // Embed extracted CSS into JS bundles so the SDK is self-contained (plug-and-play)
    {
      name: 'inject-css-into-bundle',
      generateBundle(options, bundle) {
        const cssFileName = 'veripass-react-sdk.css';
        const cssAsset = bundle[cssFileName];

        if (cssAsset && cssAsset.source) {
          const cssContent = JSON.stringify(cssAsset.source.toString());
          const injectCode = `(function(){try{if(typeof document!=='undefined'){var s=document.createElement('style');s.setAttribute('data-veripass-sdk','');s.textContent=${cssContent};document.head.appendChild(s);}}catch(e){console.warn('Veripass SDK: Could not inject styles',e);}})();\n`;

          for (const key of Object.keys(bundle)) {
            const chunk = bundle[key];
            if (chunk.type === 'chunk' && chunk.isEntry) {
              chunk.code = injectCode + chunk.code;
            }
          }

          // Remove CSS file from dist — everything is inside the JS now
          delete bundle[cssFileName];
          delete bundle[cssFileName + '.map'];
        }
      },
    },
    url({
      include: ['**/*.woff', '**/*.woff2', '**/*.eot', '**/*.ttf'],
      limit: 0,
      emitFiles: true,
      fileName: 'fonts/[name][extname]',
    }),
    image(),
    json(),
    replace({
      'process.env.VERIPASS_PRODUCTION_SERVICE_URL': JSON.stringify(process.env.VERIPASS_PRODUCTION_SERVICE_URL),
      'process.env.VERIPASS_DEVELOPMENT_SERVICE_URL': JSON.stringify(process.env.VERIPASS_DEVELOPMENT_SERVICE_URL),
      'process.env.VERIPASS_LOCAL_SERVICE_URL': JSON.stringify(process.env.VERIPASS_LOCAL_SERVICE_URL),
      preventAssignment: true,
    }),
    copy({
      targets: [
        { src: 'src/fonts/*', dest: 'dist/fonts' },
        { src: 'src/assets/*', dest: 'dist/assets' },
      ],
    }),
  ],
};
