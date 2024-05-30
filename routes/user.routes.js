const express = require("express");
const userController = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const userMiddleware = require("../middleware/user.images.middleware")

function getUserRoutes(){
    const router = express.Router();

    router.use(express.json());
    router.post("/login", userController.loginUser);

    router.use(authMiddleware);

    router.post("/registerUser", userMiddleware.upload, userController.registerUser);
    router.post("/changePassword", userController.changePassword);
    
    router.get("/getAllUsers", userController.getAllUsers);
    router.get("/byID/:id", userController.getUserById);
    router.get("/userMatrices", userController.getUserMatrices);
    router.get("/getSignedUser", userController.getSignedUser);

    router.put("/editUser/:id", userController.editUser);

    router.delete("/deleteUser/:id", userController.deleteUser);
    
    

    return router;
}

module.exports = getUserRoutes();