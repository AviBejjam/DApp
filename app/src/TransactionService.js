import Web3 from "web3";
import SupplyChain from "./contracts/SupplyChain.json";

let isMetaMaskConnected = false;

const TransactionService = async () => {
    try {
        const web3 = new Web3(Web3.givenProvider || "HTTP://127.0.0.1:7545");

        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();

        if (!isMetaMaskConnected) {
            isMetaMaskConnected = true;
            console.log(`account connected to Ganache`);
        }

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SupplyChain.networks[networkId];

        if (!deployedNetwork) {
            console.error("Contract not deployed on this network.");
            return null;
        }
        const contract = new web3.eth.Contract(
            SupplyChain.abi,
            deployedNetwork.address
        );
        console.log("Contract Instance:", contract);

        return { web3, accounts, contract };
    }
    catch (error) {
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

export default TransactionService;