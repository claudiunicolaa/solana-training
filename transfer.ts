import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers"
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, VersionedMessage, VersionedTransaction } from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo";

// load sender keypair from environment variables
const sender = getKeypairFromEnvironment("SECRET_KEY");

// connect to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// load reciever public key
const recieverPubKey = new PublicKey("CcrogdXjjCrQeCNhdFFioHrj44oygobsGMbsnAYU3MfB");

// get balances before transaction
let { senderBalance, recieverBalance } = await getBalances(sender.publicKey, recieverPubKey)
console.log(`Sender balance: ${senderBalance / LAMPORTS_PER_SOL} SOL`);
console.log(`Reciever balance: ${recieverBalance / LAMPORTS_PER_SOL} SOL`);

// transfer 0.1 SOL from sender to reciever
const transactionInstruction = SystemProgram.transfer({
	fromPubkey: sender.publicKey,
	toPubkey: recieverPubKey,
	lamports: 0.1 * LAMPORTS_PER_SOL,
});

// memo (log info) to transaction
const memo = "solana course lab3";
const memoInstruction = createMemoInstruction(memo);

// create transaction
const transaction = new Transaction()
	.add(transactionInstruction)
	.add(memoInstruction);

// sign, send and confirm transaction
const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
console.log(`✅ Transaction confirmed, signature ${signature}`);

// get balances after transaction
({ senderBalance, recieverBalance } = await getBalances(sender.publicKey, recieverPubKey));
console.log(`Sender balance: ${senderBalance / LAMPORTS_PER_SOL} SOL`);
console.log(`Reciever balance: ${recieverBalance / LAMPORTS_PER_SOL} SOL`);


async function getBalances(senderPubKey: PublicKey, recieverPubKey: PublicKey): Promise<{ senderBalance: number, recieverBalance: number }> {
	// get sender balance
	const senderBalance = await connection.getBalance(senderPubKey);
	// get reciever balance
	const recieverBalance = await connection.getBalance(recieverPubKey);

	return { senderBalance, recieverBalance }
}