const axios = require('axios');

const getTransactionHistory = async (userWalletAddress) => {

    const apiKey = "";
    const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`;

    const options = {
        method: 'POST',
        url: baseURL,
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        data: {
            id: 1,
            jsonrpc: '2.0',
            method: 'alchemy_getAssetTransfers',
            params: [
                {
                    fromBlock: '0x0',
                    toBlock: 'latest',
                    category: ['external', 'erc20'],
                    withMetadata: false,
                    excludeZeroValue: true,
                    maxCount: '0x3e8',
                    fromAddress: userWalletAddress,
                    order: 'desc'
                }
            ]
        }
    };

    const result = await axios.request(options);
    console.log("result : ", result.data.result.transfers);
}

async function name() {
    await getTransactionHistory('0x9772045316d2506aabB2Ffd36ec41044724CA179');
}

name();