import React, { useState } from 'react';
import BlockchainService from './BlockchainService';

function App() {
    const [itemDetails, setItemDetails] = useState(null);
    const [upc, setUpc] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const handleManufacture = async () => {
        await BlockchainService.manufactureItem(upc, name, description, price);
        alert("Item manufactured!");
    };

    const handleFetchItem = async () => {
        const item = await BlockchainService.fetchItem(upc);
        setItemDetails(item);
    };

    return (
        <div>
            <h1>Supply Chain Management</h1>
            
            <div>
                <h2>Manufacture Item</h2>
                <input
                    type="text"
                    placeholder="UPC"
                    value={upc}
                    onChange={(e) => setUpc(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <button onClick={handleManufacture}>Manufacture</button>
            </div>

            <div>
                <h2>Fetch Item</h2>
                <input
                    type="text"
                    placeholder="UPC to fetch"
                    value={upc}
                    onChange={(e) => setUpc(e.target.value)}
                />
                <button onClick={handleFetchItem}>Fetch Item</button>

                {itemDetails && (
                    <div>
                        <h3>Item Details</h3>
                        <p>UPC: {itemDetails[0]}</p>
                        <p>Name: {itemDetails[5]}</p>
                        <p>Description: {itemDetails[6]}</p>
                        <p>Price: {itemDetails[2]}</p>
                        <p>State: {itemDetails[3]}</p>
                        <p>Manufacturer ID: {itemDetails[4]}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
