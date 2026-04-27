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
      react: resolve(dirname, 'node_modules/react'),
      'react-dom': resolve(dirname, 'node_modules/react-dom'),
    },
  },
});
