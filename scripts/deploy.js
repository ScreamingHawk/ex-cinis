// This is a script for populating the map with locations
const main = async () => {
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

	console.log(
		'Account balance before:',
		(await deployer.getBalance()).toString()
	)

	const names = ['GearToken', 'Map']

	const addresses = await Promise.all(
		names.map(async name => {
			const Contract = await ethers.getContractFactory(name)
			const contractResult = await Contract.deploy()
			await contractResult.deployed()

			console.log(`${name} address: ${contractResult.address}`)

			return contractResult.address
		})
	)

	console.log(
		'Account balance after:',
		(await deployer.getBalance()).toString()
	)

	// We also save the contract's artifacts and addresses in the frontend directory
	saveFrontendFiles(addresses, names)
}

function saveFrontendFiles(addresses, names) {
	const fs = require('fs')
	const contractsDir = `${__dirname}/../frontend/src/contracts`

	if (!fs.existsSync(contractsDir)) {
		fs.mkdirSync(contractsDir)
	}

	// Create address file
	const fileData = {}
	for (let i = 0; i < names.length; i++) {
		fileData[names[i]] = addresses[i]
	}
	fs.writeFileSync(
		`${contractsDir}/contract-address.json`,
		JSON.stringify(fileData, undefined, 2)
	)

	names.forEach(name => {
		const Artifact = artifacts.readArtifactSync(name)

		fs.writeFileSync(
			`${contractsDir}/${name}.json`,
			JSON.stringify(Artifact, null, 2)
		)
	})
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
