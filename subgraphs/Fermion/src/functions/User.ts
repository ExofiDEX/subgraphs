import { Transfer as TransferEvent } from '../../generated/Fermion/Fermion'
import { User } from '../../generated/schema'
import { UserType } from '../enums'
import { getOrCreateFermion } from './Fermion'
import { BigInt } from '@graphprotocol/graph-ts'

export function createUser(id: string, event: TransferEvent): User
{
  const user = new User(id)
  user.createdAtBlock = event.block.number
  user.createdAtTimestamp = event.block.timestamp
  user.modifiedAtBlock = event.block.number
  user.modifiedAtTimestamp = event.block.timestamp
  user.balance = BigInt.zero();
  user.save()

  const fermion = getOrCreateFermion()
  fermion.userCount = fermion.userCount.plus(BigInt.fromU32(1))
  fermion.save()
  return user
}

export function getOrCreateUser(type: UserType, event: TransferEvent): User
{
  const id = type === UserType.SENDER ? event.params.from.toHex() : event.params.to.toHex()
  const user = User.load(id)

  if (user === null)
  {
    return createUser(id, event)
  }

  return user;
}