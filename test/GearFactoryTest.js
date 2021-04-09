const { expect } = require('chai')

describe('GearFactory contract', function () {
	let GearFactory
	let gearFactory
	let owner
	let addr1
	let addrs

	beforeEach(async function () {
		GearFactory = await ethers.getContractFactory('GearFactory')
		;[owner, addr1, ...addrs] = await ethers.getSigners()

		gearFactory = await GearFactory.deploy()
		await gearFactory.deployed()
	})

	describe('Mint Random Gear', function () {
		it('Can mint gear to owner', async function () {
			await gearFactory.mintRandomGear(owner.address)
			expect(await gearFactory.balanceOf(owner.address)).to.equal(1)
		})

		it('Can mint gear to new address', async function () {
			await gearFactory.connect(addr1).mintRandomGear(addr1.address)
			expect(await gearFactory.balanceOf(addr1.address)).to.equal(1)
		})

		it('Should allow minting 8 gear', async function () {
			for (let i = 8; i-- > 0; ) {
				await gearFactory.connect(addr1).mintRandomGear(addr1.address)
			}
			expect(await gearFactory.balanceOf(addr1.address)).to.equal(8)
		})

		it('Should fail if minting too much gear', async function () {
			for (let i = 8; i-- > 0; ) {
				await gearFactory.connect(addr1).mintRandomGear(addr1.address)
			}
			await expect(
				gearFactory.connect(addr1).mintRandomGear(addr1.address)
			).to.be.revertedWith('GearToken: cannot own more gear')
			// Should stay at 8
			expect(await gearFactory.balanceOf(addr1.address)).to.equal(8)
		})
	})

	describe('Get Gear Data', function () {
		it('Should return gear data', async function () {
			await gearFactory.mintRandomGear(owner.address)
			const tokenId = await gearFactory.tokenOfOwnerByIndex(owner.address, 0)
			const gearData = await gearFactory.getGearData(tokenId)
			expect(gearData).not.to.equal(0)
		})
	})

	describe('Get URI', function () {
		it('Should return URI', async function () {
			await gearFactory.mintRandomGear(owner.address)
			const tokenId = await gearFactory.tokenOfOwnerByIndex(owner.address, 0)
			const gearData = await gearFactory.getGearData(tokenId)
			const uri = await gearFactory.tokenURI(tokenId)
			expect(uri).to.equal(
				'https://raw.githack.com/superepicgecko/ex-cinis-assets/master/token_data/' +
					gearData
			)
		})
	})
})
