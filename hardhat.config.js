require('@nomiclabs/hardhat-waffle')

// Imports Hardhat tasks
require('./tasks')

module.exports = {
	solidity: '0.8.3',
	networks: {
		hardhat: {
			chainId: 1337,
		},
	},
}
