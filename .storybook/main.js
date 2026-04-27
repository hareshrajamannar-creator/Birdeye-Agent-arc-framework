import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Walk up to find the real project root (with a populated node_modules) — handles git worktrees
const findRoot = (startDir) => {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'node_modules', 'react'))) return dir;
    dir = path.dirname(dir);
  }
  return startDir;
};
const root = findRoot(path.resolve(dirname, '..'));

// Use local elemental workspace if it exists (dev), otherwise fall back to node_modules (CI)
const localElemental = path.resolve(dirname, '../../elemental');
const elementalPath = fs.existsSync(localElemental)
  ? localElemental
  : path.resolve(root, 'node_modules/@birdeye/elemental');

const localXyflowReact = path.resolve(localElemental, 'node_modules/@xyflow/react');
const xyflowReactPath = fs.existsSync(localXyflowReact)
  ? localXyflowReact
  : path.resolve(root, 'node_modules/@xyflow/react');

const localXyflowSystem = path.resolve(localElemental, 'node_modules/@xyflow/system');
const xyflowSystemPath = fs.existsSync(localXyflowSystem)
  ? localXyflowSystem
  : path.resolve(root, 'node_modules/@xyflow/system');

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  typescript: {
    reactDocgen: false,
  },
  async webpackFinal(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@birdeye/elemental': elementalPath,
      '@xyflow/react': xyflowReactPath,
      '@xyflow/system': xyflowSystemPath,
    };

    // Add Babel loader for JS/JSX files (including those in node_modules that need transpilation)
    config.module = config.module ?? {};
    config.module.rules = config.module.rules ?? [];

    // Find and update the existing JS rule or add a new one
    const jsRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes('jsx')
    );
    if (jsRule) {
      // Ensure babel-loader is used
      jsRule.use = [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      ];
    } else {
      config.module.rules.push({
        test: /\.(js|jsx|mjs|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      });
    }

    return config;
  },
};
export default config;
