import {
    Connection,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js'
import { getLookupTableAccount, notEmpty } from './sendTransaction'

export const buildVersionedTransaction = async (
    connection: Connection,
    payer: PublicKey,
    instructions: TransactionInstruction[],
    lookupTables: PublicKey[] = []
): Promise<VersionedTransaction> => {
    const blockhash = await connection
        .getLatestBlockhash('confirmed')
        .then(res => res.blockhash)

    const lookupTablesAccounts = await Promise.all(
        lookupTables.map(address => {
            return getLookupTableAccount(connection, address)
        })
    )

    const messageV0 = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message(lookupTablesAccounts.filter(notEmpty))

    return new VersionedTransaction(messageV0)
}
