import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/index.css";
import TransactionService from "./TransactionService";
import Web3 from "web3";

function Products_details({ userName, stateFilter, manufacturerFilter }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adjustments, setAdjustments] = useState({}); 
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState({
    totalSpent: 0,
    uniqueProducts: 0,
    totalQuantity: 0,
  })

  let senderAddress = '0x0'; // Default sender address
  let senderName = "";
  let useraddress = "0x0";

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (stateFilter) queryParams.append("state", stateFilter);
        if (manufacturerFilter) queryParams.append("manufacturer", manufacturerFilter);

        const response = await axios.get(`http://localhost:3001/api/getItems?${queryParams.toString()}`);
        setItems(response.data);

        // console.log("Items:", response.data);

        let fetchedItems = response.data;
        
        let filterItems = fetchedItems.filter((item) => item.state == "Manufactured");
        if(userName == "Distr" || userName == "Distr_1") {
          filterItems = fetchedItems.filter((item) => item.state == "Distributed");
        }
        else if(userName == "Retailer" || userName == "Retailer_1") {
          filterItems = fetchedItems.filter((item) => item.state == "Retailed");
        }
        else if(userName == "Consumer" || userName == "Consumer_1" || userName == "Consumer_2") {
          filterItems = fetchedItems.filter((item) => item.state == "Consumed");
        }

        const totalSpent = filterItems.reduce((sum, item) => sum + item.cost * item.quantity, 0);

        const uniqueProducts = filterItems.length;

        const totalQuantity = filterItems.reduce((sum, item) => sum + item.quantity, 0);

        // console.log("Total Spent:", totalSpent);
        // console.log("Unique Products:", uniqueProducts);
        // console.log("Total Quantity:", totalQuantity);

        setSummary({
          totalSpent,
          uniqueProducts,
          totalQuantity,
        });


        // Initialize adjustment state for all items
        const initialAdjustments = response.data.reduce((acc, item) => {
          acc[item._id] = 0;
          return acc;
        }, {});
        setAdjustments(initialAdjustments);

        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the items!", error);
        setError("Could not fetch items.");
        setLoading(false);
      }
    };

    fetchItems();
  }, [stateFilter, manufacturerFilter]);

  const updateAdjustment = (itemId, delta, maxQuantity) => {
    setAdjustments((prev) => ({
      ...prev,
      [itemId]: Math.min(Math.max(0, prev[itemId] + delta), maxQuantity), // Constrain to [0, maxQuantity]
    }));
  };
  

  const handleBuy = async (productTitle, itemId, senderName, quantity, cost1) => {

    setMessage("Processing transaction...");

    // Step 1: Validate the quantity
    if (!adjustments[itemId] || adjustments[itemId] <= 0) {
      console.error("Quantity must be greater than 0");
      return;
    }
  
    console.log(`${userName} is buying ${adjustments[itemId]} items`);
    // Step 2: Log the buy action
    console.log(`Buy button clicked for item ID: ${productTitle} with quantity: ${adjustments[itemId]}`);
  
    // Step 3: Confirm the transaction with the user
    if (!window.confirm("Do you want to proceed with the transaction?")) {
      console.log("Transaction cancelled by the user.");
      return;
    }
  
    try {
      // Step 1: Call the TransactionService function to get web3, accounts, and contract
      const { web3, accounts, contract } = await TransactionService();
      if (!web3 || !accounts || !contract) {
        console.error("TransactionService failed to initialize.");
        return;
      }
      
      let roleName = "";
      // Step 2: Get the sender address based on the sender name
      switch (senderName) {
        case "ManFac":
          senderAddress = accounts[1];
          roleName = "Distributed";
          break;
        case "ManFac_1":
          senderAddress = accounts[5];
          roleName = "Distributed";
          break;
        case "Distr":
          senderAddress = accounts[2];
          roleName = "Retailed";
          break;
        case "Distr_1":
          senderAddress = accounts[6];
          roleName = "Retailed";
          break;
        case "Retailer":
          senderAddress = accounts[3];
          roleName = "Consumed";
          break;
        case "Retailer_1":
          senderAddress = accounts[7];
          roleName = "Consumed";
          break;
        default:
          senderAddress = '0x0'; // Invalid sender
      }
  
      switch(userName) {
        case "Distr":
          useraddress = accounts[2];
          break;
        case "Distr_1":
          useraddress = accounts[6];
          break;
        case "Retailer":
          useraddress = accounts[3];
          break;
        case "Retailer_1":
          useraddress = accounts[7];
          break;
        case "Consumer":
          useraddress = accounts[4];
          break;
        case "Consumer_1":
          useraddress = accounts[8];
          break;
        case "Consumer_2":
          useraddress = accounts[9];
          break;
        default:
          useraddress = '0x0'; // Invalid sender
      }
  
      console.log(`${useraddress} is buying ${adjustments[itemId]} items`);
      console.log(`Sender Address: ${senderAddress}`);
  
      // Step 4: Add logic for processing the buy transaction (e.g., transfer of funds)
      const cost = 0.5 * cost1 * quantity;
  
      // Transaction details
      const transactionDetails = {
        from: useraddress, // Assuming the sender is the current user
        to: senderAddress, // Assuming the recipient is the OwnerAccount (first account)
        value: web3.utils.toWei(cost.toString(), 'ether'), // Convert ETH to Wei
        gas: 21000, // Gas limit (standard qfor simple transactions)
      };
  
      console.log(`${userName} is buying ${quantity} items for ${cost} ETH`);
  
      // Step 5: Send the transaction
      const transaction_values = await web3.eth.sendTransaction(transactionDetails);
      console.log("Transaction Values:", transaction_values);
      
      console.log(1);

      try{
        const productDetails = await axios.get(`http://localhost:3001/api/getDeeta/${itemId}`);
        const item = productDetails.data;
        console.log("Product Details:", item);
        
        if(userName === "Distr" || userName === "Distr_1"){
          roleName = "Distributed";
        }
        else if(userName === "Retailer" || userName === "Retailer_1"){
          roleName = "Retailed";
        }
        else if(userName === "Consumer" || userName === "Consumer_1" || userName === "Consumer_2"){
          roleName = "Consumed";
        }
        console.log("Role Name:", roleName);


        const updateProduct = {};
        if(quantity){
          updateProduct.quantity = item.quantity - quantity;
        }

        // Step 6: Create a new product and update the existing product
        const updateField = {};
        if (roleName === "Distributed") {
          updateField.distributor = userName;
        } else if (roleName === "Retailed") {
          updateField.retailer = userName;
        } else if (roleName === "Consumed") {
          updateField.consumer = userName;
        }

        const newProduct = {
          productTitle: item.productTitle,
          quantity: adjustments[itemId],
          cost: item.cost.toString(),
          manufacturer: item.manufacturer,
          distributor: item.distributor,
          retailer: item.retailer,
          consumer: item.consumer,
          ...updateField,
          state: roleName,
          date: new Date(),
          tx_hash: transaction_values.transactionHash.toString(),
          from_addr: transaction_values.from,
          to_addr: transaction_values.to,
        };
        console.log("New Product:", newProduct);

        // Step 7: Add the new product to the database
        await axios.post("http://localhost:3001/api/addProduct", newProduct);
        console.log("New Product:", newProduct);

        // Step 8: Send request to create a new product and update the existing one
        await axios.put(`http://localhost:3001/api/updateProduct/${itemId}`, updateProduct);
        console.log("Product updated successfully.");

        console.log("Transaction successful. Product purchased.");
        setMessage("Transaction successful. Product purchased.");

      } catch (error) {
        console.error("Error processing the purchase:", error);
      }
    }
    catch (error) {
      console.error("Error processing the purchase:", error);
    }
  };

  const CheckTransaction = async (txHash, fromAddress, toAddress, cost1, quantity1) => {
    try {
      const web3 = new Web3(Web3.givenProvider || "HTTP://127.0.0.1:7545");

        // Fetch the transaction details
        const transactionValues = await web3.eth.getTransaction(txHash);
        console.log("Transaction Data from Ganache:", transactionValues);

        // Fetch and print the value in Ether
        const valueInEther = web3.utils.fromWei(transactionValues.value, "ether");
        console.log("Transaction Value in Ether:", valueInEther);

        console.log(`from: ${fromAddress}`);
        console.log(`to: ${toAddress}`);
        console.log(`cost: ${cost1}`);
        console.log(`quantity: ${quantity1}`);
        console.log(`valueInEther: ${valueInEther}`);

        if(transactionValues.from === fromAddress && transactionValues.to === toAddress ){
          alert("Transaction is valid.");
        }
        else{
          alert("Transaction is invalid.");
        }

      } catch (error) {
          console.error("Error checking transaction:", error);
      }
  };

  
  if (loading) return <p>Loading items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home">
      <div className="tile-container">
        {items.map((item) => (
          <div className="product-tile" key={item._id}>
            <h3>{item.productTitle}</h3>
            <p>Quantity in stock: {item.quantity}</p>
            <p>Cost: {item.cost} </p>
            <p>State: {item.state}</p>
            {item.manufacturer && <p>Manufacturer: {item.manufacturer}</p>}
            {item.manufacturer && senderName === "" && (senderName = item.manufacturer)}

            {item.distributor && <p>Distributor: {item.distributor}</p>}
            {item.distributor && senderName === "" && (senderName= item.distributor)}

            {item.retailer && <p>Retailer: {item.retailer}</p>}
            {item.retailer && senderName === "" && (senderName = item.retailer)}

            {item.consumer && <p>Consumer: {item.consumer}</p>}
            {item.consumer && senderName === "" && (senderName = item.consumer)}

            <div className="tile-actions">
              <button onClick={() => updateAdjustment(item._id, 1, item.quantity)}>+</button>
              <input
                type="text"
                value={adjustments[item._id] || 0} 
                readOnly
                className="quantity-display"
              />
              <button onClick={() => updateAdjustment(item._id, -1, item.quantity)}>-</button>
            </div>

            <button className="trans-check" onClick={() => CheckTransaction(item.tx_hash, item.from_addr, item.to_addr, item.cost, item.quantity)}>
                CHECK VALIDITY
            </button>

            <br />
            <br />
            <button className="buy-button" onClick={() => handleBuy(item.productTitle, item._id, senderName, adjustments[item._id], item.cost)}>
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );  
}

export default Products_details;