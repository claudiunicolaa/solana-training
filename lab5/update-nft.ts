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

const updateNftData = {
	symbol: "sdpnic",
	imageFile: path.resolve(__dirname, "nft-2.png",)
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

	const nftAddress = new PublicKey("42XrPr3HGEwqiYdoo48FawPyyHjy4X54HB7qjrziUY34");
	// upload updated NFT data and get the new URI for the metadata
	const updatedUri = await uploadMetadata(metaplex, updateNftData);
	// update the NFT using the helper function and the new URI from the metadata
	await updateNftUri(metaplex, updatedUri, nftAddress);
}


async function updateNftUri(
	metaplex: Metaplex,
	uri: string,
	mintAddress: PublicKey,
) {
	console.log("Updating NFT URI...");
	// fetch NFT data using mint address
	const nft = await metaplex.nfts().findByMint({ mintAddress });

	// update the NFT metadata
	const { response } = await metaplex.nfts().update({
		nftOrSft: nft,
		uri: uri,
		symbol: updateNftData.symbol,
	});

	const link = getExplorerLink("address", nft.address.toString(), "devnet");
	console.log(`Token Mint: ${link}`);

	const txLink = getExplorerLink("tx", response.signature, "devnet");
	console.log(`Transaction: ${txLink}`);
}

async function uploadMetadata(metaplex: Metaplex, nftData: Partial<NftData>): Promise<string> {
	console.log("Uploading metadata...");
	// load the image file into a buffer
	const buffer = fs.readFileSync(nftData.imageFile ?? '');
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

main()
	.then(() => {
		console.log("Finished successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});