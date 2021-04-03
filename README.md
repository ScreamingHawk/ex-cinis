# Ex Cinis

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

## Technology

Your environment will have everything you need to build a Dapp powered by Hardhat and React.

- [Hardhat](https://hardhat.org/): An Ethereum development task runner and testing network.
- [Mocha](https://mochajs.org/): A JavaScript test runner.
- [Chai](https://www.chaijs.com/): A JavaScript assertion library.
- [ethers.js](https://docs.ethers.io/ethers.js/html/): A JavaScript library for interacting with Ethereum.
- [Waffle](https://github.com/EthWorks/Waffle/): To have Ethereum-specific Chai assertions/mathers.
- [A sample frontend/Dapp](./frontend): A Dapp which uses [Create React App](https://github.com/facebook/create-react-app).
