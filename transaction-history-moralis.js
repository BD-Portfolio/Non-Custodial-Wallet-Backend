const axios = require('axios');

const apiKey = ""
const chain_lists = ['eth', 'polygon', 'bsc', 'goerli', 'mumbai', 'bsc testnet'];

const fetchTransactionHistory = async (walletAddress, chainName) => {
    let options = {
        method: 'GET',
        url: "https://deep-index.moralis.io/api/v2/" + walletAddress,
        params: { chain: chainName, from_block: '0' },
        headers: { accept: 'application/json', 'X-API-Key': apiKey }
    };

    const data = await axios.request(options);
    console.log("Response data : ", data.data.result);
}

fetchTransactionHistory("0xEBB9603d319a8A55C05DE2dF3FaF0deb085372E6", chain_lists[4]);