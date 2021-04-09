//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import './GearToken.sol';

contract GearFactory is GearToken {
	//FIXME event NewGear();

	uint256 private randNonce = 0;

	function mintRandomGear(address owner) external returns (uint256) {
		uint256 gearData = 0;
		// Generate rarity (1-5)
		gearData = (gearData * 10) + (_generateRandomData() % 5) + 1;
		// Generate gear type (1)
		gearData = (gearData * 10) + 1;
		// Generate layer 1 (00-03)
		gearData = (gearData * 100) + (_generateRandomData() % 4);
		// Generate layer 2 (00-03)
		gearData = (gearData * 100) + (_generateRandomData() % 4);
		// Generate layer 3 (00-03)
		gearData = (gearData * 100) + (_generateRandomData() % 4);
		// Generate layer 4 (00-09)
		gearData = (gearData * 100) + (_generateRandomData() % 10);
		console.log('Gear data: ', gearData);
		return awardGear(owner, gearData);
	}

	/**
	 * @dev Generates random data
	 */
	function _generateRandomData() private returns (uint256) {
		randNonce++;
		return
			uint256(
				keccak256(
					abi.encodePacked(msg.sender, randNonce, block.timestamp)
				)
			);
	}
}
