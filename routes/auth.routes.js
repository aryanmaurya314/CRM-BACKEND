/**
 * This file will act as authentication and autherizatrion
 */

// define the routes - REST endpoints for user registration
const authController =require("../controllers/auth.controller");
const {verifySignUp} = require("../middlewares");
 
module.exports = (app)=>{

//Signup --> POST 127.0.0.1:8080/crm/api/v1/auth/signup
app.post("/crm/api/v1/auth/signup",[verifySignUp.validateSignUpRequest], authController.signup);

//Signin --> POST 127.0.0.1:8080/crm/api/v1/auth/signin
app.post("/crm/api/v1/auth/signin", authController.signin);
}