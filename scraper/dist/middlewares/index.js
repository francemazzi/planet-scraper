import { getUserBySessionToken } from "../db/models/user_model.js";
export const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = req.cookies["PLANET-AUTH"];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }
        // merge(req, { identity: existingUser });
        req.identity = existingUser;
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = req.identity ? req.identity._id : null;
        if (!currentUserId) {
            return res.sendStatus(400);
        }
        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
//# sourceMappingURL=index.js.map