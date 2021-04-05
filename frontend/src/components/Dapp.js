import React from 'react'

import { ethers } from 'ethers'

import GearTokenArtifact from '../contracts/GearToken.json'
import contractAddress from '../contracts/contract-address.json'

import { NoWalletDetected } from './NoWalletDetected'
import { ConnectWallet } from './ConnectWallet'
import { Loading } from './Loading'
import { AwardGear } from './AwardGear'
import { ListGears } from './ListGears'
import { TransactionErrorMessage } from './TransactionErrorMessage'
import { WaitingForTransactionMessage } from './WaitingForTransactionMessage'
import { NoEtherMessage } from './NoEtherMessage'

import {
	HARDHAT_NETWORK_ID,
	RINKEBY_NETWORK_ID,
	ERROR_CODE_TX_REJECTED_BY_USER,
} from '../util/constants'
import { getRpcMessage } from '../util/errorHelper'

export class Dapp extends React.Component {
	constructor(props) {
		super(props)

		this.initialState = {
			// The user's address and balance
			selectedAddress: undefined,
			balance: undefined,
			// The ID about transactions being sent, and any possible error with them
			txBeingSent: undefined,
			transactionError: undefined,
			networkError: undefined,
			// gears
			gearTotal: undefined,
			gears: undefined,
		}

		this.state = this.initialState
	}

	render() {
		if (window.ethereum === undefined) {
			// Check metamask is installed
			return <NoWalletDetected />
		}

		if (!this.state.selectedAddress) {
			return (
				<ConnectWallet
					connectWallet={() => this._connectWallet()}
					networkError={this.state.networkError}
					dismiss={() => this._dismissNetworkError()}
				/>
			)
		}

		if (!this.state.gearTotal) {
			return <Loading />
		}

		return (
			<div className="container p-4">
				<div className="row">
					<div className="col-12">
						<h1>ExCinis</h1>
						<p>
							Welcome <b>{this.state.selectedAddress}</b>, you have{' '}
							<b>{this.state.gearTotal.toString()} ExCinis Gear</b>.
						</p>
					</div>
				</div>

				<hr />

				<div className="row">
					<div className="col-12">
						{this.state.txBeingSent && (
							<WaitingForTransactionMessage txHash={this.state.txBeingSent} />
						)}

						{this.state.transactionError && (
							<TransactionErrorMessage
								message={getRpcMessage(this.state.transactionError)}
								dismiss={() => this._dismissTransactionError()}
							/>
						)}
					</div>
				</div>

				<div className="row">
					<div className="col-12">
						{this.state.gearTotal.eq(0) && (
							<NoEtherMessage selectedAddress={this.state.selectedAddress} />
						)}

						<AwardGear awardGear={() => this._awardGear()} />

						{this.state.gearTotal.gt(0) && (
							<ListGears gears={this.state.gears} />
						)}
					</div>
				</div>
			</div>
		)
	}

	async _connectWallet() {
		const [selectedAddress] = await window.ethereum.enable()

		if (!this._checkNetwork()) {
			return
		}

		this._initialize(selectedAddress)

		// User changes address
		window.ethereum.on('accountsChanged', ([newAddress]) => {
			if (newAddress === undefined) {
				return this._resetState()
			}
			this._initialize(newAddress)
		})

		// User changes network
		window.ethereum.on('networkChanged', ([networkId]) => {
			this._resetState()
		})
	}

	async _initialize(userAddress) {
		this.setState({
			selectedAddress: userAddress,
		})

		await this._intializeEthers()
		await this._updateData()
	}

	async _intializeEthers() {
		this._provider = new ethers.providers.Web3Provider(window.ethereum)

		this.setState({
			balance: await this._provider.getBalance(this.state.selectedAddress),
		})

		// Init contract
		this._gearToken = new ethers.Contract(
			contractAddress.GearToken,
			GearTokenArtifact.abi,
			this._provider.getSigner(0)
		)
	}

	_updateData() {
		this._updateBalance()
	}

	async _updateBalance() {
		const gearTotal = await this._gearToken.balanceOf(
			this.state.selectedAddress
		)
		this.setState({ gearTotal })
		console.log(this._gearToken)
		this._updateGears()
	}

	async _updateGears() {
		const gears = []
		for (let i = 0; i < this.state.gearTotal; i++) {
			const token = await this._gearToken.tokenOfOwnerByIndex(
				this.state.selectedAddress,
				i
			)
			const gear = await this._gearToken.gears(token)
			// Append id
			gears.push({
				index: i,
				...gear,
			})
		}
		this.setState({ gears })
	}

	// Award Gear
	async _awardGear() {
		try {
			// Clear error
			this._dismissTransactionError()

			const tx = await this._gearToken.awardGear(this.state.selectedAddress)
			this.setState({ txBeingSent: tx.hash })

			// Wait for tx to be mined
			const receipt = await tx.wait()

			if (receipt.status === 0) {
				// We can't know the exact error that make the transaction fail once it was mined, so we throw this generic one.
				throw new Error('Transaction failed')
			}

			// Success. Update data
			await this._updateData()
		} catch (error) {
			if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
				// Don't show anything when user rejects transaction
				return
			}

			console.error(error)
			this.setState({ transactionError: error })
		} finally {
			// TX sent and mined. Clear it
			this.setState({ txBeingSent: undefined })
		}
	}

	// This method just clears part of the state.
	_dismissTransactionError() {
		this.setState({ transactionError: undefined })
	}

	// This method just clears part of the state.
	_dismissNetworkError() {
		this.setState({ networkError: undefined })
	}

	_resetState() {
		this.setState(this.initialState)
	}

	_checkNetwork() {
		const { networkVersion } = window.ethereum
		if (
			networkVersion === HARDHAT_NETWORK_ID ||
			networkVersion === RINKEBY_NETWORK_ID
		) {
			return true
		}

		this.setState({
			networkError: 'Please connect Metamask to Localhost:8545',
		})

		return false
	}
}
