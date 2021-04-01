// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
	// This is just a convenience check
	if (network.name === 'hardhat') {
		console.warn(
			'You are trying to deploy a contract to the Hardhat Network, which' +
				'gets automatically created and destroyed every time. Use the Hardhat' +
				" option '--network localhost'"
		)
	}

	// ethers is available in the global scope
	const [deployer] = await ethers.getSigners()
	console.log(
		'Deploying the contracts with the account:',
		await deployer.getAddress()
	)

	console.log('Account balance:', (await deployer.getBalance()).toString())

	const Contract = await ethers.getContractFactory('GearToken')
	const contractResult = await Contract.deploy()
	await contractResult.deployed()

	console.log('Token address:', contractResult.address)

	// We also save the contract's artifacts and address in the frontend directory
	saveFrontendFiles(contractResult, 'GearToken')
}

function saveFrontendFiles(contract, name) {
	const fs = require('fs')
	const contractsDir = `${__dirname}/../frontend/src/contracts`

	if (!fs.existsSync(contractsDir)) {
		fs.mkdirSync(contractsDir)
	}

	const fileData = {}
	fileData[name] = contract.address
	fs.writeFileSync(
		`${contractsDir}/contract-address.json`,
		JSON.stringify(fileData, undefined, 2)
	)

	const TokenArtifact = artifacts.readArtifactSync(name)

	fs.writeFileSync(
		`${contractsDir}/${name}.json`,
		JSON.stringify(TokenArtifact, null, 2)
	)
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
