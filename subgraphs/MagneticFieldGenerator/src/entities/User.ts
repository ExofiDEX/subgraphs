import { User } from '../../generated/schema'
import { BigInt, Address, ethereum } from '@graphprotocol/graph-ts'
import { getMagneticFieldGenerator } from './MagneticFieldGenerator'
import { getPool } from './Pool'

export function getUser(address: Address, pid: BigInt, block: ethereum.Block): User
{
	const magneticFieldGenerator = getMagneticFieldGenerator(block)
	const pool = getPool(pid, block)

	const uid = address.toHex()
	const id = pid.toString().concat('-').concat(uid)
	let user = User.load(id)

	if (user === null)
	{
		user = new User(id)
		user.address = address
		user.pool = pool.id
		user.amount = BigInt.zero();
		user.rewardDebt = BigInt.zero();
		user.fermionHarvested = BigInt.zero();

		pool.userCount = pool.userCount.plus(BigInt.fromU32(1));
		pool.save()
	}

	user.timestamp = block.timestamp
	user.block = block.number
	user.save()

	return user
}
