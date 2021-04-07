# Ex Cinis

An Ethereum block chain game.

Testing instance available at: https://ex-cinis.netlify.app

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/ScreamingHawk/ex-cinis.git
cd ex-cinis
yarn
cd frontend
yarn
cd ..
```

Once installed, let's run Hardhat's testing network:

```sh
yarn local:node
```

Then, on a new terminal, go to the repository's root folder and run this to deploy your contract:

```sh
yarn local:deploy
```

Finally, we can run the frontend with:

```sh
yarn frontend
```

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will need to have [Metamask](https://metamask.io) installed and listening to `localhost 8545`.

## Scripts

The map initialises with a single location in the center. To add more locations use the script:

```sh
yarn hardhat --network localhost populateMap
```

## Deployment

### Secrets

Create a copy of `secrets.sample.json` and name it `secrets.json`.

Go to [Infura](https://infura.io/), create a project and retrieve the API key. Update `INFURA_API_KEY` with this value.

Create an ETH private and public key. Update `RINKEBY_PRIVATE_KEY` with this value.
Navigate to a [Rinkeby faucet](https://faucet.rinkeby.io/) and request Ether.

### Deploy Contracts

Run the following to deploy the contracts to the Rinkeby test network:

```sh
yarn hardhat run ./scripts/deploy.js --network rinkeby >> deploy.log 2>> deploy_err.log
```

Check `deploy.log` for success logs and `deploy_err.log` for error logs.

The deployed addresses are written to `frontend/src/contracts/contract-address.json`.
This file is git ignored and overridden by every deployment. You should store the values somewhere if you want to keep them.

### Frontend

For deployment we use [netlify](https://www.netlify.com/). Install the cli with:

```sh
yarn global add netlify-cli
```

Build the frontend for deployment:

```sh
cd frontend
yarn build
```

Configure netlify for deployment, following the prompts:

```sh
netlify deploy
> Create & configure a new site
> <Your name> team
> ex-cinis
> build
```

Navigate the URL provided and confirm the front end is good.

Then deploy to "production" with:

```
netlify deploy --prod
> build
```

## Technology

The technology stack for our Dapp:

- [Hardhat](https://hardhat.org/): An Ethereum development task runner and testing network.
- [Mocha](https://mochajs.org/): A JavaScript test runner.
- [Chai](https://www.chaijs.com/): A JavaScript assertion library.
- [ethers.js](https://docs.ethers.io/ethers.js/html/): A JavaScript library for interacting with Ethereum.
- [Waffle](https://github.com/EthWorks/Waffle/): Ethereum-specific Chai assertions/mathers.
- [React](https://reactjs.org/): A frontend application for calling the Dapp.

## Credits

[Michael Standen](https://michael.standen.link)

This software is provided under the [MIT Licenses](https://tldrlegal.com/license/mit-license) so it's free to use so long as the credits in the Licenses are retained.
