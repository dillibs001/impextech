import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import Payment from '../../../../src/models/orders/payments.models'; 



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
                        await Payment.deleteMany({})
                    })
                    //test scenarios
                    test('Should reject a payment without an order_id',async()=>
                        {
                            const payment = new Payment ({
                                payment_method : 'Credit Card',
                                
                            });

                            let err : any;
                            try
                            {
                                await payment.validate();
                            }catch(error)
                            {
                                err=error;
                            }
                            expect(err.errors.order_id).toBeDefined();
                        })

                        test(' Should reject unapproved payment methods', async () => {
                            const payment = new Payment({
                                order_id: new mongoose.Types.ObjectId(),
                                payment_method: 'Crypto', // this crypto enum doesn't exist

                                status: 'Pending'
                            });
                    
                            let err: any;
                            try {
                                await payment.validate();
                            } catch (error) {
                                err = error;
                            }
                    
                            expect(err.errors.payment_method).toBeDefined();
                            expect(err.errors.payment_method.message).toMatch(/is not a valid enum value/i);
                        });


                        test(' Should successfully record a successful transaction', async () => {
                            const paymentData = {
                                order_id: new mongoose.Types.ObjectId(),
                                payment_method: 'Bank Transfer',
                                payment_status: 'Completed',
                                transaction_id: "TXN_IMP_" + Date.now() // Mocking a unique ID from a gateway
                            };
                    
                            const payment = new Payment(paymentData);
                            const savedPayment = await payment.save();
                    
                            expect(savedPayment._id).toBeDefined();
                            expect(savedPayment.payment_status).toBe('Completed');
                            expect(savedPayment.payment_method).toBe('Bank Transfer');
                        });
    })