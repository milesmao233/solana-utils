import { Connection, PublicKey } from '@solana/web3.js'
import {
	getAccount,
	getAssociatedTokenAddress,
	getMint,
} from '@solana/spl-token'
import { BN } from '@coral-xyz/anchor'

export const checkBalance = async (
	connection: Connection,
	walletAddress: PublicKey,
	tokenAddress: PublicKey
): Promise<number> => {
	try {
		const mintInfo = await getMint(connection, tokenAddress)

		const walletPublicKey = new PublicKey(walletAddress)

		// 计算关联的代币账户地址
		const associatedTokenAddress = await getAssociatedTokenAddress(
			tokenAddress,
			walletPublicKey
		)

		const accountInfo = await getAccount(connection, associatedTokenAddress)

		// 转换余额格式（考虑代币精度）
		const balance =
			Number(accountInfo.amount) / Math.pow(10, mintInfo.decimals)
		return balance
	} catch (error) {
		throw new Error(`查询失败: ${error}`)
	}
}

export const checkBalanceBN = async (
	connection: Connection,
	walletAddress: PublicKey,
	tokenAddress: PublicKey
): Promise<BN> => {
	try {
		const walletPublicKey = new PublicKey(walletAddress)

		// 计算关联的代币账户地址
		const associatedTokenAddress = await getAssociatedTokenAddress(
			tokenAddress,
			walletPublicKey
		)

		const accountInfo = await getAccount(connection, associatedTokenAddress)

		// 转换余额格式（考虑代币精度）
		const balance = new BN(accountInfo.amount)

		return balance
	} catch (error) {
		throw new Error(`查询失败: ${error}`)
	}
}
