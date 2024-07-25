import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import {  getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import "dotenv/config";

// connect to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// load account keypair from environment variables
const account = getKeypairFromEnvironment("SECRET_KEY");

// load token mint pub key
const tokenMintPubKey = new PublicKey("CzqfFRrnLBrqFvbgLzSLXDNhF4z6YS94zjdEc2hFXJYX");

// create token account and get its address
const tokenAccount = await getOrCreateAssociatedTokenAccount(
	connection,
	account,
	tokenMintPubKey,
	account.publicKey,
);
console.log(`Token account address: ${tokenAccount.address.toBase58()}`);
