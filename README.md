# End-User Custodial SDK Demo

A simple demo app to test the End-User Custodial Browser SDK functionality.

## Quick Start

### 1. Environment Setup
Create a `.env` file in the root directory:
```
VITE_MURAL_API_KEY=your_api_key_here
VITE_MURAL_API_URL=your_api_url_here
```
You can run the following to copy the example env file:
```
cp .env.example .env
```

### 2. Install & Run
```bash
npm install
npm run dev
```

### 3. Open in Browser
Visit: http://localhost:5173

## How to Use

This demo provides a working example with sample data that you can modify:

1. **Initialize SDK** - Sets up the connection
2. **Get Public Key** - Generates a key for authentication
3. **Authenticate** - Use your auth code and authenticator ID
4. **Test Payouts** - Sign transactions with your authenticated session

Feel free to modify the example data in the code to test different scenarios.

That's it! 🚀
