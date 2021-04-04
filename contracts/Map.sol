//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Map is Ownable {
	// Events
	event MapUpdated(uint16 xPos, uint16 yPos, uint8 location);

	/// @notice Store the locations of interest x_pos => y_pos => location type
	/// @dev uint16 allows for a map of 65,536 x 65,536. Plenty of space
	mapping(uint16 => mapping(uint16 => uint8)) public xyLocation;

	/// @dev The center of the map is the middle of uint16 space
	uint16 public constant xCenter = type(uint16).max / 2;
	uint16 public constant yCenter = type(uint16).max / 2;

	/// @dev Initialise the map
	constructor() {
		xyLocation[xCenter][yCenter] = 1;
	}

	/**
	 * @dev Allows admins to update map locations
	 */
	function addLocation(
		uint16 xPos,
		uint16 yPos,
		uint8 location
	) external onlyOwner {
		xyLocation[xPos][yPos] = location;
		emit MapUpdated(xPos, yPos, location);
	}
}
