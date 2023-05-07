import express from "express";
import { getUserByEmail, createUser } from "../db/models/user_model.js";
import { authentication, random } from "../helper/index.js";

export const register = async (req: express.Request, res: express.Response) => {
  const { email, password, username } = req.body;
  try {
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log("ERR REQ" + req.body);
    console.log(error);
    return res.sendStatus(400);
  }
};
