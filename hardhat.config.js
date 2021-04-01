require('@nomiclabs/hardhat-waffle')

// Imports Hardhat task definitions, that can be used for testing.
require('./tasks/faucet')

module.exports = {
	solidity: '0.8.3',
	networks: {
		hardhat: {
			chainId: 1337,
		},
	},
}
