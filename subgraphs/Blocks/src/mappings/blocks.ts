import {
    BigInt,
    ethereum,
    log,
    store
} from "@graphprotocol/graph-ts"

import {
    StatisticBlock
} from "../../generated/schema"

export function handleBlock(block: ethereum.Block): void {

    let sb = StatisticBlock.load("Summary");
    if (sb === null)
    {
        let first = StatisticBlock.load("First");
        if(first === null)
        {
            first = getBlock("First");
            first = lastBlock(first, block);
            first.lastBlockTimeMs = BigInt.zero();
            first.minBlockTimeMs = BigInt.zero();
            first.maxBlockTimeMs = BigInt.zero();
            first.slidingBlockTimeMs = BigInt.zero();
            first.minDifficulty = BigInt.zero();
            first.maxDifficulty = BigInt.zero();
            first.slidingDifficulty = BigInt.zero();
            first.minGasUsed = BigInt.zero();
            first.maxGasUsed = BigInt.zero();
            first.slidingGasUsed = BigInt.zero();
            first.minGasLimit = BigInt.zero();
            first.maxGasLimit = BigInt.zero();
            first.slidingGasLimit = BigInt.zero();
            first.minSize = BigInt.zero();
            first.maxSize = BigInt.zero();
            first.slidingSize = BigInt.zero();
            first.save();
        }
        else
        {
            let second = getBlock("Second");
            second = lastBlock(second, block);
            second.lastBlockTimeMs = BigInt.zero();
            second.minBlockTimeMs = BigInt.zero();
            second.maxBlockTimeMs = BigInt.zero();
            second.slidingBlockTimeMs = BigInt.zero();
            second.minDifficulty = BigInt.zero();
            second.maxDifficulty = BigInt.zero();
            second.slidingDifficulty = BigInt.zero();
            second.minGasUsed = BigInt.zero();
            second.maxGasUsed = BigInt.zero();
            second.slidingGasUsed = BigInt.zero();
            second.minGasLimit = BigInt.zero();
            second.maxGasLimit = BigInt.zero();
            second.slidingGasLimit = BigInt.zero();
            second.minSize = BigInt.zero();
            second.maxSize = BigInt.zero();
            second.slidingSize = BigInt.zero();
            second.save();
            sb = getBlock("Summary");
            sb = lastBlock(sb, block)
            sb.lastBlockTimeMs = second.lastTimestamp.minus(first.lastTimestamp).times(BigInt.fromU32(1000));
            sb.minBlockTimeMs = sb.lastBlockTimeMs;
            sb.maxBlockTimeMs = sb.lastBlockTimeMs;
            sb.slidingBlockTimeMs = sb.lastBlockTimeMs;
            sb.minDifficulty = min(first.lastDifficulty, second.lastDifficulty);
            sb.maxDifficulty = max(first.lastDifficulty, second.lastDifficulty);
            sb.slidingDifficulty = calculateSliding(sb.minDifficulty, sb.maxDifficulty);
            sb.minGasUsed = min(first.lastGasUsed, second.lastGasUsed);
            sb.maxGasUsed = max(first.lastGasUsed, second.lastGasUsed);
            sb.slidingGasUsed = calculateSliding(sb.minGasUsed, sb.maxGasUsed);
            sb.minGasLimit = min(first.lastGasLimit, second.lastGasLimit);
            sb.maxGasLimit = max(first.lastGasLimit, second.lastGasLimit);
            sb.slidingGasLimit = calculateSliding(sb.minGasLimit, sb.maxGasLimit);
            sb.minSize = min(first.lastSize, second.lastSize);
            sb.maxSize = max(first.lastSize, second.lastSize);
            sb.slidingSize = calculateSliding(sb.minSize, sb.maxSize);
            sb.save();
            store.remove("StatisticBlock", "First");
            store.remove("StatisticBlock", "Second");
        }
    }
    else
    {
        sb.lastBlockTimeMs = block.timestamp.minus(sb.lastTimestamp).times(BigInt.fromU32(1000));
        sb.minBlockTimeMs = min(sb.lastBlockTimeMs, sb.minBlockTimeMs);
        sb.maxBlockTimeMs = max(sb.lastBlockTimeMs, sb.maxBlockTimeMs);
        sb = lastBlock(sb, block); // Set last Blocks here so that lastBlockTimeMs is calculated correctly.
        sb.slidingBlockTimeMs = calculateSliding(sb.lastBlockTimeMs,sb.slidingBlockTimeMs);
        sb.minDifficulty = min(block.difficulty, sb.minDifficulty);
        sb.maxDifficulty = max(block.difficulty, sb.maxDifficulty);
        sb.slidingDifficulty = calculateSliding(block.difficulty, sb.slidingDifficulty);
        sb.minGasUsed = min(block.gasUsed, sb.minGasUsed);
        sb.maxGasUsed = max(block.gasUsed, sb.maxGasUsed);
        sb.slidingGasUsed = calculateSliding(block.gasUsed, sb.slidingGasUsed);
        sb.minGasLimit = min(block.gasLimit, sb.minGasLimit);
        sb.maxGasLimit = max(block.gasLimit, sb.maxGasLimit);
        sb.slidingGasLimit = calculateSliding(block.gasLimit, sb.slidingGasLimit);
        // sb.lastSize is already set to current Size
        sb.minSize = min(sb.lastSize, sb.minSize);
        sb.maxSize = max(sb.lastSize, sb.maxSize);
        sb.slidingSize = calculateSliding(sb.lastSize, sb.slidingSize);
        sb.save();
    }
  }

  function calculateSliding(oldValue: BigInt, newValue: BigInt): BigInt
  {
    const nValue = newValue === BigInt.zero() ? BigInt.fromU32(1) : newValue;
    const oValue = oldValue === BigInt.zero() ? BigInt.fromU32(1) : oldValue;
    return oValue.times(nValue).sqrt(); // can never be 0;
  }

  function min(a: BigInt, b: BigInt): BigInt
  {
    return a < b ? a : b;
  }

  function max(a: BigInt, b: BigInt): BigInt
  {
    return a > b ? a : b;
  }

  function getBlock(id: string): StatisticBlock
  {
    let sBlock = StatisticBlock.load(id);
    if(sBlock === null)
    {
        sBlock = new StatisticBlock(id);
    }
    return sBlock;
  }

  function lastBlock(sBlock: StatisticBlock, block: ethereum.Block): StatisticBlock
  {
    sBlock.lastBlockNumber = block.number;
    sBlock.lastTimestamp = block.timestamp;
    sBlock.lastDifficulty = block.difficulty;
    sBlock.lastGasUsed = block.gasUsed;
    sBlock.lastGasLimit = block.gasLimit;
    sBlock.lastSize = block.size !== null ? block.size! : BigInt.zero();

    return sBlock;
  }
