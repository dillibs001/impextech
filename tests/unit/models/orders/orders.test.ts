import { beforeAll, jest } from '@jest/globals';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import Order from '../../../../src/models/orders/orders.models';  
let mongoServer : MongoMemoryServer;

jest.setTimeout(30000);//this is to set the timeout for the tests to 30 seconds, which is necessary because starting the in-memory MongoDB server can take some time, especially on slower machines or when using certain versions of MongoDB

describe('Order Model Test', () => {

    beforeAll(async()=>
    {
        mongoServer= await MongoMemoryServer.create(
            {binary: {
                // This forces a version compatible with M1/M2/M3 Macs
                version: '6.0.4',
        },
    });//this is to create a new instance of the in-memory MongoDB server before running the tests
        
    const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    })

    afterAll(async()=>
        {
            await mongoose.disconnect();
            // The '?' ensures we only call stop if the server actually started
                 await mongoServer?.stop(); 
        })

    
        afterEach(async()=>
            {
                await Order.deleteMany({});//this is to clear the categories collection after each test
            })

            //test scenarios
            test( 'VALIDATION: Should reject an order without a User ID', async()=>
                {
                    const order = new Order({
                        products: [{ product: new mongoose.Types.ObjectId(), quantity: 1 }],
                        total_price: 150,
                         shipping_address:"123 Tech Lane, Lagos" ,
                         payment_method:"Credit Card"

                    });
                    let err:any;
                    try
                    {
                        await order.validate();

                    }catch(error)
                    {
                        err= error;
                    }
                    expect(err.errors.user_id).toBeDefined();
                })

            test('Should only allow approved status', async()=>
                {
                    const order = new Order({
                        user_id : new mongoose.Types.ObjectId(),
                        products: [{ product_id: new mongoose.Types.ObjectId(), quantity: 1 }],
                        total_price: 150,
                        shipping_address: "123 Tech Lane, Lagos",
                        status: 'Shipped_Fast', // Invalid Enum value
                        payment_method:"Credit Card"
                    });
                    let err : any;
                    try
                    {
                        await order.validate();
                    }
                    catch(error)
                    {
                        err = error;
                    }

                    expect(err.errors.status).toBeDefined();
                    expect(err.errors.status.message).toMatch(/is not a valid enum value/i);
                });
                
                test('Should successfully save an order with multiple items', async () => {
                    const orderData = {
                        user_id: new mongoose.Types.ObjectId(),
                        products: [
                            // ALIGNED: Using product_id as defined in your sub-schema
                            { product_id: new mongoose.Types.ObjectId(), quantity: 2 },
                            { product_id: new mongoose.Types.ObjectId(), quantity: 5 }
                        ],
                        total_price: 550,
                        shipping_address: "123 Tech Lane, Lagos",
                        status: 'Pending',
                        payment_method:"Credit Card"
                    };
            const order = new Order(orderData);
            const savedOrder = await order.save();

            expect(savedOrder._id).toBeDefined();
            expect(savedOrder.products).toHaveLength(2);
            expect(savedOrder.status).toBe('Pending');




    });
});


