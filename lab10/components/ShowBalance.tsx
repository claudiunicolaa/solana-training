import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const ShowBalance: FC = () => {
	const { connection } = useConnection();
	const { publicKey } = useWallet();

	const [balance, setBalance] = useState<number | null>(null);

	const getBalance = async () => {
		if (!connection || !publicKey) {
			console.log("Connection or wallet not available");
			return;
		}
		try {
			const accountInfo = await connection.getAccountInfo(publicKey);
			if (accountInfo) {
				const lamports = accountInfo.lamports;
				const solBalance = lamports / 10 ** 9; // Convert lamports to SOL
				setBalance(solBalance);
			}
		} catch (error) {
			console.error('Error fetching balance:', error);
		}
	};

	useEffect(() => {
		getBalance();
	}, [connection, publicKey]);

	return (
		<div>
			{balance !== null ? (
				<p>Your Solana balance: {balance} SOL</p>
			) : (
				<p>Loading balance...</p>
			)}
		</div>
	);
};

export default ShowBalance;