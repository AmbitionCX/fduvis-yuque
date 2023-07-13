const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  const contract_instance = await hre.ethers.deployContract("FDUVISCoinV1");
  await contract_instance.waitForDeployment();
  console.log("Contract deployed at:", contract_instance.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });