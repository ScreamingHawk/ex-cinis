const {
	HARDHAT_NETWORK_ID,
	RINKEBY_NETWORK_ID,
	MAINNET_NETWORK_ID,
} = require('./constants')
const { getNetworkName } = require('./networkHelper')

let hardhatContracts, mainnetContracts, rinkebyContracts
try {
	hardhatContracts = {
		addresses: require('../contracts/localhost/contract-address.json'),
		GearFactory: require('../contracts/localhost/GearFactory'),
		Map: require('../contracts/localhost/Map'),
	}
} catch (e) {
	// contracts not available. Fine
}
try {
	rinkebyContracts = {
		addresses: require('../contracts/rinkeby/contract-address.json'),
		GearFactory: require('../contracts/rinkeby/GearFactory'),
		Map: require('../contracts/rinkeby/Map'),
	}
} catch (e) {
	// contracts not available. Fine
}
try {
	mainnetContracts = {
		addresses: require('../contracts/mainnet/contract-address.json'),
		GearFactory: require('../contracts/mainnet/GearFactory'),
		Map: require('../contracts/mainnet/Map'),
	}
} catch (e) {
	// contracts not available. Fine
}

let contracts = {}
contracts[HARDHAT_NETWORK_ID] = hardhatContracts
contracts[RINKEBY_NETWORK_ID] = rinkebyContracts
contracts[MAINNET_NETWORK_ID] = mainnetContracts

// Safely get the contract details for the connected network
export const getContract = name => {
	const network = window.ethereum.networkVersion
	if (network && contracts[network] && contracts[network][name]) {
		return contracts[network][name]
	}
	throw new Error(`Contracts not available on the ${getNetworkName()} network`)
}

export const getContractAddress = name => {
	const network = window.ethereum.networkVersion
	if (network && contracts[network] && contracts[network]['addresses']) {
		return contracts[network]['addresses'][name]
	}
	throw new Error(`Contracts not available on the ${getNetworkName()} network`)
}

export const contractsDeployed = () => {
	const network = window.ethereum.networkVersion
	return (
		network &&
		contracts[network] &&
		Object.keys(contracts[network]).length === 3
	)
}
