const { expect } = require('chai')

describe('GearToken contract', function () {
	let GearToken
	let gearToken
	let owner
	let addr1
	let addr2
	let addrs

	beforeEach(async function () {
		GearToken = await ethers.getContractFactory('GearToken')
		;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

		gearToken = await GearToken.deploy()
		await gearToken.deployed()
	})

	describe('Deployment', function () {
		it('Should give owner 1 gear', async function () {
			expect(await gearToken.balanceOf(owner.address)).to.equal(1)
		})

		it('Should mint exactly 1 gear on deploy', async function () {
			const ownerBalance = await gearToken.balanceOf(owner.address)
			expect(await gearToken.totalSupply()).to.equal(1)
		})
	})

	describe('AwardGear', function () {
		it('Should award new gear to owner', async function () {
			await gearToken.awardGear(owner.address)
			expect(await gearToken.balanceOf(owner.address)).to.equal(2)
		})

		it('Should award new gear to new address', async function () {
			expect(await gearToken.balanceOf(addr1.address)).to.equal(0)
			await gearToken.connect(addr1).awardGear(addr1.address)
			expect(await gearToken.balanceOf(addr1.address)).to.equal(1)
		})

		it('Should allow award 8 gear', async function () {
			for (let i = 8; i-- > 0; ) {
				await gearToken.connect(addr1).awardGear(addr1.address)
			}
			expect(await gearToken.balanceOf(addr1.address)).to.equal(8)
		})

		it('Should fail if awarding too much gear', async function () {
			for (let i = 8; i-- > 0; ) {
				await gearToken.connect(addr1).awardGear(addr1.address)
			}
			await expect(
				gearToken.connect(addr1).awardGear(addr1.address)
			).to.be.revertedWith('GearToken: cannot own more gear')
			// Should stay at 8
			expect(await gearToken.balanceOf(addr1.address)).to.equal(8)
		})
	})
})
