const Web3 = require('web3');
const fs = require('fs');
const {sql} = require('@databases/pg');
const db = require('./database');
const Transaction = require('ethereumjs-tx').Transaction;
require('dotenv').config();

async function sendTransaction(toAddress, amount){

  const web3_endpoint = process.env.WEB3_ENDPOINT;
  const web3 = new Web3(web3_endpoint);
  web3.eth.defaultChain = 'goerli';

  const private_key = process.env.PRIVATE_KEY;
  const account = web3.eth.accounts.privateKeyToAccount(private_key);

  const nonce = await web3.eth.getTransactionCount(account.address, 'pending');
  const abiArray = JSON.parse(fs.readFileSync('abi.json', 'utf-8'));
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contract = new web3.eth.Contract(abiArray, contractAddress);

  const default_gas_limit = 60000;
  const default_gas_price = web3.utils.toWei('5', 'gwei');
  const rawTransaction = {
    "from"    : account.address,
    "to"      : contractAddress,
    "value"   : "0x0",
    "nonce"   : web3.utils.toHex(nonce),
    "gasLimit": web3.utils.toHex(default_gas_limit),
    "gasPrice": web3.utils.toHex(default_gas_price),
    "data"    : contract.methods.transfer(toAddress, amount).encodeABI(),
    "chainId" : 5
  };

  const transaction = new Transaction(rawTransaction, { chain: 'goerli' });
  transaction.sign(Buffer.from(account.privateKey.substring(2,66), 'hex'));
  var serializedTransaction = transaction.serialize();
  web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, txHash) => {
    if (!err) { console.log(txHash); }
    else { console.log(err); }
  });
}

async function getBalance(walletAddress){
  
  const web3_endpoint = process.env.WEB3_ENDPOINT;
  const web3 = new Web3(web3_endpoint);
  web3.eth.defaultChain = 'goerli';

  const abiArray = JSON.parse(fs.readFileSync('abi.json', 'utf-8'));
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contract = new web3.eth.Contract(abiArray, contractAddress);

  balance = await contract.methods.balanceOf(walletAddress).call();
  return balance;
}

async function UpdateBalance(){
  
  let wallets = await db.query(sql`select user_wallet from yq_users`);
  for (let i = 0; i < wallets.length; i++){
    let user_wallet = wallets[i].user_wallet;
    let balance = await getBalance(user_wallet);
    await db.query(sql`update yq_users set user_balance = ${balance} where user_wallet = ${user_wallet}`);
  }
}

module.exports = {sendTransaction, UpdateBalance};