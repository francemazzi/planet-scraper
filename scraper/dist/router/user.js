import { deleteUser, getAllUsers, updateUser } from "../controller/user.js";
import { isAuthenticated, isOwner } from "../middlewares/index.js";
export default (router) => {
    router.get("/users", isAuthenticated, getAllUsers);
    router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
    router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
//# sourceMappingURL=user.js.map