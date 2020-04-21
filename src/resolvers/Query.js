export const Query = {
    async users(parent, args, { prisma }, info) {
        const users = await prisma.query.users(null, info);
        return users;
    },

    async jokes(parent, { query, minRate }, { prisma }, info) {

        const options = {};
        if (query || minRate) {
            if (query && minRate) {
                options.where = {
                    AND: [{
                        title_contains: query
                    }, {
                        text_contains: query
                    }, {
                        avgRating_gt: minRate
                    }]
                }
            } else {
                options.where = {
                    OR: [{
                        title_contains: query
                    }, {
                        text_contains: query
                    }, {
                        avgRating_gt: minRate
                    }]
                }
            }

        }

        const jokes = await prisma.query.jokes(options, info);
        return jokes;
    },

    async comments(parent, { jokeId, authorId }, { prisma }, info) {

        if (!jokeId && !authorId)
            throw new Error("Not valid args provided.");

        const options = {};
        if (jokeId && authorId) {
            options.where = {
                AND: [{
                    joke: {
                        id: jokeId
                    }
                }, {
                    author: {
                        id: authorId
                    }
                }]
            }
        } else {
            options.where = {
                OR: [{
                    joke: {
                        id: jokeId
                    }
                }, {
                    author: {
                        id: authorId
                    }
                }]
            }
        }

        const comments = await prisma.query.comments(options, info);
        return comments;

    },

    async reviews(parent, { jokeId, authorId }, { prisma }, info) {
        if (!jokeId && !authorId)
            throw new Error("Not valid args provided.");

        const options = {};
        if (jokeId && authorId) {
            options.where = {
                AND: [{
                    joke: {
                        id: jokeId
                    }
                }, {
                    author: {
                        id: authorId
                    }
                }]
            }
        } else {
            options.where = {
                OR: [{
                    joke: {
                        id: jokeId
                    }
                }, {
                    author: {
                        id: authorId
                    }
                }]
            }
        }

        const reviews = await prisma.query.reviews(options, info);
        return reviews;

    }
}