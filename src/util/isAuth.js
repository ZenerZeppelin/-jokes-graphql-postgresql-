import jwt from "jsonwebtoken";
require("dotenv").config();

async function isAuth(req) {
    try {
        const { JWT_SECRET } = process.env;
        const authHeader = req.request.headers.authorization;
        if (!authHeader)
            throw new Error("Not authenticated.");

        const token = authHeader.split(" ")[1];
        if (!token)
            throw new Error("Not authenticated.");

        const decodedToken = await jwt.verify(token, JWT_SECRET);
        if (!decodedToken)
            throw new Error("Not authenticated.");
        return decodedToken;

    } catch (error) {
        throw new Error("Not authenticated.")
    }

}

export { isAuth }

