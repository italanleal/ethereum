const { Web3 } = require('web3');
const Wallet = require('ethereumjs-wallet');

const {
    randomBytes,
  } = require('node:crypto');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

async function checkBalance(walletAddress) {
    try {
        const balance = await web3.eth.getBalance(walletAddress);
        console.log(`Balance for wallet address ${walletAddress}: ${web3.utils.fromWei(balance, 'ether')} ETH`);
    } catch (error) {
        console.error('Error:', error);
    }

}

async function Purge(){

    await checkBalance(Wallet.default.fromPrivateKey(randomBytes(32)).getAddressString())
    Purge()
}

Purge()