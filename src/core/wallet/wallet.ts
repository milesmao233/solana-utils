import { Keypair } from '@solana/web3.js'

export const parseKeypairFile = (content: string): Keypair => {
    return Keypair.fromSecretKey(Buffer.from(content))
}
