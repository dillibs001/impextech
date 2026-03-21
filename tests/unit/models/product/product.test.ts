import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import Product from '../../../../src/models/product/product.model';
let mongoServer : MongoMemoryServer;

jest.setTimeout(30000);//this is to set the timeout for the tests to 30 seconds, which is necessary because starting the in-memory MongoDB server can take some time, especially on slower machines or when using certain versions of MongoDB


describe('Product Model Test', () => {
    beforeAll(async ()=>
    {
        mongoServer = await MongoMemoryServer.create( 
            {binary: {
                // This forces a version compatible with M1/M2/M3 Macs
                version: '6.0.4',
        },
    });//this is to create a new instance of the in-memory MongoDB server before running the tests
        
    const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    })//this is to connect to the in-memory mongodb database before running the tests

    afterAll(async ()=>
        {
            await mongoose.disconnect();//this is to disconnect from the in-memory mongodb database after running the tests
            // The '?' ensures we only call stop if the server actually started
                 await mongoServer?.stop(); 
        });//this is to disconnect from the in-memory mongodb database and stop the server after running the tests


        afterEach(async ()=>
            {
                await Product.deleteMany({});//this is to clear the products collection after each test
            }
        )

        //Test scenarios
        test('should reject a product without a name', async ()=>
        {
            const productWithoutName = new Product({
                description:'A sample product description',
                price: 10,
                category: 'Sample Category',
                stock: 100,
                image_url: 'http://example.com/image.jpg',
                user_id: new mongoose.Types.ObjectId(),
            });
            
            let err: any;//this is to declare a variable to store the error that will be thrown when trying to save the product without a name

            try
            {
                await productWithoutName.validate();//this is to validate the product without a name, which should also throw an error due to the validation rules defined in the product schema
               
            }
            catch(error)
            {
                err = error;//this is to assign the error that was thrown to the err variable
            }
            expect(err.errors.name).toBeDefined();//this is to check if the error for the name field is defined, which means that the validation for the name field failed as expected
            expect(err.errors.name.message).toBe('Product name is required');//this is to check if the error message for the name field is correct, which should be 'Product name is required' as defined in the product schema
        });


        test('CONSTRAINTS: Should reject negative prices', async () => {
            const invalidProduct = new Product({
                name: "Glitch Gadget",
                price: -100,
                category: 'Accessories'
            });
            let err: any;//this is to declare a variable to store the error that will be thrown when trying to save the product with a negative price

            try
            {
                await invalidProduct.validate();//this is to validate the product with a negative price, which should also throw an error due to the validation rules defined in the product schema
            }
            catch(error)
            {
                err = error;//this is to assign the error that was thrown to the err variable   
            }
            expect(err.errors.price).toBeDefined();//this is to check if the error for the price field is defined, which means that the validation for the price field failed as expected
            expect(err.errors.price.message).toMatch(/less than minimum allowed value|must be at least 0/);//this is to check if the error message for the price field is correct, which should be 'Product price must be at least 0' as defined in the product schema
        });


});