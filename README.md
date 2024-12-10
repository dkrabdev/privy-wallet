# Privy Wallet

This repository contains a POC application that demonstrates how to create a crypto wallet using the Privy SDK. The goal is to explore whether the Privy SDK can be leveraged to build a general-purpose crypto wallet with features such as email/social login for authentication, signing messages, and executing transactions—all without requiring key management in the application code. The ultimate objective is to simplify user onboarding for a new kind of generic crypto wallet.

## Getting Started

### Prerequisites

1. Copy the `.env` file to `.env.local`.  
   If you intend to use the default Privy and WalletConnect applications, no additional setup is required.  
   Otherwise, you'll need to:
   - **Create an account on [Privy](https://dashboard.privy.io/)** and set up a project.
   - **Create an account on [WalletConnect](https://cloud.reown.com/)** and set up a project there too,

### Installation

Start the development server using:

```bash
npm run dev
```

### Running the Application

Once the server is running, open your browser and navigate to:

[http://localhost:3000](http://localhost:3000)

## Testing and Features

This app uses WalletConnect as the network layer. To test its functionalities, you will need to connect through WalletConnect.

You can experiment with the app using the following test environment:
[https://evmtest.walletconnect.com](https://evmtest.walletconnect.com)
