import React from 'react'
import { ReactSVG } from 'react-svg'
import styled from 'styled-components'
import { MetaMaskButton } from '../components/MetaMaskButton'

import { Alert } from '../components/styled/Alert'
import { Button } from '../components/styled/Button'
import { Col, Row } from '../components/styled/Layout'
import { Page } from '../components/styled/Page'

const InlineIcon = styled(ReactSVG)`
	svg {
		height 1.5em;
	}
`

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
