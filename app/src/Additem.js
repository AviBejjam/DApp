import React, { useState } from "react";
import axios from 'axios';

function Additem() {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);

    const handleSubmit = async () => {
        if (name.trim() === "") {
            alert('Name cannot be empty');
            return;
        }

        if (quantity <= 0) {
            alert('Quantity must be greater than zero');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/addItems', { name, quantity });
            if (response.status === 200) {
                alert('Item added successfully');
                // Clear the form fields
                setName('');
                setQuantity(0);
            }
        } catch (error) {
            console.error('There was an error adding the items!', error);
            alert('Failed to add item');
        }
    };

    return (
        <>
        <h1>Additem</h1>
        <div>
            <label>
                Name:
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
            </label>
        </div>
        <div>
            <label>
                Quantity:
                <input 
                    type="number" 
                    value={quantity} 
                    min={0}
                    onChange={(e) => setQuantity(parseInt(e.target.value))} 
                />
            </label>
        </div>
        <button onClick={handleSubmit}>Submit</button>
        </>
    );
}

export default Additem;