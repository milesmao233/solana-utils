"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBalanceBN = exports.checkBalance = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const checkBalance = async (connection, walletAddress, tokenAddress) => {
    try {
        const mintInfo = await (0, spl_token_1.getMint)(connection, tokenAddress);
        const walletPublicKey = new web3_js_1.PublicKey(walletAddress);
        // 计算关联的代币账户地址
        const associatedTokenAddress = await (0, spl_token_1.getAssociatedTokenAddress)(tokenAddress, walletPublicKey);
        const accountInfo = await (0, spl_token_1.getAccount)(connection, associatedTokenAddress);
        // 转换余额格式（考虑代币精度）
        const balance = Number(accountInfo.amount) / Math.pow(10, mintInfo.decimals);
        return balance;
    }
    catch (error) {
        throw new Error(`查询失败: ${error}`);
    }
};
exports.checkBalance = checkBalance;
const checkBalanceBN = async (connection, walletAddress, tokenAddress) => {
    try {
        const walletPublicKey = new web3_js_1.PublicKey(walletAddress);
        // 计算关联的代币账户地址
        const associatedTokenAddress = await (0, spl_token_1.getAssociatedTokenAddress)(tokenAddress, walletPublicKey);
        const accountInfo = await (0, spl_token_1.getAccount)(connection, associatedTokenAddress);
        // 转换余额格式（考虑代币精度）
        const balance = new bignumber_js_1.default(accountInfo.amount);
        return balance;
    }
    catch (error) {
        throw new Error(`查询失败: ${error}`);
    }
};
exports.checkBalanceBN = checkBalanceBN;
