const Web3 = require('web3');
const url = 'wss://polygon-mumbai.g.alchemy.com/v2/TeOORj8Rot5ZX1I5IfZXeLDeoka8SHyF';
const web3 = new Web3(new Web3.providers.WebsocketProvider(url));

const loggedInUserWalletAddress = "0x7eDB48E49c8144dBe82874D1B46A333d1C10F6C8";

// This code snippet should be placed in the file where this code exectues continuously and checks the events , just like a cron scheduler
web3.eth.subscribe('logs', function (error, result) { })
    .on("data", function (item) {
        item.topics.forEach(data => {
            if (data == web3.utils.padLeft(loggedInUserWalletAddress.toLowerCase(), 64)) {
                // Here it means that we tracked a event where user address is found
                // Here we can call the Alchemy or Moralis API again to get transaction history of that user, so it means that transaction history will refresh automatically whenever any user receives any token or even sends any token to anyone.
            }
        })
    })
    .on("changed", function (log) { })
    .on('error', err => { throw err })
    .on('connected', nr => console.log("Connected", nr))