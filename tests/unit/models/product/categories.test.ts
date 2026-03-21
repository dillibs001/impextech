import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import Category from '../../../../src/models/product/categories.model';  
let mongoServer : MongoMemoryServer;

jest.setTimeout(30000);//this is to set the timeout for the tests to 30 seconds, which is necessary because starting the in-memory MongoDB server can take some time, especially on slower machines or when using certain versions of MongoDB

describe('Category Model Test', () => {

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
            await Category.deleteMany({});//this is to clear the categories collection after each test
        })

        //Test scenarios
        test('should reject a category without a name', async()=>
        {
            const categoryWithoutName = new Category({
                description:'A sample category description',
            });

            let err: any;//this is to declare a variable to store the error that will be thrown when trying to save the category without a name
            try {
                await categoryWithoutName.validate();//this is to validate the category without a name, which should also throw an error due to the validation rules defined in the category schema
            }
            catch(error)
            {
                err = error;//this is to assign the error that was thrown to the err variable
            }
            
            expect(err).toBeDefined();//this is to assert that the error variable is defined, which means that an error was indeed thrown when trying to validate the category without a name
            expect(err.errors.name.message).toBe('Category name is required');//this is to check if the error message for the name field is correct, which should be 'Category name is required' as defined in the category schema  
            
        })

});