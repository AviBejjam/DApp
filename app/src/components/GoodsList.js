// src/components/GoodsList.js
import React, { useEffect, useState } from 'react';
import BlockChainService from '../BlockchainService';

const GoodsList = () => {
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    const fetchGoods = async () => {
      const allGoods = await BlockChainService.getGoods(); // Adjust this to your smart contract method
      setGoods(allGoods);
    };

    fetchGoods();
  }, []);

  return (
    <div>
      <h2>Tracked Goods</h2>
      <ul>
        {goods.map((good, index) => (
          <li key={index}>{good}</li> // Adjust according to your good's properties
        ))}
      </ul>
    </div>
  );
};

export default GoodsList;

