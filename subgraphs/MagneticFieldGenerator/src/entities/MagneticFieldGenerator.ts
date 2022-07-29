import { MagneticFieldGenerator } from '../../generated/schema'
import { BigInt, dataSource, ethereum } from '@graphprotocol/graph-ts'

export function getMagneticFieldGenerator(block: ethereum.Block): MagneticFieldGenerator
{
	let magneticFieldGenerator = MagneticFieldGenerator.load(dataSource.address().toHex())

	if (magneticFieldGenerator === null)
	{
		magneticFieldGenerator = new MagneticFieldGenerator(dataSource.address().toHex())
		magneticFieldGenerator.totalAllocPoint = BigInt.zero();
		magneticFieldGenerator.poolCount = BigInt.zero();
	}

	magneticFieldGenerator.timestamp = block.timestamp
	magneticFieldGenerator.block = block.number
	magneticFieldGenerator.save()

	return magneticFieldGenerator
}
