"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKeypairFile = void 0;
const web3_js_1 = require("@solana/web3.js");
const parseKeypairFile = (content) => {
    return web3_js_1.Keypair.fromSecretKey(Buffer.from(content));
};
exports.parseKeypairFile = parseKeypairFile;
