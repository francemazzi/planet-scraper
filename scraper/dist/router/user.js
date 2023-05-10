import { getAllUsers } from "../controller/user.js";
export default (router) => {
    //   router.get("/users", isAuthenticated, getAllUsers);
    router.get("/users", getAllUsers);
};
//# sourceMappingURL=user.js.map