const { NETWORK_DETAILS } = require('./constants')

/**
 * Utility method that turns an RPC error into a human readable message.
 */
export const getNetworkName = () => {
	const network = window.ethereum.networkVersion
	console.log(network)
	if (network && NETWORK_DETAILS[network]) {
		return NETWORK_DETAILS[network].name
	}
	return ''
}
