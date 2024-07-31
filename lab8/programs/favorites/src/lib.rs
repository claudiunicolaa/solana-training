use anchor_lang::prelude::*;

declare_id!("52L2fM2U984y1VpoSRxHJ3sT7dQNvqWu4UHvQ6wYcUz7");

// anchor accounts use 8 bytes to determine their type
pub const ANCHOR_DISCRIMINATOR: usize = 8;

#[program]
pub mod favorites {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    // instruction handler that sets the user's favorite number, color, and hobbies
    pub fn set_favorites(
        ctx: Context<SetFavorites>,
        number: u64,
        color: String,
        hobbies: Vec<String>,
    ) -> Result<()> {
        let user_pub_key = ctx.accounts.user.key();

        msg!("Greetings from: {:?}", ctx.program_id);
        msg!("User {user_pub_key}'s favorite number is {number}, favorite color is: {color}",);
        msg!("User's hobbies are: {:?}", hobbies);

        ctx.accounts.favorites.set_inner(Favorites {
            number,
            color,
            hobbies,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[account] // serialization/deserialization
// init space will compute how much space will be used by struct into account
#[derive(InitSpace)] 
// Favorites PDA
pub struct Favorites {
    pub number: u64,
    #[max_len(50)]
    pub color: String,
    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}

// Accounts that will be modified 
#[derive(Accounts)]
pub struct SetFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init, 
        payer=user, 
        space=ANCHOR_DISCRIMINATOR+Favorites::INIT_SPACE,
        seeds=[b"favorites", user.key().as_ref()],
        bump,
    )]
    pub favorites: Account<'info, Favorites>,
    pub system_program: Program<'info, System>
}