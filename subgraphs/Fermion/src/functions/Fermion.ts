import { BigInt } from "@graphprotocol/graph-ts";
import { Fermion } from "../../generated/schema";
import { FERMION } from "../constants";

export function getOrCreateFermion(): Fermion
{
	let fermion = Fermion.load(FERMION);

	if(fermion == null)
	{
		fermion = new Fermion(FERMION);
		fermion.userCount = BigInt.zero();
		fermion.transactionCount = BigInt.zero();
		fermion.totalSupply = BigInt.zero();
		fermion.save();
		return fermion;
	}

	return fermion;
}