import { Connection, clusterApiUrl } from "@solana/web3.js";
import {
	Metaplex,
	keypairIdentity,
	bundlrStorage,
	NftWithToken,
	toMetaplexFile,
	PublicKey,
} from "@metaplex-foundation/js";

import "dotenv/config";
import fs from 'fs';
import path from 'path';
import {
	getExplorerLink,
	getKeypairFromEnvironment,
} from "@solana-developers/helpers";

// NFT data interface
interface NftData {
	name: string;
	symbol: string;
	description: string;
	sellerFeeBasisPoints: number;
	imageFile: string;
}

const nftData = {
	name: "SDP NFT - NicTech edition",
	symbol: "sdpn",
	description: "Solana Developers Program. This is an NFT created by NicTech",
	sellerFeeBasisPoints: 0,
	imageFile: path.resolve(__dirname, "nft.png",)
}


async function main() {
	// connect to devnet
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

	// load account keypair from environment variables
	const account = getKeypairFromEnvironment("SECRET_KEY");

	// create a new Metaplex instance
	const metaplex = new Metaplex(connection)
		.use(keypairIdentity(account))
		.use(
			bundlrStorage({
				address: "https://devnet.bundlr.network",
				providerUrl: "https://api.devnet.solana.com",
			})
		);

	const uri = await uploadMetadata(metaplex, nftData);
	const nft = await createNft(metaplex, uri, nftData);
}


async function uploadMetadata(metaplex: Metaplex, nftData: NftData): Promise<string> {
	console.log("Uploading metadata...");
	// load the image file into a buffer
	const buffer = fs.readFileSync(nftData.imageFile);
	// convert buffer to metaplex format
	const file = toMetaplexFile(buffer, nftData.imageFile);
	// upload image and get image uri
	const imgUri = await metaplex.storage().upload(file);
	// upload metadata and get metadata uri (off chain metadata)
	const { uri } = await metaplex.nfts().uploadMetadata({
		name: nftData.name,
		symbol: nftData.symbol,
		description: nftData.description,
		image: imgUri,
	});

	console.log("Metadata uploaded successfully! URI: ", uri);
	return uri;
}

async function createNft(
	metaplex: Metaplex,
	uri: string,
	nftData: NftData,
): Promise<NftWithToken> {
	console.log("Creating NFT...");

	//implement the createNft function
	const { nft } = await metaplex.nfts().create({
		uri: uri,
		name: nftData.name,
		sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
		symbol: nftData.symbol,
	});

	const link = getExplorerLink("address", nft.address.toString(), "devnet");

	console.log(`Token Mint: ${link}`);
	return nft;
}


main()
	.then(() => {
		console.log("Finished successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});