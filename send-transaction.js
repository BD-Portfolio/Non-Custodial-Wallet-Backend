const Web3 = require("web3");
const detailsOfNetworks = require('./config');
const utilities = require('./utils/web3-utils');

let web3;

const getWeb3Connection = (network) => {
    const details = detailsOfNetworks.getNetworkDetails(network);
    const connection = new Web3(details.jsonRpc);
    web3 = connection;
    return connection;
}

/*
    @info This method is used to send Native (ETH,MATIC,BNB) token to someone
    @param amountToSend -> This is the amount entered by the user in frontend , its in string format
    @param decimals -> its the decimals of the token selected by the user to send to someone
    @param recipientAddress -> recipient wallet address
    @params enderWalletAddress -> sender's wallet address
    @param sendersPrivateKey -> private key of sender
*/  
const sendNativeToken = async (amountToSend, decimals, recipientAddress, senderWalletAddress, sendersPrivateKey) => {
    try {

        // convert amount to send from string to wei format
        const amountInWei = convertToWei(
            amountToSend.toString(),
            decimals,
        );

        // get the estimated gas for transaction
        const gasLimit = await web3.eth.estimateGas({
            to: recipientAddress,
            from: senderWalletAddress,
            value: amountInWei,
        });

        // if user has sufficient balance for the transaction
        const result = await utilities.doesWalletHaveSufficientBalanceForTransaction(gasLimit.toString(), senderWalletAddress, true, amountInWei);
        
        if (result) {
            const tx = {
                gas: web3.utils.toHex(gasLimit.toString()),
                to: recipientAddress,
                value: amountInWei.toString(),
                from: senderWalletAddress,
            };
            // signing transaction
            const signedTx = await web3.eth.accounts.signTransaction(
                tx,
                sendersPrivateKey,
            );
            // send transaction
            await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            return { status: true, message: "Transaction successful" };
        } else {
            return { status: false, message: "Insufficient balance" };
        }
    } catch (error) {
        return { status: false, message: "Transaction failed" };
    }
};


/*
    @info This method is used to send ERC20 (DAI,SAND,WBTC,AAVE) token to someone
    @param amountToSend -> This is the amount entered by the user in frontend , its in string format
    @param decimals -> its the decimals of the token selected by the user to send to someone
    @param contractInstance -> erc20 token contract instance
    @param tokenContractAddress -> erc20 token contract address
    @param recipientAddress -> recipient wallet address
    @params enderWalletAddress -> sender's wallet address
    @param sendersPrivateKey -> private key of sender
*/
const sendERC20Token = async (amountToSend, decimals, contractInstance, tokenContractAddress, recipientAddress, senderWalletAddress, sendersPrivateKey) => {
    try {
        // convert amount to wei
        const amountInWei = convertToWei(amountToSend.toString(), decimals);

        // calculate gas limit
        const gasLimit = await contractInstance.methods
            .transfer(recipientAddress, amountInWei)
            .estimateGas({ from: senderWalletAddress });

        // calculate buffer gas limit
        const bufferedGasLimit = utilities.calculateBufferedGasLimit(gasLimit);

        // encode data of transaction
        const encodedData = contractInstance.methods
            .transfer(recipientAddress, amountInWei)
            .encodeABI();

        // if user has sufficient balance
        const result = await utilities.doesWalletHaveSufficientBalanceForTransaction(bufferedGasLimit.toString(), senderWalletAddress, false, 0);

        if (result) {
            const tx = {
                gas: web3.utils.toHex(bufferedGasLimit),
                to: tokenContractAddress,
                value: '0x00',
                data: encodedData,
                from: senderWalletAddress,
            };

            const signedTx = await web3.eth.accounts.signTransaction(tx, sendersPrivateKey);

            await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            return { status: true, message: "Transaction successful" };

        } else {
            return { status: false, message: "Insufficient balance" };
        }
    } catch (error) {
        return { status: false, message: "Transaction failed" };
    }
};
