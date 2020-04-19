export const Subscription = {

    jokes: {
        async subscribe(parent, { authorId }, { prisma }, info) {

            const authorExists = await prisma.exists.User({ id: authorId });
            if (!authorExists)
                throw new Error("Author does not exist.");

            return await prisma.subscription.joke({
                where: {
                    node: {
                        author: {
                            id: authorId
                        }
                    }
                }
            }, info);
        }
    },

    comments: {

        async subscribe(parent, { authorId, jokeId }, { prisma }, info) {
            if (!authorId && !jokeId)
                throw new Error("Not valid arguments provided.");

            return await prisma.subscription.comment({
                where: {
                    OR: [{
                        node: {
                            author: {
                                id: authorId
                            }
                        }
                    }, {
                        node: {
                            joke: {
                                id: jokeId
                            }
                        }
                    }]
                }
            }, info);
        }
    }
}