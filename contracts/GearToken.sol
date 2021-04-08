//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract GearToken is ERC721Enumerable {
	//FIXME event NewGear();
	//FIXME event ActivatedGear(address _owner, uint256 gearId);

	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	constructor() ERC721('ExCinis Gear', 'EXCG') {
		awardGear(msg.sender);
	}

	struct Gear {
		uint256 data;
		bool isWeapon;
	}

	Gear[] public gears;
	mapping(uint256 => uint256) public tokenIdGearIndex;

	uint8 constant maxGearPerOwner = 8;
	uint8 private dataDigits = 16; // FIXME double check this value
	uint256 dataModulus = 10**dataDigits;
	uint256 private randNonce = 0;

	mapping(address => uint256) public addressActiveGear;

	//FIXME remove active gear when traded, burnt

	/**
	 * @dev Test if additional gear ownership will overflow.
	 */
	modifier canOwnMoreGear(address _to) {
		require(
			ERC721.balanceOf(_to) < uint256(maxGearPerOwner),
			'GearToken: cannot own more gear'
		);
		_;
	}

	/**
	 * @dev Creates the gear for the player.
	 */
	function awardGear(
		address owner //, string memory tokenURI)
	) public canOwnMoreGear(owner) returns (uint256) {
		uint256 id = _tokenIds.current();
		_safeMint(owner, id);

		console.log('Minting id ', id, ' for ', owner);

		Gear memory gear =
			Gear(
				_generateRandomData() % dataModulus,
				(_generateRandomData() & 1) > 0
			);
		gears.push(gear);
		tokenIdGearIndex[id] = gears.length;

		_tokenIds.increment();
		return id;
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
