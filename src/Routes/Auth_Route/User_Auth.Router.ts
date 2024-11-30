// Required Package Import
import express from "express";
const route = express.Router();
import { User_Auth_Controller } from "../../Controllers/index.controller";
import { validateSignUp, validateOTP, validateResendOTP, validateSignIn, validateForgotPassword, validateUpdatePassword } from "../../middleware/Validation/User_Validation/User_Auth_Validation";

//New User Sign Up Route;
route.post('/signUp', validateSignUp, User_Auth_Controller.new_User_Sign_Up);

//OTP Validation;
route.patch('/otpValidation', validateOTP, User_Auth_Controller.otpValidation);

//Resend OTP;
route.post('/resendOTP', validateResendOTP, User_Auth_Controller.ResendOtp);

//User Sign In;
route.post('/signIn', validateSignIn, User_Auth_Controller.user_Sign_In);

//User Forgot Password;
route.post('/forgotPassword', validateForgotPassword, User_Auth_Controller.user_Forgot_Password);

//Update New Password;
route.patch('/updateNewPassword', validateUpdatePassword, User_Auth_Controller.user_Password_Update);

export default route;
