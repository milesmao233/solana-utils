import {
    Connection,
    PublicKey,
    VersionedTransaction,
    Keypair,
    Signer,
    TransactionSignature,
    VersionedTransactionResponse,
    Commitment,
    SendOptions,
} from '@solana/web3.js'
import { sleep } from '../utils'

const sendAndConfirmVersionedTransaction = async (
    c: Connection,
    tx: VersionedTransaction,
    commitment: Commitment = 'confirmed',
    sendTransactionOptions: SendOptions = { preflightCommitment: 'processed' }
) => {
    const defaultOptions: SendOptions = { skipPreflight: true }
    const txId = await c.sendTransaction(tx, {
        ...defaultOptions,
        ...sendTransactionOptions,
    })
    console.log('Sending versioned txn', txId.toString())

    const latestBlockHash = await c.getLatestBlockhash('finalized')
    const t = await c.confirmTransaction(
        {
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txId,
        },
        commitment
    )
    if (t.value && t.value.err) {
        const txDetails = await c.getTransaction(txId, {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed',
        })
        if (txDetails) {
            throw {
                err: txDetails.meta?.err,
                logs: txDetails.meta?.logMessages || [],
            }
        }
        throw t.value.err
    }
    return txId
}

export const buildAndSendTxnWithLogs = async (
    c: Connection,
    tx: VersionedTransaction,
    owner: Keypair,
    signers: Signer[],
    withLogsIfSuccess: boolean = false,
    withDescription: string = ''
): Promise<TransactionSignature> => {
    tx.sign([owner, ...signers])

    try {
        const sig: string = await sendAndConfirmVersionedTransaction(
            c,
            tx,
            'confirmed',
            {
                preflightCommitment: 'processed',
            }
        )
        console.log('Transaction Hash:', withDescription, sig)
        if (withLogsIfSuccess) {
            await sleep(5000)
            const res = await c.getTransaction(sig, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 6,
            })
            console.log('Transaction Logs:\n', res?.meta?.logMessages)
        }
        return sig
    } catch (e: any) {
        console.log(e)
        process.stdout.write(e.logs.toString())
        await sleep(5000)
        const sig = e.toString().split(' failed ')[0].split('Transaction ')[1]
        const res: VersionedTransactionResponse | null = await c.getTransaction(
            sig,
            {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 6,
            }
        )
        console.log('Txn', res!.meta!.logMessages)
        return sig
    }
}

export async function getLookupTableAccount(
    connection: Connection,
    address: PublicKey
) {
    return connection.getAddressLookupTable(address).then(res => res.value)
}

export function notEmpty<TValue>(
    value: TValue | null | undefined
): value is TValue {
    if (value === null || value === undefined) {
        return false
    }
    //
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const testDummy: TValue = value
    return true
}
