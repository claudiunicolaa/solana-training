# Solana Training (Jun-Aug 2024)

## Pre-requisites

- Node.js v20 or later
- TypeScript v9 or later
- npm v10 or later
- install dependencies with `npm i`
- create an environment file based on `.env.example` with `cp .env.example .env`

### Lab 1

**Generate a new Solana keypair**

Run 

```bash
npx esrun generate-keypair.ts
```

Output format should be similar to:

```bash
The public key is:  CcrogdXjjCrQeCNhdFFioHrj44oygobsGMbsnAYU3MfB
The secret key is:  Uint8Array(64) [
   42,  13, 144, 105,  41,  69, 130,  32, 240,  59,  89,
   33, 130,  77, 108, 205, 191, 215, 187,   1, 234, 113,
   60, 244,  71, 122,  70,  90,   8,   5,  26, 171, 172,
  160,  50, 246,  54,  48, 222,  72,  99,  34, 165, 167,
   79,   0,  28, 206, 238,  44,  31, 163, 152,  80,   2,
  205, 242, 110, 118,  37,  99, 223,  65, 150
]
✅ Finished!
```

**Load the keypair from the environment file**

Copy the secret key and paste it in the `.env` file as the value for `SECRET_KEY`. Should look like:

```bash
SECRET_KEY=[
   42,  13, 144, 105,  41,  69, 130,  32, 240,  59,  89,
   33, 130,  77, 108, 205, 191, 215, 187,   1, 234, 113,
   60, 244,  71, 122,  70,  90,   8,   5,  26, 171, 172,
  160,  50, 246,  54,  48, 222,  72,  99,  34, 165, 167,
   79,   0,  28, 206, 238,  44,  31, 163, 152,  80,   2,
  205, 242, 110, 118,  37,  99, 223,  65, 150
]
```

Run 
```bash
npx esrun load-keypair.ts
```

Output format should be similar to:

```bash
✅ Finished! We've loaded our keypair securely, using an env file! Our public key is: CcrogdXjjCrQeCNhdFFioHrj44oygobsGMbsnAYU3MfB
```


### Lab 2

**Interact with Solana Devnet**

Set the Solana Devnet cluster as the default cluster for the Solana CLI tool:
```bash
solana config set --url https://api.devnet.solana.com
```

Send 1 SOL to the public key generated in Lab 1:
```bash
solana airdrop 1 CcrogdXjjCrQeCNhdFFioHrj44oygobsGMbsnAYU3MfB
```

Run 
```bash
npx esrun check-balance.ts
```

Output format should be similar to:

```bash
connected to devnet
devnet url https://api.devnet.solana.com
public key CcrogdXjjCrQeCNhdFFioHrj44oygobsGMbsnAYU3MfB
balance for wallet CcrogdXjjCrQeCNhdFFioHrj44oygobsGMbsnAYU3MfB is 1 SOL
```

**Import account to Phantom wallet**

Run 
```bash
npx esrun secretkey-to-b58.ts
```

Copy the output and import it to the [Phantom wallet](https://help.phantom.app/hc/en-us/articles/15079894392851-Importing-an-Existing-Wallet-into-Phantom).

