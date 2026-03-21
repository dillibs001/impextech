import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Wishlist  from '../../../../src/models/users/wishlist.model';

let mongoServer : MongoMemoryServer;
jest.setTimeout(30000);//this is to set the timeout for the tests to 30 seconds, which is necessary because starting the in-memory MongoDB server can take some time, especially on slower machines or when using certain versions of MongoDB

describe('Wishlist Model Test', ()=>
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
                                await Wishlist.deleteMany({})
                            })
                            //test scenarios
                            test(' Should reject a wishlist without a user_id', async () => {
                                const wishlist = new Wishlist({
                                    products: [new mongoose.Types.ObjectId()]
                                });
                        
                                let err: any;
                                try {
                                    await wishlist.validate();
                                } catch (error) {
                                    err = error;
                                }
                        
                                expect(err.errors.user_id).toBeDefined();
                            });
                        
                            test(' Should allow an empty products array by default', async () => {
                                const wishlistData = {
                                    user_id: new mongoose.Types.ObjectId(),
                                    products: []
                                };
                        
                                const wishlist = new Wishlist(wishlistData);
                                const savedWishlist = await wishlist.save();
                        
                                expect(savedWishlist.user_id).toBeDefined();
                                expect(savedWishlist.products).toHaveLength(0);
                            });

                            
                        
                            test('Should successfully store multiple product references', async () => {
                                const prod1 = new mongoose.Types.ObjectId();
                                const prod2 = new mongoose.Types.ObjectId();
                        
                                const wishlistData = {
                                    user_id: new mongoose.Types.ObjectId(),
                                    products: [prod1, prod2]
                                };
                        
                                const wishlist = new Wishlist(wishlistData);
                                const savedWishlist = await wishlist.save();
                        
                                expect(savedWishlist.products).toHaveLength(2);
                                // Verify the IDs match our original 'Assets'
                                expect(savedWishlist.products[0].toString()).toBe(prod1.toString());
                                expect(savedWishlist.products[1].toString()).toBe(prod2.toString());
                            });
                        
                            test('Should automatically include timestamps', async () => {
                                const wishlist = new Wishlist({
                                    user_id: new mongoose.Types.ObjectId()
                                });
                        
                                const savedWishlist = await wishlist.save();
                        
                                // Verify 'createdAt' and 'updatedAt' are rendered
                                expect(savedWishlist.createdAt).toBeDefined();
                                expect(savedWishlist.updatedAt).toBeDefined();
                            });
                            });
