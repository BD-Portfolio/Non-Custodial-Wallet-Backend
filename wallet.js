const Web3 = require("web3");
const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');
const detailsOfNetworks = require('./config');

let web3;

const getWeb3Connection = (network) => {
    const details = detailsOfNetworks.getNetworkDetails(network);
    const connection = new Web3(details.jsonRpc);
    web3 = connection;
    return connection;
}

const generateMnemonic = () => {
    const generatedMnemonics = bip39.generateMnemonic(128).split(' ');
    return generatedMnemonics;
}

const generateWalletUsingKeyStore = async (password) => {
    const mnemonics = await generateMnemonic();
    const mnemonicsInString = mnemonics.join(' ');
    const wallet = await accessWalletUsingMnemonic(mnemonicsInString);
    console.log(wallet);
    const encryptedWallet = await encryptWallet(wallet.privateKey, password);
    return Buffer.from(JSON.stringify(encryptedWallet)).toString('base64');
}

const accessWalletUsingMnemonic = async (mnemonics) => {
    const wallet_hdpath = "m/44'/60'/0'/0/0";
    const seed = bip39.mnemonicToSeedSync(mnemonics);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet = hdwallet.derivePath(wallet_hdpath).getWallet();
    const createdWallet = web3.eth.accounts.wallet.add(wallet.getPrivateKeyString());
    return createdWallet;
}

const accessWalletUsingPrivateKey = (privateKey) => {
    const wallet = web3.eth.accounts.wallet.add(privateKey);
    return wallet;
}

const accessWalletUsingKeystore = async (encryptedWallet, password) => {
    const parsedWallet = Buffer.from(encryptedWallet, 'base64').toString();
    const decryptedWallet = await decryptWallet(parsedWallet, password);
    const wallet = web3.eth.accounts.wallet.add(decryptedWallet.privateKey);
    return wallet;
}

const encryptWallet = async (privateKey, walletPassword) => {
    const encryptedWallet = await web3.eth.accounts.encrypt(privateKey, walletPassword);
    return encryptedWallet;
};

const decryptWallet = async (encryptedWallet, walletPassword) => {
    const decryptedWallet = await web3.eth.accounts.decrypt(encryptedWallet, walletPassword);
    return decryptedWallet;
}

const isWalletAddressValid = async (address) => {
    const result = web3.utils.isAddress(address);
    return result;
}

const isPrivateKeyValid = (privateKey) => {
    if (typeof (privateKey) !== "string" || !privateKey.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (privateKey.length != 66) {
        return false;
    }
    return true;
}

const test = async () => {
    const network = detailsOfNetworks.getAllNetworkNames();
    getWeb3Connection(network[0]);
    // const walletUsingKeystore = await generateWalletUsingKeyStore("Test@123");
    // console.log("Keystore encrypted wallet : ", walletUsingKeystore);
    // const walletDecrypted = await accessWalletUsingKeystore(walletUsingKeystore, "Test@123");
    // console.log("Keystore Decrypted wallet : ", walletDecrypted);
}

test();
