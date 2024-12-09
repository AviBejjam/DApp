import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Home.css";

function Home({ stateFilter, manufacturerFilter }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (stateFilter) queryParams.append("state", stateFilter);
        if (manufacturerFilter) queryParams.append("manufacturer", manufacturerFilter);

        const response = await axios.get(`http://localhost:3001/api/getItems?${queryParams.toString()}`);
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the items!", error);
        setError("Could not fetch items.");
        setLoading(false);
      }
    };

    fetchItems();
  }, [stateFilter, manufacturerFilter]);

  if (loading) return <p>Loading items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home">
      <h1>Products Details</h1>
      <table className="items-table">
        <thead>
          <tr>
            <th>Product Title</th>
            <th>Product Number</th>
            <th>Payment</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.productTitle || "N/A"}</td>
              <td>{item._id || "N/A"}</td>
              <td>{item.tx_hash || "N/A"}</td>
              <td>{item.state || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
