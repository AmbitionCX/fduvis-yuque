const { expect } = require("chai");

describe("NFT Contract", function () {
    it("Get event logs", async function () {
        const [owner] = await ethers.getSigners();
        const nftContract = await ethers.deployContract("FDUVISNFTV1");

        let nftUri = "https://example.com";

        let rawTransaction = await nftContract.safeMint(owner.address, nftUri);
        let receipt = await rawTransaction.wait();

        // Mint event topic: Keccak256(Mint(address,uint256))
        // 0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885
        const mint_log = receipt.logs.filter(function(item) { return item.topics[0] === "0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885"; })

        const mint_to = "0x" + mint_log[0].topics[1].slice(26, 66);
        const mint_tokenid = parseInt(mint_log[0].topics[2], 16);
        console.log(`Transaction Address: ${rawTransaction.hash}`);
        console.log(`Mint token ${mint_tokenid} to address: ${mint_to}`);
    });
});