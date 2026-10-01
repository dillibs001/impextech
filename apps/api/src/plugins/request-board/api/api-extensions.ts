import gql from 'graphql-tag';

export const shopApiExtensions = gql`
    input SubmitGadgetRequestInput {
        deviceType: String!
        brand: String!
        model: String!
        storagePreference: String!
        colorPreference: String!
        conditionPreference: String!
        budgetMax: Int!
        additionalNotes: String
        customerId: String!
    }

    type GadgetRequest implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        deviceType: String!
        brand: String!
        model: String!
        storagePreference: String!
        colorPreference: String!
        conditionPreference: String!
        budgetMax: Int!
        additionalNotes: String
        status: String!
        customerId: String!
        sourcePriceCAD: Int
        quotedPriceNGN: Int
    }

    extend type Mutation {
        submitGadgetRequest(input: SubmitGadgetRequestInput!): GadgetRequest!
    }
`;
