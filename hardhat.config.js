require('@nomiclabs/hardhat-waffle')

// Imports Hardhat tasks
require('./tasks')

const { INFURA_API_KEY, RINKEBY_PRIVATE_KEY } = require('./secrets.json')

module.exports = {
	solidity: '0.8.3',
	networks: {
		hardhat: {
			chainId: 1337,
		},
		rinkeby: {
			url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
			accounts: [RINKEBY_PRIVATE_KEY],
		},
	},
}
