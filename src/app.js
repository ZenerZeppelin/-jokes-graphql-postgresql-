import { GraphQLServer } from "graphql-yoga";
import "./prisma"

import { Query, Mutation } from "./resolvers";

const resolvers = {
    Query
}

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers
});

server.start(() => console.log("Server is up and running..."));