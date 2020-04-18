export const Mutation = {

    async signUp(parent, args, { prisma }, info) {
        const user = await prisma.mutation.createUser({ data: args.data }, info);
        if (!user)
            throw new Error("Error while signing up.");
        return user;
    },

    async writeJoke(parent, args, { prisma }, info) {
        const jokeData = {
            title: args.data.title,
            text: args.data.text,
            numberOfRatings: 0,
            sumOfRatings: 0,
            avgRating: 0.0
        };

        const joke = await prisma.mutation.createJoke({
            data: {
                ...jokeData,
                author:
                {
                    connect: {
                        id: args.data.authorId
                    }
                }
            }
        }, info);

        if (!joke)
            throw new Error("Error while creating joke.");
        return joke;
    },

    async deleteJoke(parent, args, { prisma }, info) {
        const jokeExists = await prisma.exists.Joke({ id: args.jokeId });
        if (!jokeExists)
            throw new Error("Joke does not exist");
        const joke = await prisma.mutation.deleteJoke({
            where: {
                id: args.jokeId
            }
        }, info);

        return joke;
    },

    async updateJoke(parent, args, { prisma }, info) {
        const jokeExists = await prisma.exists.Joke({ id: args.jokeId });
        if (!jokeExists)
            throw new Error("Joke does not exist");

        const joke = await prisma.mutation.updateJoke({
            data: {
                ...args.data
            },
            where: {
                id: args.jokeId
            }

        }, info);

        return joke;
    },

    async writeComment(parent, args, { prisma }, info) {

        const comment = await prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: args.data.authorId
                    }
                },
                joke: {
                    connect: {
                        id: args.data.jokeId
                    }
                }
            }
        }, info);

        if (!comment)
            throw new Error("Error while writting comment.");
        return comment;
    },

    async deleteComment(parent, args, { prisma }, info) {

        const commentExists = await prisma.exists.Comment({ id: args.commentId });
        if (!commentExists)
            throw new Error("Comment does not exist");

        const comment = await prisma.mutation.deleteComment({
            where: {
                id: args.commentId
            }
        }, info);

        return comment;
    },

    async updateComment(parent, args, { prisma }, info) {
        const commentExists = await prisma.exists.Comment({ id: args.commentId });
        if (!commentExists)
            throw new Error("Comment does not exist.");

        const comment = await prisma.mutation.updateComment({
            data: {
                ...args.data
            }, where: {
                id: args.commentId
            }
        }, info);

        return comment;
    }

};