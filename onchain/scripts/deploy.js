async function deploy_token() {

    const [deployer] = await ethers.getSigners();  
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await ethers.getContractFactory("KToken");
    const token = await Token.deploy();
  
    console.log("Token address:", token.address);
}

async function deploy_nft() {

    const [deployer] = await ethers.getSigners();  
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const NFT = await ethers.getContractFactory("FDUVIS");
    const nft = await NFT.deploy();
  
    console.log("NFT address:", nft.address);
}

deploy_nft()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// token address: 0xDAA0fB931ef3bA2335F10A3d92174CfF73c49C57
// nft address: 0x6C82514Ab5b149A726c360060d4DDBD946fBeFd3