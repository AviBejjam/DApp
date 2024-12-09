import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BlockchainService, { getETHBalance } from './BlockchainService';
import axios from 'axios';
import Home from './Home';
import './styles/manufacturer.css';

function Manufacturer() {
  const [balance, setBalance] = useState('Loading...');
  const [user, setUser] = useState(null);
  const [productTitle, setProductTitle] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [cost, setCost] = useState(0);
  const [message, setMessage] = useState('');
  const [state] = useState("Manufactured");
  const location = useLocation();
  const { name } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing transaction...');
    try {
      const { web3, accounts } = await BlockchainService();
      const senderAddress = user.addr;
      const recipientAddress = accounts[0];
      const transactionDetails = {
        from: senderAddress,
        to: recipientAddress,
        value: web3.utils.toWei('0.001', 'ether'),
        gas: 21000,
      };
      const transaction_values = await web3.eth.sendTransaction(transactionDetails);
      setMessage('Transaction successful! Adding product to the database...');
      await axios.post('http://localhost:3001/api/products', {
        productTitle,
        quantity,
        cost,
        manufacturer: name,
        distributor: null,
        consumer: null,
        retailer: null,
        state,
        date: new Date(),
        tx_hash: transaction_values.transactionHash.toString(),
        from_addr: transaction_values.from,
        to_addr: transaction_values.to,
      });
      setMessage('Product added successfully!');
    } catch (error) {
      console.error('Transaction or Database error:', error);
      setMessage('Failed to process the transaction or add the product.');
    }
  };

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        const { web3, accounts } = await BlockchainService();
        if (accounts && accounts.length > 0) {
          let val = name === 'ManFac' ? 1 : name === 'ManFac_1' ? 5 : 0;
          const selectedAccount = accounts[val];
          setUser({ addr: selectedAccount, name });
          const ethBalance = await getETHBalance(selectedAccount);
          setBalance(ethBalance);
        }
      } catch (error) {
        console.error('Error fetching blockchain data:', error);
      }
    };
    fetchBlockchainData();
  }, [name]);

  return (
    <div className="manufacturer-container">
      <nav className="navbar">
        <h1>Manufacturer</h1>
        <button className="logout-button">
          <a href="/signin">Logout</a>
        </button>
      </nav>
      <div className="top-right-box">
        <p><strong>Address:</strong> {user ? user.addr : 'No address available'}</p>
        <p><strong>Username:</strong> {name}</p>
        <p><strong>ETH Balance:</strong> {balance} ETH</p>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <form className="manufacturer-form" onSubmit={handleSubmit}>
        <label>
          Product Title:
          <input type="text" name="productTitle" value={productTitle} onChange={(e) => setProductTitle(e.target.value)} />
        </label>
        <label>
          Product Quantity:
          <input type="number" name="quantity" value={quantity} min={0} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <label>
          Product Cost:
          <input type="number" name="cost" value={cost} min={0} onChange={(e) => setCost(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>

      <br />
      <br />
      <br />
      <br />
      
      <Home stateFilter="Manufactured" manufacturerFilter={[name]} />

      <div className="message">{message}</div>
    </div>
  );
}

export default Manufacturer;
