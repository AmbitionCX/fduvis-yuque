const ethers = require('ethers');
require("dotenv").config({ path: __dirname + '/../.env' });

const contract = require("../artifacts/contracts/nft-v1.sol/FDUVISNFTV1.json");
const contractInterface = contract.abi;

// Sepolia
const network = "sepolia";
const provider = new ethers.InfuraProvider(
    network,
    process.env.INFURA_API_KEY
);
const signer = new ethers.Wallet(process.env.SEPOLIA_PVK, provider);

const contractInstance = new ethers.Contract(
    process.env.NFT_CONTRACT_ADDRESS,
    contractInterface,
    signer
);

const mintNFT = async (to, uri) => {

    let rawTransaction = await contractInstance.safeMint(to, uri);
    let receipt = await rawTransaction.wait();

    const mint_log = receipt.logs.filter(function (item) { return item.topics[0] === "0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885"; })
    const mint_to = "0x" + mint_log[0].topics[1].slice(26, 66);
    const mint_tokenid = parseInt(mint_log[0].topics[2], 16);
    
    console.log(`Transaction Address: ${rawTransaction.hash}`);
    console.log(`Mint token ${mint_tokenid} to address: ${mint_to}`);
};

let receiver = "0x57C641e614fB9Ca266C8a8e0Ab4285d2fAd74D63";
let nftUri = "https://example.com";

mintNFT(receiver, nftUri)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });