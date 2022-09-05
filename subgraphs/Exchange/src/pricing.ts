import {
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  DAI_ADDRESS,
  DAI_WETH_PAIR,
  FACTORY_ADDRESS,
  MINIMUM_LIQUIDITY_THRESHOLD_ETH,
  NATIVE_ADDRESS,
  USDC_ADDRESS,
  USDC_WETH_PAIR,
  USDT_ADDRESS,
  USDT_WETH_PAIR,
} from 'const'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import { Pair, Token } from '../generated/schema'

import { Factory as FactoryContract } from '../generated/templates/Pair/Factory'
import { Pair as PairContract } from '../generated/templates/Pair/Pair'

export const factoryContract = FactoryContract.bind(FACTORY_ADDRESS)

export function getEthPrice(block: ethereum.Block | null = null): BigDecimal {
  // fetch eth prices for each stablecoin
  
  const daiPair = Pair.load(DAI_WETH_PAIR.toHex())
  const usdcPair = Pair.load(USDC_WETH_PAIR.toHex())
  const usdtPair = Pair.load(USDT_WETH_PAIR.toHex())

  if (
    daiPair !== null &&
    daiPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH) &&
    usdcPair !== null &&
    usdcPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH) &&
    usdtPair !== null &&
    usdtPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)
  ) {
    const isDaiFirst = Address.fromString(daiPair.token0) == DAI_ADDRESS
    const isUsdcFirst = Address.fromString(usdcPair.token0) == USDC_ADDRESS
    const isUsdtFirst = Address.fromString(usdtPair.token0) == USDT_ADDRESS

    const daiPairEth = isDaiFirst ? daiPair.reserve1 : daiPair.reserve0
    const usdcPairEth = isUsdcFirst ? usdcPair.reserve1 : usdcPair.reserve0
    const usdtPairEth = isUsdtFirst ? usdtPair.reserve1 : usdtPair.reserve0

    const totalLiquidityETH = daiPairEth.plus(usdcPairEth).plus(usdtPairEth)

    const daiWeight = !isDaiFirst ? daiPair.reserve0.div(totalLiquidityETH) : daiPair.reserve1.div(totalLiquidityETH)

    const usdcWeight = !isUsdcFirst
      ? usdcPair.reserve0.div(totalLiquidityETH)
      : usdcPair.reserve1.div(totalLiquidityETH)

    const usdtWeight = !isUsdtFirst
      ? usdtPair.reserve0.div(totalLiquidityETH)
      : usdtPair.reserve1.div(totalLiquidityETH)

    const daiPrice = isDaiFirst ? daiPair.token0Price : daiPair.token1Price

    const usdcPrice = isUsdcFirst ? usdcPair.token0Price : usdcPair.token1Price

    const usdtPrice = isUsdtFirst ? usdtPair.token0Price : usdtPair.token1Price

    return daiPrice.times(daiWeight).plus(usdcPrice.times(usdcWeight)).plus(usdtPrice.times(usdtWeight))

    // dai and USDC have been created
  } else if (
    daiPair !== null &&
    daiPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH) &&
    usdcPair !== null &&
    usdcPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)
  ) {
    const isDaiFirst = Address.fromString(daiPair.token0) == DAI_ADDRESS
    const isUsdcFirst = Address.fromString(usdcPair.token0) == USDC_ADDRESS

    const daiPairEth = isDaiFirst ? daiPair.reserve1 : daiPair.reserve0

    const usdcPairEth = isUsdcFirst ? usdcPair.reserve1 : usdcPair.reserve0

    const totalLiquidityETH = daiPairEth.plus(usdcPairEth)

    const daiWeight = !isDaiFirst ? daiPair.reserve0.div(totalLiquidityETH) : daiPair.reserve1.div(totalLiquidityETH)

    const usdcWeight = !isUsdcFirst
      ? usdcPair.reserve0.div(totalLiquidityETH)
      : usdcPair.reserve1.div(totalLiquidityETH)

    const daiPrice = isDaiFirst ? daiPair.token0Price : daiPair.token1Price

    const usdcPrice = isUsdcFirst ? usdcPair.token0Price : usdcPair.token1Price

    return daiPrice.times(daiWeight).plus(usdcPrice.times(usdcWeight))
    // USDC is the only pair so far
  } else if (usdcPair !== null && usdcPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
    const isUsdcFirst = Address.fromString(usdcPair.token0) == USDC_ADDRESS
    return isUsdcFirst ? usdcPair.token0Price : usdcPair.token1Price
  } else if (usdtPair !== null && usdtPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
    const isUsdtFirst = Address.fromString(usdtPair.token0) == USDT_ADDRESS
    return isUsdtFirst ? usdtPair.token0Price : usdtPair.token1Price
  } else if (daiPair !== null && daiPair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
    const isDaiFirst = Address.fromString(daiPair.token0) == DAI_ADDRESS
    return isDaiFirst ? daiPair.token0Price : daiPair.token1Price
  } else {
    log.warning('No eth pair...', [])
    return BIG_DECIMAL_ZERO
  }
}

export function findEthPerToken(token: Token): BigDecimal {
  if (Address.fromString(token.id) == NATIVE_ADDRESS) {
    return BIG_DECIMAL_ONE
  }

  const whitelist = token.whitelistPairs

  for (let i = 0; i < whitelist.length; ++i) {
    const pairAddress = whitelist[i]
    const pair = Pair.load(pairAddress)!

    if (pair.token0 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
      const token1 = Token.load(pair.token1)!

      return pair.token1Price.times(token1.derivedETH as BigDecimal) // return token1 per our token * Eth per token 1
    }

    if (pair.token1 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
      const token0 = Token.load(pair.token0)!
      return pair.token0Price.times(token0.derivedETH as BigDecimal) // return token0 per our token * ETH per token 0
    }
  }

  return BIG_DECIMAL_ZERO // nothing was found return 0
}
