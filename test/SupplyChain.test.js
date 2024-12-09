/*
// Print fetchItem details index-wise
console.log("Fetched Item Details:");
console.log("UPC (index 0):", fetchItem[0].toString());
console.log("Owner ID (index 1):", fetchItem[1]);
console.log("Price (index 2):", fetchItem[2].toString());
console.log("State (index 3):", fetchItem[3].toString());
console.log("Manufacturer ID (index 4):", fetchItem[4]);
console.log("Item Name (index 5):", fetchItem[5]);
console.log("Item Description (index 6):", fetchItem[6]);
console.log("Distributor ID (index 7):", fetchItem[7]);
console.log("Retailer ID (index 8):", fetchItem[8]);
console.log("Consumer ID (index 9):", fetchItem[9]);
            
*/

const assert = require('assert');
const SupplyChain = artifacts.require('SupplyChain');

contract("SupplyChain", (accounts) => {
    // Item and Manufacturer Details
    var upc = 12;
    const itemName = "SUV";
    const itemDescription = "BENZ - GLS 450";
    const itemPrice = web3.utils.toWei("0.07", "ether");
    var itemState = 0;

    // Accounts
    const ownerID = accounts[0];
    const manufacturerID = accounts[1];
    const distributorID = accounts[2];
    const retailerID = accounts[3];
    const consumerID = accounts[4];

    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: ", ownerID);
    console.log("Manufacturer: ", manufacturerID);
    console.log("Distributor: ", distributorID);
    console.log("Retailer: ", retailerID);
    console.log("Consumer: ", consumerID);

    const emptyAddress = "0x0000000000000000000000000000000000000000";

    let supplyChain;

    before(async () => {
        supplyChain = await SupplyChain.deployed();
    });

    describe('Role: Manufacturer', async () => {
        let result;

        it('add a manufacturer', async () => {
            result = await supplyChain.addManufacturer(manufacturerID);
            const log = result.logs[0];
            const event = log.args;
            assert.strictEqual(event.account.toString(), manufacturerID, 'Manufacturer is correct');
        });

        it('check if manufacturer', async () => {
            result = await supplyChain.isManufacturer(manufacturerID);
            assert.strictEqual(result, true, "Manufacturer does not have the correct role");
        });

        it('renounce manufacturer role', async () => {
            await supplyChain.renounceManufacturer({ from: manufacturerID });
            result = await supplyChain.isManufacturer(manufacturerID);
            assert.strictEqual(result, false, "Manufacturer still has the role after renouncing");
        });

        it('add a manufacturer again', async () => {
            result = await supplyChain.addManufacturer(manufacturerID);
            const log = result.logs[0];
            const event = log.args;
            assert.strictEqual(event.account.toString(), manufacturerID, 'Manufacturer is correct');
        });
    });

    describe('Role: Distributor', async () => {
        let result;

        it('add a distributor', async () => {
            result = await supplyChain.addDistributor(distributorID);
            const log = result.logs[0];
            const event = log.args;
            assert.strictEqual(event.account.toString(), distributorID, 'Distributor is correct');
        });

        it('check if distributor', async () => {
            result = await supplyChain.isDistributor(distributorID);
            assert.strictEqual(result, true, "Distributor does not have the correct role");
        });

        it('renounce distributor role', async () => {
            await supplyChain.renounceDistributor({ from: distributorID });
            result = await supplyChain.isDistributor(distributorID);
            assert.strictEqual(result, false, "Distributor still has the role after renouncing");
        });

        it('add a distributor again', async () => {
            result = await supplyChain.addDistributor(distributorID);
            const log = result.logs[0];
            const event = log.args;
            assert.strictEqual(event.account.toString(), distributorID, 'Distributor is correct');
        });
    });

    describe('Role: Retailer', async () => {
        let result;

        it('add a retailer', async () => {
            result = await supplyChain.addRetailer(retailerID);
            const log = result.logs[0];
            const event = log.args;
            assert.strictEqual(event.account.toString(), retailerID, 'Retailer is correct');
        });

        it('check if retailer', async () => {
            result = await supplyChain.isRetailer(retailerID);
            assert.strictEqual(result, true, "Retailer does not have the correct role");
        });

        it('renounce retailer role', async () => {
            await supplyChain.renounceRetailer({ from: retailerID });
            result = await supplyChain.isRetailer(retailerID);
            assert.strictEqual(result, false, "Retailer still has the role after renouncing");
        });

        it('add a retailer again', async () => {
            result = await supplyChain.addRetailer(retailerID);
            const log = result.logs[0];
            const event = log.args;
            assert.strictEqual(event.account.toString(), retailerID, 'Retailer is correct');
        });
    });

    describe('Role: Consumer', async () => {
        let result;

        it('add a consumer', async () => {
            result = await supplyChain.addConsumer(consumerID);
            const log = result.logs[0];
            const event = log.args;
            assert.strictEqual(event.account.toString(), consumerID, 'Consumer is correct');
        });

        it('check if consumer', async () => {
            result = await supplyChain.isConsumer(consumerID);
            assert.strictEqual(result, true, "Consumer does not have the correct role");
        });

        it('renounce consumer role', async () => {
            await supplyChain.renounceConsumer({ from: consumerID });
            result = await supplyChain.isConsumer(consumerID);
            assert.strictEqual(result, false, "Consumer still has the role after renouncing");
        });

        it('add a consumer again', async () => {
            result = await supplyChain.addConsumer(consumerID);
            const log = result.logs[0];
            const event = log.args;
            assert.strictEqual(event.account.toString(), consumerID, 'Consumer is correct');
        });
    });

    describe('Manufacture Item', async () => {
        let result;

        it('manufacture an item', async () => {
            result = await supplyChain.manufactureItem(
                upc,
                itemName,
                itemDescription,
                itemPrice,
                { from: manufacturerID }
            );
            
            const fetchItem = await supplyChain.fetchItem(upc);
        
        
            // Example assertions to match the expected data
            assert.strictEqual(fetchItem[0].toString(), upc.toString(), "Error: Invalid item UPC");
            assert.strictEqual(fetchItem[5], itemName, "Error: Missing or Invalid name");
            assert.strictEqual(fetchItem[6], itemDescription, "Error: Missing or Invalid description");
            assert.strictEqual(fetchItem[3].toString(), itemState.toString(), "Error: Invalid item state");
            assert.strictEqual(fetchItem[4], manufacturerID, "Error: Invalid manufacturer ID");
        });
                
    });

    describe('Pack Item', async () => {
        let result

        it('pack an item', async () => {
            result = await supplyChain.packItem(upc);
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");

            assert.equal(fetchItem[1], manufacturerID, "Error: Invalid ownerID");

            assert.equal(event, "Packed", "Invalid event emitted");
        });
    });

    describe('Sell Item', async () => {
        let result
        it('mark item for sale', async () => {
            result = await supplyChain.sellItem(upc, itemPrice);
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], manufacturerID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");

            assert.equal(fetchItem[3], 2, "Error: Invalid item State");

            assert.equal(event, 'ForSale', "Invalid event emitted");
        });
    });

    describe('Buy Item', async () => {
        let result

        it('buy an item', async () => {
            result = await supplyChain.buyItem(upc, {
                value: itemPrice,
                from: distributorID,
            });
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], distributorID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");

            assert.equal(fetchItem[4], manufacturerID, "Error: Missing or Invalid manufacturerID");
            assert.equal(fetchItem[7], distributorID, "Error: Missing or Invalid distributorID");
            assert.equal(fetchItem[8], emptyAddress, "Error: Missing or Invalid retailerID");
            assert.equal(fetchItem[9], emptyAddress, "Error: Missing or Invalid consumerID");

            assert.equal(fetchItem[3], 3, "Error: Invalid item State");

            assert.equal(event, 'Sold', "Invalid event emitted");
        });
    });

    describe('Ship Item', async () => {
        let result
        it('ship an item', async () => {
            result = await supplyChain.shipItem(upc, { from: distributorID });
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], distributorID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");

            assert.equal(fetchItem[4], manufacturerID, "Error: Missing or Invalid manufacturerID");
            assert.equal(fetchItem[7], distributorID, "Error: Missing or Invalid distributorID");
            assert.equal(fetchItem[8], emptyAddress, "Error: Missing or Invalid retailerID");
            assert.equal(fetchItem[9], emptyAddress, "Error: Missing or Invalid consumerID");

            assert.equal(fetchItem[3], 4, "Error: Invalid item State");

            assert.equal(event, 'Shipped', "Invalid event emitted");
        });
    });

    describe('Receive Item', async () => {
        let result
        it('receive an item', async () => {
            result = await supplyChain.receiveItem(upc, { from: retailerID });
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], retailerID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");

            assert.equal(fetchItem[4], manufacturerID, "Error: Missing or Invalid manufacturerID");
            assert.equal(fetchItem[7], distributorID, "Error: Missing or Invalid distributorID");
            assert.equal(fetchItem[8], retailerID, "Error: Missing or Invalid retailerID");
            assert.equal(fetchItem[9], emptyAddress, "Error: Missing or Invalid consumerID");

            assert.equal(fetchItem[3], 5, "Error: Invalid item State");

            assert.equal(event, 'Received', "Invalid event emitted");
        });
    });

    describe('Purchase Item', async () => {
        let result

        it('purchase an item', async () => {
            result = await supplyChain.purchaseItem(upc, { from: consumerID });
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], consumerID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");

            assert.equal(fetchItem[4], manufacturerID, "Error: Missing or Invalid manufacturerID");
            assert.equal(fetchItem[7], distributorID, "Error: Missing or Invalid distributorID");
            assert.equal(fetchItem[8], retailerID, "Error: Missing or Invalid retailerID");
            assert.equal(fetchItem[9], consumerID, "Error: Missing or Invalid consumerID");

            assert.equal(fetchItem[3], 6, "Error: Invalid item State");

            assert.equal(event, 'Purchased', "Invalid event emitted");
        });
    });

    describe('Fetch Item', async () => {
        let fetchItem;

        it('fetch item details', async () => {
            fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], consumerID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");
            assert.equal(fetchItem[3], 6, "Error: Invalid item State");
            assert.equal(fetchItem[4], manufacturerID, "Error: Missing or Invalid manufacturerID");
            assert.equal(fetchItem[5], itemName, "Error: Invalid item name");
            assert.equal(fetchItem[6], itemDescription, "Error: Invalid item description");
            assert.equal(fetchItem[7], distributorID, "Error: Missing or Invalid distributorID");
            assert.equal(fetchItem[8], retailerID, "Error: Missing or Invalid retailerID");
            assert.equal(fetchItem[9], consumerID, "Error: Missing or Invalid consumerID");
        });
    });

});
