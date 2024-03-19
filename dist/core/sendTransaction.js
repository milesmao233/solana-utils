"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notEmpty = exports.getLookupTableAccount = exports.buildAndSendTxnWithLogs = void 0;
const utils_1 = require("../utils");
const sendAndConfirmVersionedTransaction = async (c, tx, commitment = 'confirmed', sendTransactionOptions = { preflightCommitment: 'processed' }) => {
    var _a, _b;
    const defaultOptions = { skipPreflight: true };
    const txId = await c.sendTransaction(tx, {
        ...defaultOptions,
        ...sendTransactionOptions,
    });
    console.log('Sending versioned txn', txId.toString());
    const latestBlockHash = await c.getLatestBlockhash('finalized');
    const t = await c.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txId,
    }, commitment);
    if (t.value && t.value.err) {
        const txDetails = await c.getTransaction(txId, {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed',
        });
        if (txDetails) {
            throw {
                err: (_a = txDetails.meta) === null || _a === void 0 ? void 0 : _a.err,
                logs: ((_b = txDetails.meta) === null || _b === void 0 ? void 0 : _b.logMessages) || [],
            };
        }
        throw t.value.err;
    }
    return txId;
};
const buildAndSendTxnWithLogs = async (c, tx, owner, signers, withLogsIfSuccess = false, withDescription = '') => {
    var _a;
    tx.sign([owner, ...signers]);
    try {
        const sig = await sendAndConfirmVersionedTransaction(c, tx, 'confirmed', {
            preflightCommitment: 'processed',
        });
        console.log('Transaction Hash:', withDescription, sig);
        if (withLogsIfSuccess) {
            await (0, utils_1.sleep)(5000);
            const res = await c.getTransaction(sig, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 6,
            });
            console.log('Transaction Logs:\n', (_a = res === null || res === void 0 ? void 0 : res.meta) === null || _a === void 0 ? void 0 : _a.logMessages);
        }
        return sig;
    }
    catch (e) {
        console.log(e);
        process.stdout.write(e.logs.toString());
        await (0, utils_1.sleep)(5000);
        const sig = e.toString().split(' failed ')[0].split('Transaction ')[1];
        const res = await c.getTransaction(sig, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 6,
        });
        console.log('Txn', res.meta.logMessages);
        return sig;
    }
};
exports.buildAndSendTxnWithLogs = buildAndSendTxnWithLogs;
async function getLookupTableAccount(connection, address) {
    return connection.getAddressLookupTable(address).then(res => res.value);
}
exports.getLookupTableAccount = getLookupTableAccount;
function notEmpty(value) {
    if (value === null || value === undefined) {
        return false;
    }
    //
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const testDummy = value;
    return true;
}
exports.notEmpty = notEmpty;
