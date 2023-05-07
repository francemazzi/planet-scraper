import { getUserByEmail, createUser } from "../db/models/user_model.js";
import { autentication, random } from "../helper/index.js";
export const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }
        const existUser = await getUserByEmail(email);
        if (existUser) {
            return res.sendStatus(400);
        }
        const salt = random();
        const user = await createUser({
            email,
            username,
            autentication: {
                salt,
                password: autentication(salt, password),
            },
        });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log("ERRORE AUTH REGISTER " + error);
        return res.sendStatus(400);
    }
};
//# sourceMappingURL=authentication.js.map