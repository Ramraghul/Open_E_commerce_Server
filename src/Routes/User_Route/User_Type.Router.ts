import express from "express";
import { User_Type_Controller } from "../../Controllers/index.controller";
import { validateUserType } from "../../middleware/Validation/User_Validation/User_Type_Validation";

const route = express.Router();

// New User Type Route with Body Validation
route.post(
    '/newUserType',validateUserType,User_Type_Controller.add_New_User_Type
);

//Get All UserType;
route.get('/getAllUserTypes', User_Type_Controller.getAllUserType);

export default route;
