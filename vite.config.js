import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Use local elemental workspace if it exists (dev), otherwise fall back to node_modules (CI)
const localElemental = resolve(dirname, '../elemental');
const elementalPath = fs.existsSync(localElemental)
  ? localElemental
  : resolve(dirname, 'node_modules/@birdeye/elemental');

const localXyflow = resolve(localElemental, 'node_modules/@xyflow/react');
const xyflowReactPath = fs.existsSync(localXyflow)
  ? localXyflow
  : resolve(dirname, 'node_modules/@xyflow/react');

const localXyflowSystem = resolve(localElemental, 'node_modules/@xyflow/system');
const xyflowSystemPath = fs.existsSync(localXyflowSystem)
  ? localXyflowSystem
  : resolve(dirname, 'node_modules/@xyflow/system');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@birdeye/elemental': elementalPath,
      '@xyflow/react': xyflowReactPath,
      '@xyflow/system': xyflowSystemPath,
      classnames: resolve(dirname, 'src/vendor/classnames.js'),
      'fast-shallow-equal': resolve(dirname, 'src/vendor/fast-shallow-equal.js'),
      lodash: resolve(dirname, 'node_modules/lodash-es'),
      'react-list': resolve(dirname, 'src/vendor/react-list.jsx'),
      'react-modal': resolve(dirname, 'src/vendor/react-modal.jsx'),
      react: resolve(dirname, 'node_modules/react'),
      'react-dom': resolve(dirname, 'node_modules/react-dom'),
    },
  },
  // Exclude elemental from esbuild pre-bundling — it ships with nested
  // core/node_modules/ that esbuild can't traverse, so we serve it as
  // raw ESM at request time instead.
  optimizeDeps: {
    exclude: ['@birdeye/elemental'],
  },
  server: {
    // Allow Vite to serve files from inside the elemental package tree,
    // including its nested core/node_modules/ directory.
    fs: {
      allow: [
        resolve(dirname, 'node_modules/@birdeye/elemental'),
        resolve(dirname, '..'),
      ],
    },
  },
});
