import { Connection, PublicKey, VersionedTransaction, Keypair, Signer, TransactionSignature } from '@solana/web3.js';
export declare const buildAndSendTxnWithLogs: (c: Connection, tx: VersionedTransaction, owner: Keypair, signers: Signer[], withLogsIfSuccess?: boolean, withDescription?: string) => Promise<TransactionSignature>;
export declare function getLookupTableAccount(connection: Connection, address: PublicKey): Promise<import("@solana/web3.js").AddressLookupTableAccount | null>;
export declare function notEmpty<TValue>(value: TValue | null | undefined): value is TValue;
