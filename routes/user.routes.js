const express = require("express");
const userController = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

function getUserRoutes(){
    const router = express.Router();

    router.use(express.json());
    router.post("/login", userController.loginUser);

    router.use(authMiddleware);

    router.post("/registerUser", userController.registerUser);
    
    router.get("/getAllUsers", userController.getAllUsers);
    router.get("/byID/:id", userController.getUserById);
    router.put("/editUser/:id", userController.editUser);
    router.delete("/deleteUser/:id", userController.deleteUser);
    router.get("/userMatrices", userController.getUserMatrices);
    router.get("/getSignedUser", userController.getSignedUser);
    router.post("/changePassword", userController.changePassword);

    return router;
}

module.exports = getUserRoutes();