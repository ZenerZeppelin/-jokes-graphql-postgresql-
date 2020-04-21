import { GraphQLServer } from "graphql-yoga";
import prisma from "./prisma"

import { Query, Mutation, Subscription } from "./resolvers";

const resolvers = {
    Query,
    Mutation,
    Subscription
}

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context(req) {
        return {
            prisma,
            req
        }
    }
});

server.start(() => console.log("Server is up and running..."));