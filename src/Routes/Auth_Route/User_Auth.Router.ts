// Required Package Import
import express from "express";
const route = express.Router();
import { User_Auth_Controller } from "../../Controllers/index.controller";
import { validateSignUp, validateOTP } from "../../middleware/Validation/User_Validation/User_Auth_Validation";

//New User Sign Up Route;
route.post('/signUp', validateSignUp, User_Auth_Controller.new_User_Sign_Up);

//OTP Validation;
route.patch('/otpValidation', validateOTP, User_Auth_Controller.otpValidation);

export default route;
