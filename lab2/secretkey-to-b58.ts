import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import bs58 from "bs58";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(bs58.encode(keypair.secretKey));
