<img width="1500" height="500" alt="trustline-github-banner" src="https://github.com/user-attachments/assets/7ff25e48-b62d-4b38-ae35-ca9c8f20e05f" />

# Trustline

Trustline is the open-source data integrity layer for [Social Forms](https://socialforms.so), a platform that transforms traditional web forms into interactive, story-like experiences.

As Social Forms reimagines how data is captured, Trustline provides the crucial function of ensuring that the submitted data is authentic and tamper-proof. By creating a unique, on-chain fingerprint for each submission, Trustline allows anyone to verify the integrity of the data, bringing a new level of trust and transparency to digital interactions.

This monorepo contains the packages that power the Trustline protocol: a Starknet smart contract for on-chain verification, a core library for generating fingerprints and interacting with the contract, and a set of React hooks for easy integration into any web application.

## How it Works: Burner Wallets and Relayer

Trustline uses a meta-transaction model to provide a seamless, gas-free experience for the end-user. This is achieved through a combination of temporary client-side "burner" wallets and a centralized relayer that sponsors the transactions.

1.  **Burner Wallet**: When a user session is initiated on the client-side, a new, temporary Starknet key pair (a "burner" wallet) is generated in the browser. This key pair is unique to the session and is used to sign data submissions.

2.  **Data Fingerprinting**: When the user submits data, a unique, deterministic fingerprint of the JSON payload is created using the `@trustline/core` library.

3.  **Client-Side Signing**: The burner wallet signs the fingerprint. This signature serves as an authorization from the user to record the data fingerprint on-chain.

4.  **Relayer**: The signature, along with the fingerprint and the burner's public key, is sent to a relayer. The relayer is a pre-funded Starknet account that pays the gas fees to submit the transaction to the smart contract.

5.  **On-Chain Verification**: The smart contract receives the transaction from the relayer and verifies the signature against the fingerprint and the user's public key. If the signature is valid, the fingerprint is stored on-chain.

This approach abstracts away the complexity of blockchain interactions, allowing users to benefit from the data integrity guarantees of Starknet without needing a wallet or holding cryptocurrency.

## Packages

### `@trustline/contracts`

This package contains the Starknet smart contract that is responsible for storing and verifying data fingerprints. The contract is written in Cairo and exposes the following functions:

- `store_fingerprint`: This function takes a fingerprint as input and stores it in the contract's storage after verifying a signature.
- `verify_fingerprint`: This function takes a fingerprint as input and returns `true` if the fingerprint exists in the contract's storage, and `false` otherwise.

To build the contract, you will need to have Scarb installed. Once you have it installed, you can build the contract by running the following command in the `packages/contracts` directory:

```
scarb build
```

This will create the contract's artifact in the `packages/contracts/target/dev` directory.

### `@trustline/core`

This package provides a set of functions for interacting with the Starknet smart contract. The package exposes the following functions:

- `createCore`: This function is a factory that creates an instance of the Core API. It takes a configuration object as input, which includes the provider and the contract address.
- `generateFingerprint`: This function takes a JSON object as input and generates a deterministic, Starknet-compatible fingerprint.
- `initializeUserSession`: This function initializes a user session by creating a new burner wallet.
- `initializeRelayerSession`: This function initializes the relayer account that will be used to submit transactions.
- `storeFingerprint`: This function sends the signed fingerprint to the `store_fingerprint` function on the smart contract via the relayer.
- `verifyFingerprint`: This function calls the `verify_fingerprint` view function on the smart contract.

#### `abi.ts`

The `packages/core/src/abi.ts` file contains the ABI (Application Binary Interface) for the Starknet smart contract. This file is generated after the contract is built and it is used by the `@trustline/core` package to interact with the smart contract.

### `@trustline/hooks`

This package provides a set of React hooks for integrating the functionality of the `@trustline/core` package into a web application. The package exposes the following hooks:

- `useIntegrity`: This hook provides a set of functions for submitting data to the smart contract and verifying its integrity.

## Demo Application

The `apps/demo` directory contains a Next.js application that demonstrates how to use the `@trustline/hooks` package to create a simple data integrity application. The application allows users to submit data, view a list of all the data that has been submitted, and verify the integrity of a piece of data by clicking a "Verify" button.

### Environment Variables

To run the demo application, you will need to create a `.env.local` file in the `apps/demo` directory with the following environment variables:

```
CONTRACT_ADDRESS=<your-contract-address>
RPC_URL=<your-rpc-url>
RELAYER_ADDRESS=<your-relayer-funded-address>
RELAYER_PRIVATE_KEY=<your-relayer-private-key>
SIERRA_FILE_PATH=<your-path-to-your-contracts-sierra-file>

```

## Getting Started

To get started with the project, you will need to have Node.js installed.

Once you have it installed, you can follow these steps to get the project up and running:

1. Clone the repository:

```
git clone https://github.com/social-forms/trustline.git
```

2. Install the dependencies:

```
npm install
```

3. Start the development server:

```
npm run dev
```

This will start the Next.js development server on `http://localhost:3000`.

## Contributing

We welcome contributions to the project! If you would like to contribute, please fork the repository and submit a pull request.
