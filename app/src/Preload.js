// Preload.js
import React, { useEffect, useState } from "react";
import BlockchainService from "./BlockchainService";
import { useNavigate } from "react-router-dom";

const Preload = () => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const initializeConnection = async () => {
            const connection = await BlockchainService();
            if (connection) {
                setAccount(connection.selectedAccount);
                setContract(connection.contract);
                
                // Navigate to the SignIn page
                navigate("/signin");

            }
        };

        initializeConnection();
    }, []);

    return (
        <div>
            {account ? (
                <>
                    <h2>Connected Account: {account}</h2>
                    {contract ? <h3>Contract Ready: {contract._address}</h3> : <h3>Loading Contract...</h3>}
                </>
            ) : (
                <h2>Connecting to Ganache...</h2>
            )}
        </div>
    );
};

export default Preload;
