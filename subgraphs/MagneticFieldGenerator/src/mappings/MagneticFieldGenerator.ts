import {
  Deposit,
  Withdraw,
  EmergencyWithdraw,
  Harvest,
  LogPoolAddition,
  LogSetPool,
  LogUpdatePool
} from '../../generated/MagneticFieldGenerator/MagneticFieldGenerator'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import { ACC_FERMION_PRECISION } from '../../../../packages/constants'
import { MagneticFieldGenerator, Pool, User } from '../../generated/schema'
import {
  getMagneticFieldGenerator,
  getPool,
  getUser
} from '../entities'

export function handleLogPoolAddition(event: LogPoolAddition): void
{
  log.info('[MagneticFieldGenerator] Log Pool Addition {} {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.lpToken.toHex()
  ])

  const magneticFieldGenerator = getMagneticFieldGenerator(event.block)
  const pool = getPool(event.params.pid, event.block)

  pool.pair = event.params.lpToken
  pool.allocPoint = event.params.allocPoint
  pool.save()

  magneticFieldGenerator.totalAllocPoint = magneticFieldGenerator.totalAllocPoint.plus(pool.allocPoint)
  magneticFieldGenerator.poolCount = magneticFieldGenerator.poolCount.plus(BigInt.fromI32(1))
  magneticFieldGenerator.save()
}

export function handleLogSetPool(event: LogSetPool): void
{
  log.info('[MagneticFieldGenerator] Log Set Pool {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString()])

  const magneticFieldGenerator = getMagneticFieldGenerator(event.block)
  const pool = getPool(event.params.pid, event.block)

  magneticFieldGenerator.totalAllocPoint = magneticFieldGenerator.totalAllocPoint.plus(event.params.allocPoint.minus(pool.allocPoint))
  magneticFieldGenerator.save()

  pool.allocPoint = event.params.allocPoint
  pool.save()
}

export function handleLogUpdatePool(event: LogUpdatePool): void
{
  log.info('[MagneticFieldGenerator] Log Update Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.lastRewardBlock.toString(),
    event.params.lpSupply.toString(),
    event.params.accFermionPerShare.toString()
  ])

  const magneticFieldGenerator = getMagneticFieldGenerator(event.block)
  const pool = getPool(event.params.pid, event.block)

  pool.accFermionPerShare = event.params.accFermionPerShare
  pool.lastRewardBlock = event.params.lastRewardBlock
  pool.save()
}

export function handleDeposit(event: Deposit): void {
  log.info('[MagneticFieldGenerator] Log Deposit {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const magneticFieldGenerator = getMagneticFieldGenerator(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.to, event.params.pid, event.block)

  pool.slpBalance = pool.slpBalance.plus(event.params.amount)
  if (!user.pool && event.params.amount.gt(BigInt.zero()))
  {
    user.pool = pool.id
    pool.userCount = pool.userCount.plus(BigInt.fromU32(1))
  }

  pool.save()

  user.amount = user.amount.plus(event.params.amount)
  user.rewardDebt = user.rewardDebt.plus(event.params.amount.times(pool.accFermionPerShare).div(ACC_FERMION_PRECISION))
  user.save()
}

export function handleWithdraw(event: Withdraw): void {
  log.info('[MagneticFieldGenerator] Log Withdraw {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const magneticFieldGenerator = getMagneticFieldGenerator(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  pool.slpBalance = pool.slpBalance.minus(event.params.amount)
  if (user.amount.equals(BigInt.zero()))
  {
    user.pool = null
    pool.userCount = pool.userCount.minus(BigInt.fromU32(1))
  }
  pool.save()

  user.amount = user.amount.minus(event.params.amount)
  user.rewardDebt = user.rewardDebt.minus(event.params.amount.times(pool.accFermionPerShare).div(ACC_FERMION_PRECISION))
  user.save()
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void
{
  log.info('[MagneticFieldGenerator] Log Emergency Withdraw {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const magneticFieldGeneratorV2 = getMagneticFieldGenerator(event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  user.amount = BigInt.zero()
  user.rewardDebt = BigInt.zero()
  user.save()
}

export function handleHarvest(event: Harvest): void
{
  log.info('[MagneticFieldGenerator] Log Withdraw {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString()
  ])

  const magneticFieldGenerator = getMagneticFieldGenerator(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  let accumulatedFermion = user.amount.times(pool.accFermionPerShare).div(ACC_FERMION_PRECISION)

  user.rewardDebt = accumulatedFermion
  user.fermionHarvested = user.fermionHarvested.plus(event.params.amount)
  user.save()
}
