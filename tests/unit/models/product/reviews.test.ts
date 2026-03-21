import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import Review from '../../../../src/models/product/reviews.model'; 


let mongoServer : MongoMemoryServer;
jest.setTimeout(30000);//this is to set the timeout for the tests to 30 seconds, which is necessary because starting the in-memory MongoDB server can take some time, especially on slower machines or when using certain versions of MongoDB

describe('Review Model Test', () =>
    {
        beforeAll(async()=>
            {
                mongoServer = await MongoMemoryServer.create(
                    {binary: {
                        // This forces a version compatible with M1/M2/M3 Macs
                        version: '6.0.4',
                },
            });//this is to create a new instance of the in-memory MongoDB server before running the tests

            const uri = mongoServer.getUri();//this is to get the URI of the in-memory MongoDB server
            await mongoose.connect(uri);//this is to connect to the in-memory mongodb database before running the tests

            })

            afterAll(async()=>
                {
                    await mongoose.disconnect();//this is to disconnect from the in-memory mongodb database after running the tests
                    // The '?' ensures we only call stop if the server actually started
                         await mongoServer?.stop(); //this is to stop the in-memory MongoDB server after running the tests
                })

                afterEach(async()=>
                    {
                        await Review.deleteMany({});//this is to clear the reviews collection after each test
                    })

                    //Test scenarios
                    test('should reject a review without a rating', async()=>
                        {
                            const reviewWithoutRating = new Review({
                                comment:'A sample review comment',
                                product_id: new mongoose.Types.ObjectId(),
                                user_id: new mongoose.Types.ObjectId(),
                            });

                            let err: any;//this is to declare a variable to store the error that will be thrown when trying to save the review without a rating

                            try
                            {
                                await reviewWithoutRating.validate();//this is to validate the review without a rating, which should also throw an error due to the validation rules defined in the review schema   

                            }catch(error)
                            {
                                err = error;//this is to assign the error that was thrown to the err variable
                            }

                            expect(err).toBeDefined();//this is to assert that the error variable is defined, which means that an error was thrown when trying to validate the review without a rating
                            expect(err.errors.rating.message).toBe('Path `rating` is required.');//this is to check if the error message for the rating field is correct, which should be 'Path `rating` is required.' as defined in the review schema  

                        });



    });
