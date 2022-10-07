import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')

export const BIG_DECIMAL_ZERO = BigDecimal.fromString('0')

export const BIG_DECIMAL_ONE = BigDecimal.fromString('1')

export const BIG_INT_ONE = BigInt.fromI32(1)

export const BIG_INT_ZERO = BigInt.fromI32(0)

export const ACC_FERMION_PRECISION = BigInt.fromString('1000000000000')

export const FACTORY_ADDRESS = Address.fromString(
  '{{ factory.address }}{{^factory.address}}0x0000000000000000000000000000000000000000{{/factory.address}}'
)

export const USDC_WETH_PAIR = Address.fromString(
  '{{ usdc_weth_pair }}{{^usdc_weth_pair}}0x0000000000000000000000000000000000000000{{/usdc_weth_pair}}'
)

export const DAI_WETH_PAIR = Address.fromString(
  '{{ dai_weth_pair }}{{^dai_weth_pair}}0x0000000000000000000000000000000000000000{{/dai_weth_pair}}'
)

export const USDT_WETH_PAIR = Address.fromString(
  '{{ usdt_weth_pair }}{{^usdt_weth_pair}}0x0000000000000000000000000000000000000000{{/usdt_weth_pair}}'
)

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '{{ minimum_usd_threshold_new_pairs }}{{^minimum_usd_threshold_new_pairs}}3000{{/minimum_usd_threshold_new_pairs}}'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString(
  '{{ minimum_liquidity_threshold_eth }}{{^minimum_liquidity_threshold_eth}}1{{/minimum_liquidity_threshold_eth}}'
)

export const USDT_ADDRESS = Address.fromString(
  '{{ usdt_address }}{{^usdt_address}}0x0000000000000000000000000000000000000000{{/usdt_address}}'
)

export const USDC_ADDRESS = Address.fromString(
  '{{ usdc_address }}{{^usdc_address}}0x0000000000000000000000000000000000000000{{/usdc_address}}'
)

export const DAI_ADDRESS = Address.fromString(
  '{{ dai_address }}{{^dai_address}}0x0000000000000000000000000000000000000000{{/dai_address}}'
)

export const NATIVE_ADDRESS = Address.fromString(
  '{{ native_address }}{{^native_address}}0x0000000000000000000000000000000000000000{{/native_address}}'
)

export const WHITELIST: Address[] = '{{ whitelist }}'.split(',').map<Address>(x => Address.fromString(x))

// export const WHITELIST: Address[] = [
//   "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
//   "0x6983d1e6def3690c4d616b13597a09e6193ea013",
//   "0x3095c7557bcb296ccc6e363de01b760ba031f2d9",
//   "0x985458e523db3d53125813ed68c274899e9dfab4",
//   "0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f",
//   "0xe176ebe47d621b984a73036b9da5d834411ef734",
// ]

// export const WHITELIST: string[] = [
//   "0x471ece3750da237f93b8e339c536989b8978a438",
//   "0xd629eb00deced2a080b7ec630ef6ac117e614f1b",
//   "0x765de816845861e75a25fca122bb6898b8b1282a",
//   "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73"
// ];
