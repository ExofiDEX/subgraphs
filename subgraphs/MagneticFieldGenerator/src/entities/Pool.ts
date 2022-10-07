import { Pool } from '../../generated/schema'
import { BigInt, Address, dataSource, ethereum } from '@graphprotocol/graph-ts'
import { getMagneticFieldGenerator } from './MagneticFieldGenerator'

export function getPool(pid: BigInt, block: ethereum.Block): Pool
{
	const magneticFieldGenerator = getMagneticFieldGenerator(block)

	let pool = Pool.load(pid.toString())

	if (pool === null)
	{
		pool = new Pool(pid.toString())
		pool.magneticFieldGenerator = magneticFieldGenerator.id
		pool.pair = Address.zero();
		pool.allocPoint = BigInt.zero()
		pool.lastRewardBlock = BigInt.zero()
		pool.accFermionPerShare = BigInt.zero()
		pool.slpBalance = BigInt.zero()
		pool.userCount = BigInt.zero()
	}

	pool.timestamp = block.timestamp
	pool.block = block.number
	pool.save()

	return pool
}