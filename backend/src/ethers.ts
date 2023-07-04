import * as ethers from 'ethers'
import * as path from 'path';
import dotenv from "dotenv";

const env_path = path.resolve(`${__dirname}/../.env`);
dotenv.config({path: env_path});

const provider = new ethers.JsonRpcProvider(process.env.INFURA_SEPOLIA_RPC);

export const run = async (): Promise<boolean> => {
    console.log("getting latest blocknumber...")
    const latestBlockNumber = await provider.getBlockNumber()
    console.log("latest blockNumber:", latestBlockNumber)
  
    console.log(`getting block ${latestBlockNumber}...`)
    const block = await provider.getBlock(latestBlockNumber)
    console.log(`block ${latestBlockNumber}:`, block)
  
    return true
  }