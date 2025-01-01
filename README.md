# Decentralized Supply Chain Management

## Overview
This project is a blockchain-based supply chain management system designed to revolutionize the logistics industry by enhancing transparency, traceability, and operational efficiency. By leveraging blockchain's immutable ledger, this system guarantees product authenticity and ensures seamless interaction between supply chain participants. The system includes:
- A React-based front-end application for user interaction.
- Solidity smart contracts deployed on a local blockchain (Ganache) to automate and secure transactions.
- Integration with MetaMask for secure user authentication and peer-to-peer operations.
- MongoDB database for storing product details, ensuring transparency and traceability.

Real-time tracking features empower users with complete visibility, enabling end-to-end monitoring of goods throughout their journey.

## Roles
This system defines four key roles in the supply chain:
- **Manufacturer**: Creates and uploads product details.
- **Distributor**: Handles the distribution and updates product status.
- **Retailer**: Receives products from distributors and manages stock.
- **Consumer**: Views product history and validates authenticity.

## Key Features
### Transparency and Traceability
- Track the complete history and origin of products.
- Verify the authenticity of goods with blockchain-based records.

### Smart Contracts
- Automate operational tasks such as transaction validation, ownership transfers, and product status updates.
- Ensure data integrity and prevent unauthorized changes.

### Secure Wallet Integration
- Use MetaMask for secure user authentication.
- Enable decentralized peer-to-peer transactions.

### Real-Time Product Tracking
- Monitor the status and location of goods in real-time using an intuitive interface.

### MongoDB Integration
- Store product data in a MongoDB database to maintain transparency between supply chain levels.

### React-Based Frontend
- A responsive and user-friendly interface for interacting with the blockchain network.

## Prerequisites
To run this project, ensure the following tools are installed:
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Ganache](https://trufflesuite.com/ganache/) (for local blockchain development)
- [MetaMask](https://metamask.io/) (browser extension for Ethereum wallet)
- [MongoDB](https://www.mongodb.com/) (for product data storage)

## Installation Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AB/DApp.git
   cd DApp
   ```

2. **Install React App Dependencies**
   Navigate to the `app` folder, which contains the React code, and install the required dependencies:
   ```bash
   cd app
   npm install
   ```

3. **Deploy Smart Contracts**
   - Start Ganache and create a new workspace.
   - Use Truffle to deploy the smart contracts from the root directory:
     ```bash
     truffle migrate --network development
     ```

4. **Set Up Environment Variables**
   Create a `.env` file in the `app` directory and configure the following variables:
   ```env
   REACT_APP_CONTRACT_ADDRESS=your_smart_contract_address
   REACT_APP_NETWORK_ID=your_network_id
   MONGODB_URI=your_mongodb_connection_string
   ```

5. **Run the React Application**
   Start the front end to interact with the blockchain network:
   ```bash
   npm start
   ```
   Access the app at `http://localhost:3000`.

## Usage Instructions

1. **Connect MetaMask to Ganache**
   - Configure MetaMask to connect to the local blockchain network provided by Ganache.

2. **Interact with the System**
   - Use the app to validate product history, execute peer-to-peer transactions, and monitor product locations.

3. **Real-Time Updates**
   - View product status and location updates as they occur in real time.

4. **Role-Based Functionality**
   - Manufacturers, distributors, retailers, and consumers have distinct functionalities tailored to their roles.

## Smart Contracts
The Solidity smart contracts provide the backbone of the system by handling:
- Product ownership validation.
- Transaction logging.
- Role-based operations for manufacturers, distributors, retailers, and consumers.
- Real-time status updates.

Contracts are designed to ensure transparency, immutability, and trust among supply chain participants.

## Technologies and Tools
- **Blockchain**: Ethereum
- **Frontend**: React
- **Smart Contracts**: Solidity
- **Local Blockchain**: Ganache
- **Wallet Integration**: MetaMask
- **Database**: MongoDB
- **Development Framework**: Truffle

## Potential Enhancements
- **Decentralized Storage**: Integrate IPFS to store and retrieve product certificates.
- **Predictive Analytics**: Use AI to analyze supply chain data for optimization.
- **Multi-Network Support**: Expand compatibility with multiple blockchain networks (e.g., Polygon, Binance Smart Chain).
- **Mobile Application**: Develop a mobile version of the application for on-the-go usage.

## Contribution Guidelines
Contributions are welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-branch-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add feature description'
   ```
4. Push the branch:
   ```bash
   git push origin feature-branch-name
   ```
5. Open a pull request.

---

**Join us in revolutionizing supply chain management with cutting-edge blockchain technology!**

