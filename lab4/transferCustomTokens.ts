import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// load sender keypair from environment variables
const sender = getKeypairFromEnvironment("SECRET_KEY");

// connect to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// get or create reciever public key
const tokenMintPubKey = new PublicKey("CzqfFRrnLBrqFvbgLzSLXDNhF4z6YS94zjdEc2hFXJYX");
const recieverTokenAccount = await getOrCreateAssociatedTokenAccount(
	connection,
	sender,
	tokenMintPubKey,
	new PublicKey("CcrogdXjjCrQeCNhdFFioHrj44oygobsGMbsnAYU3MfB"),
);
// load token account pub key 
const tokenAccountPubKey = new PublicKey("28qkpCHX5LjUdq4HzW7Rn7LFqZmxKjM6AXx1S8YsEQp3")

// transfer tokens from sender to reciever
const tx = await transfer(
	connection,
	sender,
	tokenAccountPubKey,
	recieverTokenAccount.address,
	sender,
	50 * 10 ** 2,
)
console.log(`Transaction signature: ${tx}`);
