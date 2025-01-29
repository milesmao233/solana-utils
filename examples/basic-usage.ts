import { Connection, PublicKey } from '@solana/web3.js'
import { checkBalanceBN, checkBalance } from '../src'

// 这是一个基础示例，展示如何使用工具包的主要功能

async function main() {
	try {
		// 连接到 Solana 开发网络
		const connection = new Connection(
			'https://api.mainnet-beta.solana.com/'
		)
		// 这里替换为你的钱包地址
		const walletAddress = new PublicKey(
			'6xtHfk4RTLDkmxiPvaPWbmkSmCQWqtCvRH8QZmkKgbuV'
		)
		const usdcAddress = new PublicKey(
			'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
		)

		// 检查余额
		const balance: Number = await checkBalance(
			connection,
			walletAddress,
			usdcAddress
		)
		console.log(`钱包余额: ${balance} USDC`)

		const balanceBN = await checkBalanceBN(
			connection,
			walletAddress,
			usdcAddress
		)
		console.log(`钱包余额: ${balanceBN} USDC`)

		// 其他功能测试可以在这里添加...
	} catch (error) {
		console.error('发生错误:', error)
	}
}

main()
