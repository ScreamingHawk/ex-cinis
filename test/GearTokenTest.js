const { expect } = require('chai')

describe('GearToken contract', function () {
	let GearToken
	let gearToken
	let owner
	let addr1
	let addrs

	beforeEach(async function () {
		GearToken = await ethers.getContractFactory('GearToken')
		;[owner, addr1, ...addrs] = await ethers.getSigners()

		gearToken = await GearToken.deploy()
		await gearToken.deployed()
	})

	describe('Deployment', function () {
		it('Should have correct name and symbol', async function () {
			expect(await gearToken.name()).to.equal('ExCinis Gear')
			expect(await gearToken.symbol()).to.equal('EXCG')
		})

		it('Should mint nothing deploy', async function () {
			expect(await gearToken.totalSupply()).to.equal(0)
		})
	})
})
