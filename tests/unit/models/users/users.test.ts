import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import User from '../../../../src/models/users/users.model';   

let mongoServer : MongoMemoryServer;
jest.setTimeout(30000);//this is to set the timeout for the tests to 30 seconds, which is necessary because starting the in-memory MongoDB server can take some time, especially on slower machines or when using certain versions of MongoDB

describe('User Model Test', ()=>
    {   
        beforeAll(async()=>
            {
                mongoServer = await MongoMemoryServer.create(
                    {binary:
                        {
                            // This forces a version compatible with M1/M2/M3 Macs
                            version:'6.0.4',
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
                
                });

                afterEach(async()=>
                    {
                        await User.deleteMany({});
                    })
                

                    //test scenarios 
                    test('Should reject a user without an email', async()=>
                        {
                            const user = new User({
                                first_name : "Dillibs",

                                password: "password123"


                            });
                            let err : any;//
                            
                            try
                            {
                                await user.validate();

                            }catch(error)
                            {
                               err =error;
                            }
                            expect(err.errors.email).toBeDefined();
                        });

                        test("Security : should reject duplicate emails", async()=>
                            {
                                const email = "unique@test.com";

                                await User.create({
                                    first_name: "User2",
                                    last_name: "Test",
                                    email: email,
                                    password: "password123"
                                });
                                //create a second user with same email

                                let err : any;
                                try {
                                    await User.create({
                                        first_name: "User2",
                                        last_name: "Test",
                                        email: email,
                                        password: "password123"
                                    });
                                } catch (error) {
                                    err = error;
                                }

                                 // MongoDB error code 11000 = Duplicate Key
                                 expect(err.code).toBe(11000);

                    
                            });

                                test('INTEGRITY: Should trim whitespace from email', async () => {
                                    const userWithSpaces = new User({
                                        first_name: " Jane ",
                                        last_name: "Doe",
                                        email: " jane@example.com ",
                                        password: "password123"
                                    });
                                    const savedUser = await userWithSpaces.save();//save the user
                                        //verify if the trim works
                                    expect(savedUser.email).toBe("jane@example.com");
                                    expect(savedUser.first_name).toBe("Jane");
                                
                                })



})
