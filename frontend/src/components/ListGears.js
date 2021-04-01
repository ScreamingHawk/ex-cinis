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
							{gear.data._hex}: {gear.isWeapon ? 'Weapon' : 'Armour'}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
