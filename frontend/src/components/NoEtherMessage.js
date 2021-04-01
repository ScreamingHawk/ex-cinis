import React from 'react'

export const NoEtherMessage = ({ selectedAddress }) => {
	return (
		<p>
			You don't have any Ether. To get some Ether, open a terminal in the root
			of the repository and run:
			<br />
			<code>yarn hardhat --network localhost faucet {selectedAddress}</code>
		</p>
	)
}
