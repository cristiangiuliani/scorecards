declare module 'vite-plugin-eslint' {
  import type { Plugin } from 'vite';

  export default function eslintPlugin(options?: Record<string, any>): Plugin;
}
