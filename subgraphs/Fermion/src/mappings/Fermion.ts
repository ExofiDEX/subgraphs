import { Transfer as TransferEvent } from "../../generated/Fermion/Fermion"
import { UserType } from "../enums"
import { getOrCreateTransaction } from "../functions/Transaction";
import { getOrCreateUser } from "../functions/User"


export function handleTransfer(event: TransferEvent): void
{
	const sender = getOrCreateUser(UserType.SENDER, event);
	const reciever = getOrCreateUser(UserType.RECIEVER, event);
	getOrCreateTransaction(event);
	
	sender.balance = sender.balance.minus(event.params.value)
	sender.modifiedAtBlock = event.block.number
	sender.modifiedAtTimestamp = event.block.timestamp
	sender.save()

	reciever.balance = reciever.balance.plus(event.params.value)
	reciever.modifiedAtBlock = event.block.number
	reciever.modifiedAtTimestamp = event.block.timestamp
	reciever.save()
}
