const fs = require('fs')

task('populateMap', 'Populates the map with locations').setAction(async () => {
	if (network.name === 'hardhat') {
		console.warn(
			'You are running the faucet task with Hardhat network, which' +
				'gets automatically created and destroyed every time. Use the Hardhat' +
				" option '--network localhost'"
		)
	}

	const addressesFile =
		__dirname + '/../frontend/src/contracts/contract-address.json'

	if (!fs.existsSync(addressesFile)) {
		console.error('You need to deploy your contract first')
		return
	}

	const addressJson = fs.readFileSync(addressesFile)
	const address = JSON.parse(addressJson)

	if ((await ethers.provider.getCode(address.Map)) === '0x') {
		console.error('You need to deploy your contract first')
		return
	}

	const map = await ethers.getContractAt('Map', address.Map)
	const xCenter = await map.xCenter()
	const yCenter = await map.yCenter()

	//TODO Flesh this out
	const locations = [
		[xCenter, yCenter + 2, 2],
		[xCenter, yCenter - 2, 2],
		[xCenter - 2, yCenter, 2],
		[xCenter + 2, yCenter, 2],
	]

	const txs = await Promise.all(
		locations.map(loc => {
			console.log(`Updating location (${loc[0]}, ${loc[1]}) to ${loc[2]}`)
			return map.updateLocation(loc[0], loc[1], loc[2])
		})
	)
	await Promise.all(txs.map(async tx => await tx.wait()))

	console.log(`Updated ${locations.length} locations`)
})
