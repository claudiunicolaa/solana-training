import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import {  getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import "dotenv/config";

// connect to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// load account keypair from environment variables
const account = getKeypairFromEnvironment("SECRET_KEY");

// load token mint pub key
const tokenMintPubKey = new PublicKey("CzqfFRrnLBrqFvbgLzSLXDNhF4z6YS94zjdEc2hFXJYX");
// load token account pub key
const tokenAccountPubKey = new PublicKey("28qkpCHX5LjUdq4HzW7Rn7LFqZmxKjM6AXx1S8YsEQp3");

// mint tokens to token account using the token mint and token account pub keys
const txSign1 = await mintTo(
	connection,
	account,
	tokenMintPubKey,
	tokenAccountPubKey,
	account,
	100 * 10 ** 2,
);
console.log(`Transaction signature 1: ${txSign1}`);

// create an another token account and get its address
const tokenAccount = await getOrCreateAssociatedTokenAccount(
	connection,
	account,
	tokenMintPubKey,
	new PublicKey("CcrogdXjjCrQeCNhdFFioHrj44oygobsGMbsnAYU3MfB"),
);

// mint tokens to the new token account using the token mint and token account pub keys
const txSign2 = await mintTo(
	connection,
	account,
	tokenMintPubKey,
	tokenAccount.address,
	account,
	100 * 10 ** 2,
);
console.log(`Transaction signature 2: ${txSign2}`);
