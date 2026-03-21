import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Cart from '../../../../src/models/users/cart.model'

let mongoServer : MongoMemoryServer;
jest.setTimeout(30000);//this is to set the timeout for the tests to 30 seconds, which is necessary because starting the in-memory MongoDB server can take some time, especially on slower machines or when using certain versions of MongoDB

describe('Payment Model Test', ()=>
    {
        beforeAll(async()=>
                    {
                        mongoServer = await MongoMemoryServer.create(
                            {
                                binary:
                                {
                                     // This forces a version compatible with M1/M2/M3 Macs
                                     version: '6.0.4'
                                },
                            });////this is to create a new instance of the in-memory MongoDB server before running the tests
                        const uri = mongoServer.getUri();
                        await mongoose.connect(uri);
                    })
                    afterAll(async()=>
                                    {
                                        await mongoose.disconnect();
                                        //The '?' ensures we only call stop if the server actually started
                                        await mongoServer?.stop();
                                    })
                                    afterEach(async()=>
                                        {
                                            await Cart.deleteMany({})
                                        })
                                        //test scenarios
                                        test(' Should reject a cart without a user_id', async () => {
                                            const cart = new Cart({
                                                items: [{ product_id: new mongoose.Types.ObjectId(), quantity: 1 }]
                                            });
                                    
                                            let err: any;
                                            try {
                                                await cart.validate();
                                            } catch (error) {
                                                err = error;
                                            }
                                    
                                            expect(err.errors.user_id).toBeDefined();
                                        });
                                        test(' Should reject items without a product_id', async () => {
                                            const cart = new Cart({
                                                user_id: new mongoose.Types.ObjectId(),
                                                items: [{ quantity: 5 }] // Missing product_id
                                            });
                                    
                                            let err: any;
                                            try {
                                                await cart.validate();
                                            } catch (error) {
                                                err = error;
                                            }
                                    
                                            // We reach into the array error path
                                            expect(err.errors['items.0.product_id']).toBeDefined();
                                        });

                                        test(' Should reject quantities less than 1', async () => {
                                            const cart = new Cart({
                                                user_id: new mongoose.Types.ObjectId(),
                                                items: [{ product_id: new mongoose.Types.ObjectId(), 
                                                quantity: 0 }]
                                            });
                                    
                                            let err: any;
                                            try {
                                                await cart.validate();
                                            } catch (error) {
                                                err = error;
                                            }
                                    
                                            expect(err.errors['items.0.quantity']).toBeDefined();
                                            expect(err.errors['items.0.quantity'].message).toMatch(/less than minimum allowed value/i);
                                        });
                                        test('Should successfully save a cart with valid items', async () => {
                                            const cartData = {
                                                user_id: new mongoose.Types.ObjectId(),
                                                items: [
                                                    { product_id: new mongoose.Types.ObjectId(), quantity: 2 },
                                                    { product_id: new mongoose.Types.ObjectId(), quantity: 1 }
                                                ]
                                            };
                                            const cart = new Cart(cartData);
                                            const savedCart = await cart.save();
                                            expect(savedCart._id).toBeDefined();
                                            expect(savedCart.items).toHaveLength(2);
                                            expect(savedCart.items[0].quantity).toBe(2);
                                            
                                        });
                                    
    })