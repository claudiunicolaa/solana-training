import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Favorites } from "../target/types/favorites";
import { assert } from "chai";

const web3 = anchor.web3;

describe("favorites", () => {
  // Use the cluster and keypair specified in Anchor.toml
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const user = (provider.wallet as any).payer;
  const program = anchor.workspace.Favorites as Program<Favorites>;

  before(async () => {
    const balance = await provider.connection.getBalance(user.publicKey);
    const balanceInSOL = balance / web3.LAMPORTS_PER_SOL;
    const formattedBalance = new Intl.NumberFormat().format(balanceInSOL);
    console.log(`Balance: ${formattedBalance} SOL`);
  });

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("Saves a user's favorites to the blockchain", async () => {
    // Here's what we want to write to the blockchain
    const favoriteNumber = new anchor.BN(23);
    const favoriteColor = "purple";
    const favoriteHobbies = ["skiing", "skydiving", "biking"];
    await program.methods
      .setFavorites(favoriteNumber, favoriteColor, favoriteHobbies)
      .signers([user])
      .rpc();

    // Now check everything matches
    const favoritesPdaAndBump = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("favorites"), user.publicKey.toBuffer()],
      program.programId
    );
    const favoritesPda = favoritesPdaAndBump[0];
    const dataFromPda = await program.account.favorites.fetch(favoritesPda);
    assert.equal(dataFromPda.color, favoriteColor);
    assert.equal(dataFromPda.number.toString(), favoriteNumber.toString());
    assert.deepEqual(dataFromPda.hobbies, favoriteHobbies);
  });

  it("Doesn't allow people write to favorites for other users", async () => {
    const someRandomAccount = anchor.web3.Keypair.generate();
    try {
      await program.methods
        .setFavorites(new anchor.BN(23), "purple", ["skiing", "skydiving", "biking"])
        .signers([someRandomAccount])
        .rpc();
    } catch (e) {
      const errorMsg = (e as Error).message;
      assert.isTrue(errorMsg.includes("unknown signer"));
    }
  });
});
