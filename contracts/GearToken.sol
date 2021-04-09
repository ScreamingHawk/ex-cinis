//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract GearToken is ERC721Enumerable, Ownable {
	//FIXME event NewGear();
	//FIXME event ActivatedGear(address _owner, uint256 gearId);

	using Strings for uint256;
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	uint8 constant maxGearPerOwner = 8;
	string private baseURI;

	mapping(uint256 => uint256) public tokenIdGearData;
	mapping(address => uint256) public addressActiveGear;

	//FIXME remove active gear when traded, burnt

	constructor() ERC721('ExCinis Gear', 'EXCG') {
		baseURI = 'https://raw.githack.com/superepicgecko/ex-cinis-assets/master/token_data/';
	}

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

	function setBaseURI(string memory newBaseURI) external onlyOwner {
		baseURI = newBaseURI;
	}

	function _baseURI() internal view override returns (string memory) {
		return baseURI;
	}

	/**
	 * @dev See {IERC721Metadata-tokenURI}.
	 */
	function tokenURI(uint256 tokenId)
		public
		view
		virtual
		override
		returns (string memory)
	{
		require(
			_exists(tokenId),
			'ERC721Metadata: URI query for nonexistent token'
		);

		string memory base = _baseURI();
		return
			bytes(base).length > 0
				? string(
					abi.encodePacked(base, getGearData(tokenId).toString())
				)
				: '';
	}

	// @dev Returns the gear data for the given token
	function getGearData(uint256 _tokenId) public view returns (uint256) {
		return tokenIdGearData[_tokenId];
	}

	/**
	 * @dev Creates the gear for the player.
	 */
	function awardGear(address owner, uint256 gearData)
		internal
		canOwnMoreGear(owner)
		returns (uint256)
	{
		uint256 id = _tokenIds.current();

		console.log('Minting id ', id, ' for ', owner);

		_safeMint(owner, id);
		tokenIdGearData[id] = gearData;

		_tokenIds.increment();
		return id;
	}
}
