"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildVersionedTransaction = void 0;
const web3_js_1 = require("@solana/web3.js");
const sendTransaction_1 = require("./sendTransaction");
const buildVersionedTransaction = async (connection, payer, instructions, lookupTables = []) => {
    const blockhash = await connection
        .getLatestBlockhash('confirmed')
        .then(res => res.blockhash);
    const lookupTablesAccounts = await Promise.all(lookupTables.map(address => {
        return (0, sendTransaction_1.getLookupTableAccount)(connection, address);
    }));
    const messageV0 = new web3_js_1.TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message(lookupTablesAccounts.filter(sendTransaction_1.notEmpty));
    return new web3_js_1.VersionedTransaction(messageV0);
};
exports.buildVersionedTransaction = buildVersionedTransaction;
