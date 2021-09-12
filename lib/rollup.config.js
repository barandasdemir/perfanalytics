import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

/**
 * @type {import('rollup-plugin-terser').Options}
 */
const terserConfig = {
  compress: {
    arguments: true,
    keep_fargs: false,
    passes: 3,
  },
};

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.js',
  output: [
    {
      name: 'def',
      file: 'dist/perfanalytics.js',
      format: 'umd',
    },
    {
      name: 'min',
      file: 'dist/perfanalytics.min.js',
      format: 'umd',
      plugins: [terser(terserConfig)],
    },
  ],
  plugins: [filesize()],
};

export default config;
