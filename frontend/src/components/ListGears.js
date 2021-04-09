import React from 'react'

export function ListGears({ gears }) {
	console.log(gears)
	return (
		<div>
			<h4>Gear List</h4>
			{gears && (
				<ul>
					{gears.map(gear => (
						<li key={`gear_item_${gear.index}`}>
							<span>
								#{gear.tokenId.toString()}: {gear.gearData.toString()}
							</span>{' '}
							<a href={gear.tokenURI}>JSON data</a>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
