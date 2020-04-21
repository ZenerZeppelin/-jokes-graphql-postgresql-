import { Prisma } from "prisma-binding";

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://localhost:4466",
    secret: "a1s4d7f8g5h2j3k6l9"
});

export default prisma;

