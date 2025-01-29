import { Connection, PublicKey } from '@solana/web3.js';
export declare const checkBalance: (connection: Connection, walletAddress: PublicKey, tokenAddress: PublicKey) => Promise<number>;
export declare const checkBalanceBN: (connection: Connection, walletAddress: PublicKey, tokenAddress: PublicKey) => Promise<BN>;
