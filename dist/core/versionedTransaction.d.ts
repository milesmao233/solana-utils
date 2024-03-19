import { Connection, PublicKey, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
export declare const buildVersionedTransaction: (connection: Connection, payer: PublicKey, instructions: TransactionInstruction[], lookupTables?: PublicKey[]) => Promise<VersionedTransaction>;
