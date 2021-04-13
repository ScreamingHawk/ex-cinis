import React from 'react'
import { MetaMaskButton } from '../components/MetaMaskButton'

import { Row } from '../components/styled/Layout'
import { Page } from '../components/styled/Page'

export const NoWalletDetected = () => {
	return (
		<Page center>
			<Row center>
				<h1>EX CINIS</h1>
			</Row>
			<Row center vertical>
				<p>No Ethereum wallet was detected.</p>
				<MetaMaskButton
					onClick={() => window.open('https://metamask.io')}
					text="Install MetaMask"
				/>
			</Row>
		</Page>
	)
}
