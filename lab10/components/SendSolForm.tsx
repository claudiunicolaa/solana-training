import { FC, useState } from "react";
import styles from "../styles/PingButton.module.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";

export const SendSolForm: FC = () => {
	const { connection } = useConnection();
	const { publicKey: senderPublicKey, sendTransaction } = useWallet();
	const [amount, setAmount] = useState('');
	const [address, setAddress] = useState('');

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!connection || !senderPublicKey) {
			console.log("Connection or wallet not available");
			return;
		}

		try {
			const recipientPubKey = new PublicKey(address);
			const txInstruction = SystemProgram.transfer({
				fromPubkey: senderPublicKey,
				toPubkey: recipientPubKey,
				lamports: parseFloat(amount) * 10 ** 9,
			});

			const tx = new Transaction().add(txInstruction);

			const sig = await sendTransaction(tx, connection);
			console.log("Signature", sig);
		} catch (error) {
			console.error("Transaction failed", error);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className={styles.inputGroup}>
				<label htmlFor="amount">SOL Amount:</label>
				<input
					type="text"
					id="amount"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					required
				/>
			</div>
			<div className={styles.inputGroup}>
				<label htmlFor="address">Recipient Address:</label>
				<input
					type="text"
					id="address"
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					required
				/>
			</div>
			<button type="submit" className={styles.button}>Send SOL</button>
		</form>
	);
};
