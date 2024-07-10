import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { createMint } from "@solana/spl-token";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import "dotenv/config";

// connect to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// load account keypair from environment variables
const account = getKeypairFromEnvironment("SECRET_KEY");

// create token mint and get its address
const tokenMint = await createMint(
	connection,
	account,
	account.publicKey,
	null,
	2,
);
console.log(`Token mint address: ${tokenMint.toBase58()}`);



