import Web3 from "web3";
import SupplyChain from "./contracts/SupplyChain.json"; // ABI and contract details

let isMetaMaskConnected = false; // Flag to track MetaMask connection

const BlockchainService = async () => {
    try {
        // Initialize Web3
        const web3 = new Web3(Web3.givenProvider || "HTTP://127.0.0.1:7545");

        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();

        // Check if MetaMask is already connected
        if (!isMetaMaskConnected) {
            isMetaMaskConnected = true;
            alert(`Connected to Ganche with provider HTTP://127.0.0.1:7545`);
        }

        // Destructure the accounts
        // const [OwnerAccount, Manufacturer, Distributor, Retailer, Consumer, Man_1, Dis_1, Ret_1, Con_1, Con_2] = accounts;

        // Get network ID and ensure it matches the contract deployment
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SupplyChain.networks[networkId];

        if (!deployedNetwork) {
            console.error("Contract not deployed on this network.");
            return null;
        }

        // Initialize contract instance
        const contract = new web3.eth.Contract(
            SupplyChain.abi,
            deployedNetwork.address
        );
        // console.log("Contract Instance:", contract);
        // console.log(contract.options.jsonInterface); // Displays the ABI


        // Return web3, account, and contract
        return { web3, accounts, contract };
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        return null;
    }
};


// Fetch ETH balance
export const getETHBalance = async (accountAddress) => {
    try {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        const balance = await web3.eth.getBalance(accountAddress);
        
        return web3.utils.fromWei(balance, "ether"); // Convert Wei to Ether
    } catch (error) {
        console.error("Error fetching ETH balance:", error);
        return "0";
    }
};

export default BlockchainService;
