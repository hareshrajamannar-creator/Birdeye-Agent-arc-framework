import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const localElemental = path.resolve(dirname, '../elemental');
const elementalPath = fs.existsSync(localElemental)
  ? localElemental
  : path.resolve(dirname, 'node_modules/@birdeye/elemental');

export default defineConfig({
  resolve: {
    alias: {
      '@birdeye/elemental': elementalPath,
    },
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        storybookTest({ configDir: path.join(dirname, '.storybook') })
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{ browser: 'chromium' }]
        }
      }
    }]
  }
});
