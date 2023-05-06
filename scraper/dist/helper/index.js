import crypto from "crypto";
const SECRET = "ANTONIO-REST-API";
export const random = () => crypto.randomBytes(128).toString("base64");
export const autentication = (salt, password) => {
    return crypto
        .createHmac("sha256", [salt, password].join("/"))
        .update(SECRET)
        .digest();
};
//# sourceMappingURL=index.js.map