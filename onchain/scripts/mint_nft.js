require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const contract = require("../artifacts/contracts/erc721.sol/FDUVIS.json");
const contractInterface = contract.abi;

let provider = ethers.provider;

const tokenURI = process.env.NFT_URI;
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey);

wallet.provider = provider;
const signer = wallet.connect(provider);

const nft = new ethers.Contract(
  process.env.NFT_ADDR,
  contractInterface,
  signer
);

const user_account = "0x14AcA3C136A931950824D312bC930c2966d1cf9a";

const main = () => {
  nft
    .safeMint(user_account, tokenURI)
    .then((tx) => tx.wait(2))
    .then((receipt) => console.log(`Confirmed! Your transaction receipt is: ${receipt.transactionHash}`))
    .catch((e) => console.log("Something went wrong", e));
};

main();