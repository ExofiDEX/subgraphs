import { BigInt } from '@graphprotocol/graph-ts'
import { Transaction } from '../../generated/schema'
import { Transfer as TransferEvent } from '../../generated/Fermion/Fermion'
import { ADDRESS_ZERO, BURN, MINT, TRANSFER } from '../constants'
import { getOrCreateFermion } from './Fermion'

export function getOrCreateTransaction(event: TransferEvent): Transaction
{
  const transaction = Transaction.load(event.transaction.hash.toHex())

  if (transaction === null)
  {
    return createTransaction(event)
  }

  return transaction
}

function createTransaction(event: TransferEvent): Transaction
{
  const id = event.transaction.hash.toHex()
  const transaction = new Transaction(id)
  transaction.from = event.params.from.toHex()
  transaction.to = event.params.to.toHex()
  transaction.amount = event.params.value
  transaction.gasUsed = event.block.gasUsed
  transaction.gasLimit = event.transaction.gasLimit
  transaction.gasPrice = event.transaction.gasPrice
  transaction.block = event.block.number
  transaction.timestamp = event.block.timestamp

  const fermion = getOrCreateFermion()
  fermion.transactionCount = fermion.transactionCount.plus(BigInt.fromU32(1))

  if (isBurning(event))
  {
    transaction.type = BURN
    fermion.totalSupply = fermion.totalSupply.minus(event.params.value)
  }
  else if (isMinting(event))
  {
    transaction.type = MINT
    fermion.totalSupply = fermion.totalSupply.plus(event.params.value)
  }
  else
  {
    transaction.type = TRANSFER
  }

  fermion.save()
  transaction.save()

  return transaction
}

function isMinting(event: TransferEvent): boolean
{
  return event.params.from == ADDRESS_ZERO
}

function isBurning(event: TransferEvent): boolean
{
  return event.params.to == ADDRESS_ZERO
}
