import React from 'react'

import { ethers } from 'ethers'

import { Login } from './Login'
import { NoWalletDetected } from './NoWalletDetected'

import { Row } from '../components/styled/Layout'

import { Loading } from '../components/Loading'
import { MintRandomGear } from '../components/MintRandomGear'
import { ListGears } from '../components/ListGears'
import { TransactionErrorMessage } from '../components/TransactionErrorMessage'
import { WaitingForTransactionMessage } from '../components/WaitingForTransactionMessage'
import { NoEtherMessage } from '../components/NoEtherMessage'

import { ERROR_CODE_TX_REJECTED_BY_USER } from '../util/constants'
import { getRpcMessage } from '../util/errorHelper'
import { getNetworkName } from '../util/networkHelper'

import {
	getContract,
	getContractAddress,
	contractsDeployed,
} from '../util/contracts'

export class Dapp extends React.Component {
	constructor(props) {
		super(props)

		this.initialState = {
			// Wallet details
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
				<Login
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
				<Row between>
					<h1>ExCinis</h1>
					<span>
						Connected to <b>{getNetworkName()}</b>
					</span>
				</Row>
				<Row>
					<p>
						Welcome <b>{this.state.selectedAddress}</b>, you have{' '}
						<b>{this.state.gearTotal.toString()} ExCinis Gear</b>.
					</p>
				</Row>

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
						{this.state.balance.eq(0) && (
							<NoEtherMessage selectedAddress={this.state.selectedAddress} />
						)}

						<MintRandomGear mintRandomGear={() => this._mintRandomGear()} />

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
		this._gearFactory = new ethers.Contract(
			getContractAddress('GearFactory'),
			getContract('GearFactory').abi,
			this._provider.getSigner(0)
		)
	}

	_updateData() {
		this._updateBalance()
	}

	async _updateBalance() {
		const gearTotal = await this._gearFactory.balanceOf(
			this.state.selectedAddress
		)
		this.setState({ gearTotal })
		console.log(this._gearFactory)
		this._updateGears()
	}

	async _updateGears() {
		const gears = []
		for (let i = 0; i < this.state.gearTotal; i++) {
			const tokenId = await this._gearFactory.tokenOfOwnerByIndex(
				this.state.selectedAddress,
				i
			)
			const gearData = await this._gearFactory.getGearData(tokenId)
			const tokenURI = await this._gearFactory.tokenURI(tokenId)
			// Append id
			gears.push({
				index: i,
				tokenId,
				gearData,
				tokenURI,
			})
		}
		this.setState({ gears })
	}

	// Award Gear
	async _mintRandomGear() {
		try {
			// Clear error
			this._dismissTransactionError()

			const tx = await this._gearFactory.mintRandomGear(
				this.state.selectedAddress
			)
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
		if (contractsDeployed()) {
			return true
		}

		this.setState({
			networkError: `Contracts not deployed to ${getNetworkName()}.\nPlease connect Metamask to the correct network`,
		})

		return false
	}
}
