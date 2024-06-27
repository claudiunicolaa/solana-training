import "dotenv/config";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

// connect to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("connected to devnet");
console.log("devnet url", connection.rpcEndpoint);

// get the balance of the account
const keypair = getKeypairFromEnvironment("SECRET_KEY");
const publicKey = keypair.publicKey;
console.log("public key", publicKey.toBase58());
const balanceLamport = await connection.getBalance(publicKey);

console.log(`balance for wallet ${publicKey} is ${balanceLamport / LAMPORTS_PER_SOL} SOL`);
