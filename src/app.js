import { GraphQLServer } from "graphql-yoga";
import prisma from "./prisma"

import { Query, Mutation } from "./resolvers";

const resolvers = {
    Query,
    Mutation
}

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: {
        prisma
    }
});

server.start(() => console.log("Server is up and running..."));