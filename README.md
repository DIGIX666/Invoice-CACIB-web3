# CleanCash - Payment System with Blockchain Integration


## Overview

**CleanCash** is built on the **so|cash** protocol, which allows financial institutions to perform instant transactions on the blockchain. The project focuses on issuing invoices as NFTs, enabling tracking and payment validation via the blockchain, and managing interbank payments between client and provider accounts.

Key Features:
- Creation of invoices as NFTs
- Payment validation via smart contracts
- Integration of so|cash accounts for seamless transfers
- Invoice tracking and status updates (issued/paid)

## Technologies Used
- **Solidity**: Smart contract development for the Ethereum blockchain.
- **Ethers.js**: A library used to interact with the Ethereum blockchain in the front-end application.
- **Hardhat**: A development environment to compile, test, and deploy smart contracts.
- **React.js**: A JavaScript framework used for the user interface.
- **OpenZeppelin**: A library of secure and modular smart contracts.

## Installation

### Prerequisites

- Node.js >= 14.x
- NPM
- Metamask (for interacting with the dApp)

### Steps

1. Clone this repository:
    ```bash
    git clone git@github.com:DIGIX666/Invoice-CA-web3.git
    cd Invoice-CA-web3
    ```
 
2. Install dependencies:
    ```bash
    npm install
    ```

3. Install Solidity dependencies:
    ```bash
    npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
    ```

4. Create a `.env` file with your private key and blockchain network URL, for example, for the **Fuji** test network:
    ```env
    PRIVATE_KEY=0x...    # Your Metamask private key
    RPC_URL=https://api.avax-test.network/ext/bc/C/rpc  # Network URL
    ```

## Contract Deployment

1. Compile the contracts:
    ```bash
    npx hardhat compile
    ```

2. Deploy the contracts to the **Fuji** test network:
    ```bash
    npx hardhat run scripts/deploy.js --network fuji
    ```

Once the contract is deployed, the contract address will be displayed. Note this address to use in your front-end application.

## Usage

1. **Create an invoice**: You can create a new NFT invoice via the application interface. Fill in the necessary fields (client, amount, description, etc.) and click on **Create Invoice**.

2. **Retrieve invoice details**: Provide the invoice ID to retrieve its details, including its status (issued or paid).


## Check Block

https://testnet.snowtrace.io/

## DEMO
https://drive.google.com/file/d/1bBrSOQBDPl_VfJQD9pJSvYKZhf21tMlv/view?usp=sharing

## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

