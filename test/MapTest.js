const { expect, ...chai } = require('chai')
const { solidity } = require('ethereum-waffle')

chai.use(solidity)

describe('Map contract', () => {
	let Map
	let map
	let xCenter
	let yCenter
	let owner
	let addrs

	before(async () => {
		Map = await ethers.getContractFactory('Map')
		;[owner, ...addrs] = await ethers.getSigners()

		map = await Map.deploy()
		await map.deployed()

		xCenter = await map.xCenter()
		yCenter = await map.yCenter()
	})

	beforeEach(async () => {
		map = await Map.deploy()
		await map.deployed()
	})

	describe('Initialisation', () => {
		it('Should center values', async () => {
			expect(xCenter).to.equal(32767)
			expect(yCenter).to.equal(32767)
		})
		it('Should create location in center', async () => {
			expect(await map.xyLocation(xCenter, yCenter)).to.equal(1)
		})
		it('Should not create locations next to the center', async () => {
			expect(await map.xyLocation(xCenter - 1, yCenter - 1)).to.equal(0)
			expect(await map.xyLocation(xCenter - 1, yCenter)).to.equal(0)
			expect(await map.xyLocation(xCenter - 1, yCenter + 1)).to.equal(0)
			expect(await map.xyLocation(xCenter, yCenter - 1)).to.equal(0)
			expect(await map.xyLocation(xCenter, yCenter + 1)).to.equal(0)
			expect(await map.xyLocation(xCenter + 1, yCenter - 1)).to.equal(0)
			expect(await map.xyLocation(xCenter + 1, yCenter)).to.equal(0)
			expect(await map.xyLocation(xCenter + 1, yCenter + 1)).to.equal(0)
		})
	})

	describe('Updating map', () => {
		it('Owner can add a location', async () => {
			await expect(map.addLocation(1, 2, 3))
				.to.emit(map, 'MapUpdated')
				.withArgs(1, 2, 3)
		})
		it('Non owner cannot add a location', async () => {
			await expect(
				map.connect(addrs[0]).addLocation(1, 2, 3)
			).to.be.revertedWith('Ownable: caller is not the owner')
		})
	})
})
