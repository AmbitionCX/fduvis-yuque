const ethers = require('ethers');
require("dotenv").config({ path: __dirname + '/../.env' });

const contract = require("../artifacts/contracts/fvc-v1.sol/FDUVISCoinV1.json");
const contractInterface = contract.abi;

// Sepolia
const network = "sepolia";
const provider = new ethers.InfuraProvider(
    network,
    process.env.INFURA_API_KEY
);
const signer = new ethers.Wallet(process.env.SEPOLIA_PVK, provider);

const contractInstance = new ethers.Contract(
    process.env.TOKEN_CONTRACT_ADDRESS,
    contractInterface,
    signer
);

const grantToken = async (to, point) => {
    console.log("Waiting for 2 blocks to confirm...");

    let rawTransaction = await contractInstance.transfer(to, point)
    await rawTransaction.wait(2)
    console.log(`Transaction Address: ${rawTransaction.hash}`)
};

let receiver = "0x57C641e614fB9Ca266C8a8e0Ab4285d2fAd74D63";
let amount = 1;

grantToken(receiver, amount)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


//wanghuiting,23011177,tudou-22562133,0x8354C36c6d3a3Fb6345b925Fc177b7E905f7E99e,15
//qiyusheng,22886874,wandou-tpjmo,0x78f39E4207aA91Fa9a414B3D35A7626F654657D5,23
//qinzishu,22897200,qinzishu,0x3A7E984Ce0CCb32c7f368CEFf22BD94C91b47B77,0
//wangyu,12452449,secret-j3erq,0x52B02fB5F8b7e5c6C30860DC8282BbcEC7dC7B7C,20