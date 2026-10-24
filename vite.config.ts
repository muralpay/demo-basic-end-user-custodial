import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Mural API endpoints the demo calls. The proxy rejects everything else so it
// can't be used as a general-purpose gateway that carries your API key.
const ALLOWED_ROUTES: Array<[method: string, path: RegExp]> = [
  ['POST', /^\/api\/organizations$/],
  ['GET', /^\/api\/organizations\/[\w-]+$/],
  ['GET', /^\/api\/organizations\/[\w-]+\/tos-link$/],
  ['GET', /^\/api\/organizations\/[\w-]+\/kyc-link\/v2$/],
  ['POST', /^\/api\/approvers\/end-user-custodial\/initiate-challenge$/],
  ['GET', /^\/api\/accounts$/],
  ['POST', /^\/api\/accounts$/],
  ['GET', /^\/api\/accounts\/[\w-]+$/],
  ['POST', /^\/api\/payouts\/payout$/],
  ['GET', /^\/api\/payouts\/payout\/end-user-custodial\/body-to-sign\/[\w-]+$/],
  ['POST', /^\/api\/payouts\/payout\/end-user-custodial\/execute\/[\w-]+$/],
];

const isAllowed = (method = '', url = '') => {
  const path = url.split('?')[0];
  return ALLOWED_ROUTES.some(([m, re]) => m === method && re.test(path));
};

// The browser calls same-origin /api/*; this server-side proxy forwards those
// requests to Mural and attaches the API key. The key is read from a non-VITE_
// env var, so Vite never exposes it to client code or the build output.
function muralApiProxy(apiUrl: string, apiKey: string): Record<string, ProxyOptions> {
  return {
    '/api': {
      target: apiUrl,
      changeOrigin: true,
      bypass: (req) => (isAllowed(req.method, req.url) ? undefined : false),
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
          proxyReq.removeHeader('origin');
          proxyReq.removeHeader('cookie');
        });
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // '' prefix loads all vars from .env, not just VITE_ ones. These stay in the
  // Node process and are only used by the proxy.
  const env = loadEnv(mode, process.cwd(), '');
  const { MURAL_API_KEY, MURAL_API_URL } = env;

  if (env.VITE_MURAL_API_KEY) {
    throw new Error(
      'VITE_MURAL_API_KEY is set. VITE_ variables are bundled into the browser, so this would expose your API key. Rename it to MURAL_API_KEY in .env.'
    );
  }
  if (!MURAL_API_KEY || !MURAL_API_URL) {
    throw new Error('MURAL_API_KEY and MURAL_API_URL must be set in .env (see .env.example).');
  }

  const proxy = muralApiProxy(MURAL_API_URL, MURAL_API_KEY);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {
      global: 'globalThis'
    },
    server: {
      port: 5174,
      proxy
    },
    preview: {
      port: 5174,
      proxy
    },
    optimizeDeps: {
      include: ['@muralpay/browser-sdk'],
      force: true,
      esbuildOptions: {
        target: 'es2020'
      }
    }
  };
});
