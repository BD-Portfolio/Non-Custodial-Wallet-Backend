const ETHEREUM = "Ethereum";
const POLYGON = "Polygon";
const BINANCE = "Binance";

const GLOBAL_VARIABLES_POLYGON = {
    network: POLYGON,
    jsonRpc: ""
};

const GLOBAL_VARIABLES_ETHEREUM = {
    network: ETHEREUM,
    jsonRpc: ""
};

const GLOBAL_VARIABLES_BINANCE = {
    network: BINANCE,
    jsonRpc: ""
};

let detailsObject = {};

detailsObject.getAllNetworkNames = () => {
    return [POLYGON, ETHEREUM, BINANCE];
}

detailsObject.getNetworkDetails = (network) => {
    let networkDetails;
    switch (network) {
        case ETHEREUM:
            networkDetails = GLOBAL_VARIABLES_ETHEREUM;
            break;
        case POLYGON:
            networkDetails = GLOBAL_VARIABLES_POLYGON;
            break;
        case BINANCE:
            networkDetails = GLOBAL_VARIABLES_BINANCE;
            break;
        default:
            networkDetails = GLOBAL_VARIABLES_ETHEREUM;
    }
    return networkDetails;
}

module.exports = detailsObject;
