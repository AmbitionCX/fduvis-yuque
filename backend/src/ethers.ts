import * as ethers from 'ethers'
import * as path from 'path';
import dotenv from "dotenv";

const env_path = path.resolve(`${__dirname}/../.env`);
dotenv.config({ path: env_path });

const contract_path = path.resolve(`${__dirname}/../../onchain/artifacts/contracts/fvc-v1.sol/FDUVISCoinV1.json`);
const contract = require(contract_path);
const contractInterface = contract.abi;

// Sepolia
const network = "sepolia";
const provider = new ethers.InfuraProvider(
  network,
  process.env.INFURA_API_KEY
);
const signer = new ethers.Wallet(String(process.env.SEPOLIA_PVK), provider);

const contractInstance = new ethers.Contract(
  String(process.env.TOKEN_CONTRACT_ADDRESS),
  contractInterface,
  signer
);

export const grantToken = async (to: string, point: number) => {
  let rawTransaction = await contractInstance.transfer(to, point);
  await rawTransaction.wait();

  return rawTransaction.hash;
};

export const queryBalance = async (address: string) => {
  let balace = await contractInstance.balanceOf(address);

  return balace;
}