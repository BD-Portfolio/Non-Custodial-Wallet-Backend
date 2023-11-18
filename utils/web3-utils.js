import { formatUnits, parseUnits } from '@ethersproject/units';

let detailsObject = {};

// wei to eth
detailsObject.convertToEther = (data, decimals) => {
    decimals = !!decimals ? decimals : 18;
    data = noExponents(data);
    return noExponents(formatUnits(data.toString(), decimals));
};

// eth to wei
detailsObject.convertToWei = (data, decimals) => {
    decimals = !!decimals ? decimals : 18;
    data = noExponents(data);
    return noExponents(parseUnits(data.toString(), decimals));
};

// no exponents
detailsObject.noExponents = function (num) {
    var data = String(num).split(/[eE]/);
    if (data.length === 1) return data[0];

    var z = '',
        sign = num < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
};

// refactor string
detailsObject.sliceString = (value) => {
    if (!value) {
        return '0';
    }
    let result = '';
    let count = 0;
    for (let index = 0; index < value.length; index++) {
        result += value[index];
        if (!!parseFloat(result)) {
            ++count;
            if (count > 3) {
                return result;
            }
        }
    }
    return result;
};

detailsObject.refactorString = (value) => {
    value = noExponents(value).toString();
    if (!!parseFloat(value)) {
        const result = value.split('.');
        const stringAfterDecimal = sliceString(result[1]);
        return !!parseFloat(stringAfterDecimal)
            ? !!parseFloat(result[0])
                ? result[0] + '.' + stringAfterDecimal.substring(0, 4)
                : result[0] + '.' + stringAfterDecimal
            : result[0];
    } else {
        return '0';
    }
};

// buffer gas limit
detailsObject.calculateBufferedGasLimit = (gasLimit) => {
    return Math.round(Number(gasLimit) + Number(gasLimit) * Number(0.2));
}

// check wallet has sufficient balance for transaction
detailsObject.doesWalletHaveSufficientBalanceForTransaction = async (bufferedGasLimit, senderWalletAddress, isNative, amountInWei) => {
    const gasPrice = await web3.eth.getGasPrice();
    let transactionFee = parseFloat(gasPrice) * parseFloat(bufferedGasLimit.toString());
    if(isNative){
        transactionFee = transactionFee + parseFloat(amountInWei.toString());
    }
    const balanceInWei = await web3.eth.getBalance(senderWalletAddress);
    return transactionFee <= parseFloat(balanceInWei) ? true : false;
}

// regex pattern for input amount based on decimals
detailsObject.checkRegexPattern = (amount, decimals) => {
    const regex = new RegExp(
        `^\\d+\\.?\\d{0,${decimals}}$`,
    );
    if (regex.test(amount)) {
    } else if (amount.length <= 1) {
    }
}

// create contract connection and return instance of contract
const contractConnection = async (abi, contractAddress) => {
    try {
        return await new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
        throw new Error(error);
    }
};

// get user balance
// for native token, tokenContractInstance=null otherwise provide contract instance
const getUserBalance = async (userAddress, tokenContractInstance, decimals) => {
    try {
        if (tokenContractInstance) {
            const balanceInWei = await tokenContractInstance.methods
                .balanceOf(userAddress)
                .call();
            return convertToEther(balanceInWei, decimals);
        } else {
            const balanceInWei = await web3.eth.getBalance(userAddress);
            return convertToEther(balanceInWei, decimals);
        }
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = detailsObject;