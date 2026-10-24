# End-User Custodial SDK Demo

A demo app that walks through an End-User Custodial payout with the [Mural API](https://developers.muralpay.com) and [`@muralpay/browser-sdk`](https://www.npmjs.com/package/@muralpay/browser-sdk): creating an organization, accepting Terms of Service, KYC, creating an account, and signing and executing a payout.

## Quick Start

### 1. Environment Setup

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

```
MURAL_API_KEY=your_api_key_here
MURAL_API_URL=https://api-staging.muralpay.com
```

> **Keep your API key on the server.** These variables are read only by the dev server's proxy (see below). Don't rename them with a `VITE_` prefix: Vite bundles `VITE_` variables into the browser JavaScript, where anyone using the page can read them. The dev server refuses to start if `VITE_MURAL_API_KEY` is set.

### 2. Install & Run

```bash
npm install
npm run dev
```

### 3. Open in Browser

Visit: http://localhost:5174

## How it works

The browser never sees your API key:

```
Browser  ──/api/*──▶  Vite dev server proxy  ──/api/* + Authorization: Bearer <key>──▶  Mural API
```

- The React app calls same-origin `/api/...` endpoints with no credentials (`src/index.ts`).
- The proxy in `vite.config.ts` adds the `Authorization` header and forwards the request to `MURAL_API_URL`.
- The proxy only forwards the endpoints this demo uses. Any other path returns 404, so it can't be used as an open gateway for your key.
- The browser SDK handles the end user's side: the auth challenge, the session, and signing the payout. It needs no API key.

`npm run build && npm run preview` serves the built app with the same proxy.

> **In a real integration**, replace the proxy with your own backend. Before calling Mural on a user's behalf, it should authenticate the user and check that they belong to the organization in the `on-behalf-of` header.

## Steps

1. **Create Organization**: create an individual or business end-user custodial organization.
2. **Get Terms of Service Link** and 3. **Check Terms of Service Status**: the organization accepts Mural's Terms of Service.
4. **Initialize SDK**: create the browser SDK instance and its hidden auth iframe.
5. **Initiate Authentication Challenge** and 6. **Enter Email Code & Start Session**: send an email code to the approver, then start an SDK session with it.
7. **Get KYC Link** and 8. **Check KYC Verification Status**: get a hosted KYC link (`GET /api/organizations/{id}/kyc-link/v2`; each call returns a fresh link valid for 24 hours) and wait for verification. In staging, KYC completes automatically after about 10 minutes.
9. **Create Account** and 10. **Fund Your Account**: create a Mural account for the organization and send funds to its address.
11. **Create Payout Request**, 12. **Get Payout Body**, 13. **Sign Payout**, 14. **Execute Payout**: create the payout, sign it in the browser with the SDK, and execute it.

The example data in each step can be edited to test different scenarios.
