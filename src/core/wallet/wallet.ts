import { Keypair } from '@solana/web3.js'

export const parseKeypairFile = (content: string | Uint8Array): Keypair => {
    return Keypair.fromSecretKey(Buffer.from(content))
}
