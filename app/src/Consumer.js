import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BlockchainService, { getETHBalance } from './BlockchainService';
import Home from './Home';
import Products_details from './Products_details';
import './styles/consumer.css';

function Consumer() {
  const [balance, setBalance] = useState('Loading...');
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { name } = location.state || {};

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        const { web3, accounts, contract } = await BlockchainService();

        if (accounts && accounts.length > 0) {
          let val;
          if (name === 'Consumer') val = 4;
          else if (name === 'Consumer_1') val = 8;
          else if (name === 'Consumer_2') val = 9;

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
    <div>
  <div className="navbar">
    <h1>Consumer</h1>
    <button className="logout-button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-box-arrow-left"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
        />
        <path
          fillRule="evenodd"
          d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
        />
      </svg>
      <a href="/signin">LogOut</a>
    </button>
  </div>
  
  <br />
  <div className="top-right-box">
    <p><strong>Address:</strong> {user ? user.addr : 'No address available'}</p>
    <p><strong>Username:</strong> {name}</p>
    <p><strong>ETH Balance:</strong> {balance} ETH</p>
  </div>

  <br />
  <br />
  
  <div className="content">
    <div className="tile">
      <h1>Buy Products</h1>
      <Products_details
        userName={name}
        stateFilter="Retailed"
        retailersFilter={["Retailer", "Retailer_1"]}
      />
      <br />
      <Home
        userName={name}
        stateFilter="Consumed"
        distributorsFilter={[name]}
      />
    </div>
  </div>
</div>

  );
}

export default Consumer;
