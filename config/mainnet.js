module.exports =
{
	network: "mainnet",
	fermion:
	{
		address: "0xB3acCd620760C8F980cbBb0Bc4BE9FcA83C5eD87",
		startBlock: 15684320
	},
	magneticFieldGenerator:
	{
		address: "0x1FbA7468df3344Bfca255cDE4f0542c1195984A0",
		startBlock: 15684320
	},
	factory:
	{
		address: "0xdbA29F325ee52FA2B6D85692d98D3E52A34e443f",
		startBlock: 15684320
	},
	usdc_weth_pair: "0xc4c62A0555B5C5886D21B2201aa92e622eAE561e",
	dai_weth_pair:  "0xb9a6c52b608C7B4d6B78d75D49Ca82cf9F15e684",
	usdt_weth_pair: "0xd56b20eF7D041bc8a4a81F535edC20CfEA81F851",
	minimum_usd_threshold_new_pairs: "3000",
	minimum_liquidity_threshold_eth: "3",
	usdt_address:   "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	usdc_address:   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
	dai_address:    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
	native_address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
	whitelist:  "0xB3acCd620760C8F980cbBb0Bc4BE9FcA83C5eD87," + // EXOFI
				"0xdAC17F958D2ee523a2206206994597C13D831ec7," + // USDT
				"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48," + // USDC
				"0x6B175474E89094C44Da98b954EedeAC495271d0F," + // DAI
				"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2," + // WETH
				"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599," + // WBTC
				"0x853d955aCEf822Db058eb8505911ED77F175b99e"    // FRAX
}