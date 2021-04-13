import React from 'react'
import { MetaMaskButton } from '../components/MetaMaskButton'

import { Alert } from '../components/styled/Alert'
import { Row } from '../components/styled/Layout'
import { Page } from '../components/styled/Page'

export const Login = ({ connectWallet, networkError, dismiss }) => {
	return (
		<Page center>
			{networkError && <Alert message={networkError} dismiss={dismiss} />}
			<Row center>
				<h1>EX CINIS</h1>
			</Row>
			<Row center>
				<MetaMaskButton onClick={connectWallet} text="Log in with MetaMask" />
			</Row>
		</Page>
	)
}
