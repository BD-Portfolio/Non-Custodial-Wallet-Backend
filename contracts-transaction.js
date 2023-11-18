const Web3 = require("web3");
const detailsOfNetworks = require('./config');

let web3;

const getWeb3Connection = (network) => {
    const details = detailsOfNetworks.getNetworkDetails(network);
    const connection = new Web3(details.jsonRpc);
    web3 = connection;
    return connection;
}

// This function needs to be written for each different type of smart contract function to be called
const sendTransactionFromContract = async (amountSend, etherAmount, tokenSelected, contractInstance, recipientAddress, loggedInUser) => {
    try {

        // if any amount is to send, convert it to wei 
        const amountInWei = amountSend ? convertToWei(
            amountSend.toString(),
            tokenSelected.decimals,
        ) : '0';

        // if any ether amount is to send, convert it to wei 
        const totalEthInWei = etherAmount ? convertToWei(
            etherAmount.toString(),
            '18',
        ) : '0';

        const gasLimit = await contractInstance.methods
            .transfer(recipientAddress, amountInWei)
            .estimateGas({
                from: loggedInUser,
                ...(!!parseFloat(totalEthInWei.toString())) && { value: totalEthInWei }
            });

        const bufferedGasLimit = Math.round(
            Number(gasLimit) + Number(gasLimit) * Number(0.2),
        );

        const encodedData = contractInstance.methods
            .transfer(recipientAddress, amountInWei)
            .encodeABI();

        return await executeTransaction(
            bufferedGasLimit,
            totalEthInWei,
            encodedData,
            loggedInUser
        );

    } catch (error) {
        return { status: false, message: 'Transaction failed due to exception!' };
    }
}

// No need to change this function, this will remain as it is
const executeTransaction = async (
    bufferedGasLimit,
    totalEthInWei,
    encodedData,
    loggedInUser
) => {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        const transactionFee =
            parseFloat(gasPrice) * parseFloat(bufferedGasLimit);
        const balanceInWei = await web3.eth.getBalance(loggedInUser);
        const overallEth = parseFloat(totalEthInWei) + transactionFee;
        if (overallEth <= parseFloat(balanceInWei)) {
            const tx = {
                gas: web3.utils.toHex(bufferedGasLimit),
                to: smartContractAddress,
                ...(!!parseFloat(totalEthInWei.toString())) && { value: totalEthInWei.toString() },
                data: encodedData,
                from: loggedInUser,
            };

            const signedTx = await web3.eth.accounts.signTransaction(
                tx,
                privateKey,
            );
            // To get transaction hash use property : signedTx.transactionHash
            await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            return { status: true, message: 'Transaction successful!' };
        } else {
            return { status: false, message: 'Transaction failed!' };
        }
    } catch (error) {
        // we can provide error.message also to show exact error to the user
        return { status: false, message: 'Transaction failed due to exception!' };
    }
};

const test = async () => {
    const network = detailsOfNetworks.getAllNetworkNames();
    getWeb3Connection(network[0]);
    const result = await sendTransactionFromContract('1000', '100', Object, "contractInstance", '0x...', '0x....');
}

test();