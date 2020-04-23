import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require("dotenv").config();


import { isAuth } from "../util/isAuth";
export const Mutation = {

    async signUp(parent, args, { prisma }, info) {
        const password = await bcrypt.hash(args.data.password, 12);
        if (!password)
            throw new Error("Error while signing up.");

        const user = await prisma.mutation.createUser({ data: { ...args.data, password } }, info);
        if (!user)
            throw new Error("Error while signing up.");
        return user;
    },

    async login(pareng, args, { prisma, req }, info) {

        const { JWT_SECRET } = process.env;
        let userExists = false;
        if (!args.data.email && !args.data.username)
            throw new Error("Not valid args provided.");

        let user;
        if (args.data.email) {
            user = await prisma.query.user({
                where: {
                    email: args.data.email
                }
            });

            if (user)
                userExists = true;
        }

        if (args.data.username) {
            user = await prisma.query.user({
                where: {
                    username: args.data.username
                }
            });
            if (user)
                userExists = true;
        }
        if (!userExists)
            throw new Error("User does not exist.");

        const passwordMatch = await bcrypt.compare(args.data.password, user.password);
        if (!passwordMatch)
            throw new Error("Wrong password.");

        const token = await jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
        if (!token)
            throw new Error("Error with authentication.");

        return {
            token,
            Message: "Login successfully"
        }


    },

    async deleteAccount(parent, args, { prisma, req }, info) {
        const userData = await isAuth(req);

        const user = await prisma.mutation.deleteUser({
            where: {
                id: userData.id
            }
        });

        if (!user)
            throw new Error("Account not deleted.");

        return "Account is successfully deleted.";
    },

    async writeJoke(parent, args, { prisma, req }, info) {
        const userData = await isAuth(req);

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
                        id: userData.id
                    }
                }
            }
        }, info);

        if (!joke)
            throw new Error("Error while creating joke.");
        return joke;
    },

    async deleteJoke(parent, args, { prisma, req }, info) {
        const userData = await isAuth(req);
        const jokeExists = await prisma.exists.Joke({ id: args.jokeId, author: { id: userData.id } });

        if (!jokeExists)
            throw new Error("Joke does not exist or you are not its author.");

        const joke = await prisma.mutation.deleteJoke({
            where: {
                id: args.jokeId
            }
        }, info);

        return joke;
    },

    async updateJoke(parent, args, { prisma, req }, info) {
        const userData = await isAuth(req);
        const jokeExists = await prisma.exists.Joke({ id: args.jokeId, author: { id: userData.id } });
        if (!jokeExists)
            throw new Error("Joke does not exist or you are not its author");

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

    async writeComment(parent, args, { prisma, req }, info) {
        const userData = await isAuth(req);
        const comment = await prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userData.id
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

    async deleteComment(parent, args, { prisma, req }, info) {

        const userData = await isAuth(req);
        const commentExists = await prisma.exists.Comment({ id: args.commentId, author: { id: userData.id } });
        if (!commentExists)
            throw new Error("Comment does not exist or you are not its author.");

        const comment = await prisma.mutation.deleteComment({
            where: {
                id: args.commentId
            }
        }, info);

        return comment;
    },

    async updateComment(parent, args, { prisma, req }, info) {
        const userData = await isAuth(req);
        const commentExists = await prisma.exists.Comment({ id: args.commentId, author: { id: userData.id } });
        if (!commentExists)
            throw new Error("Comment does not exist or you are not its author.");

        const comment = await prisma.mutation.updateComment({
            data: {
                ...args.data
            }, where: {
                id: args.commentId
            }
        }, info);

        return comment;
    },

    async writeReview(parent, args, { prisma, req }, info) {
        const userData = await isAuth(req);

        if (userData.role != "REVIEWER")
            throw new Error("You can not write reviews.");

        const joke = await prisma.query.joke({ where: { id: args.data.jokeId } });
        if (!joke)
            throw new Error("Joke does not exist.");

        const review = await prisma.mutation.createReview({
            data: {
                text: args.data.text,
                rate: args.data.rate,
                joke: {
                    connect: {
                        id: args.data.jokeId
                    }
                },
                author: {
                    connect: {
                        id: userData.id
                    }
                }
            }
        }, info);

        const newNumberOfRatings = joke.numberOfRatings + 1;
        const newSumOfRatings = joke.sumOfRatings + args.data.rate;
        const newAvgRating = newSumOfRatings / newNumberOfRatings;
        await prisma.mutation.updateJoke({
            data: {
                numberOfRatings: newNumberOfRatings,
                sumOfRatings: newSumOfRatings,
                avgRating: newAvgRating
            }, where: {
                id: args.data.jokeId
            }
        });

        return review;

    },

    async deleteReview(parent, args, { prisma, req }, info) {
        const userData = await isAuth(req);
        const reviewExists = await prisma.exists.Review({ id: args.reviewId, author: { id: userData.id } });


        if (!reviewExists)
            throw new Error("Review does not exist or you can not delete it.");


        const review = await prisma.query.review({ where: { id: args.reviewId } }, "{rate}");



        const joke = await prisma.query.review({ where: { id: args.reviewId } }, "{joke{id}}");
        const jokeId = joke.joke.id;

        const jokeToUpdate = await prisma.query.joke({ where: { id: jokeId } });

        const newNumberOfRatings = jokeToUpdate.numberOfRatings - 1;

        const newSumOfRatings = jokeToUpdate.sumOfRatings - review.rate;

        const newAvgRating = newSumOfRatings / newNumberOfRatings;

        await prisma.mutation.updateJoke({
            data: {
                numberOfRatings: newNumberOfRatings,
                sumOfRatings: newSumOfRatings,
                avgRating: newAvgRating
            },
            where: {
                id: jokeId
            }
        });

        const deletedReview = await prisma.mutation.deleteReview({ where: { id: args.reviewId } });
        return deletedReview;
    }


};
