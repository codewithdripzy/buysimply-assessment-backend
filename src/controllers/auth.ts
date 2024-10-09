import Staff from '../model/staffs';
import * as jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import { HTTP_RESPONSE_CODE } from '../core/values';
import { NextFunction, Request, Response } from 'express';
import { validateEmail } from '../utils/functions';
import { BuySimplyTokenStruct, StaffStruct } from '../core/struct';
import { AccessLevel } from '../core/enums';

const LoginAuthController = async (req: Request, res: Response) => {
    try {
        const { BUYSIMPLY_JWT_SECRET, BUYSIMPLY_JWT_REFRESH_SECRET } = process.env;

        if(!BUYSIMPLY_JWT_SECRET || !BUYSIMPLY_JWT_REFRESH_SECRET) return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
            error: "Something went wrong, Try again later"
        });

        const { email, password } = req.body;

        if(!email || !password) return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
            error: "All fields are required"
        })

        // check that email address is valid
        if(!validateEmail(email)) return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
            error: "Invalid email address provided"
        });

        const staff = new Staff();
        const account : StaffStruct | null = await staff.findOneByEmail({
            email,
        });

        if(!account) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({
            error: "Account does not exists"
        });

        if(account.password == password){
            const token = jwt.sign(
            {
                id: account.id,
                email: account.email,
                role: account.role
            },
            BUYSIMPLY_JWT_SECRET,
            { expiresIn: "1h" },);
            const refreshToken = jwt.sign(
                token,
                BUYSIMPLY_JWT_REFRESH_SECRET,
            );

            return res.status(HTTP_RESPONSE_CODE.OK).json({
                name: account.name,
                email: account.email,
                token,
                refreshToken
            })
        }else{
            return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({
                error: "Password is Incorrect"
            });
        }
    } catch (error) {
        return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
            error: "Something went wrong, Try again"
        })
    }
}

const VerifyToken = async (req: Request, res: Response, nextFunction: NextFunction) => {
    try {
        configDotenv();
        
        const staff = new Staff();

        const secret = process.env.BUYSIMPLY_JWT_SECRET;
        const token = req.headers.authorization?.split(" ")[1];

        if(!secret) return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
            error: "Cannot login at this time, Try again later"
        });
        if(!token) return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({
            error: "No token provided"
        });
        

        // validate token and check if user is valid
        if(secret){
            const verifyToken : BuySimplyTokenStruct = jwt.verify(token, secret) as BuySimplyTokenStruct;
            const userExists = await staff.findOne({
                id: verifyToken.id,
                email: verifyToken.email,
                role: verifyToken.role as AccessLevel,
            });
            
            if(!userExists) return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({
                error: "Account not Found, you are unable to perform this action"
            });

            // pass staff data to next function
            // req.session.save(() => )
            // req.query.staffData = `?id=${verifyToken.id}&email=${verifyToken.email}&role=${verifyToken.role}`;
            return nextFunction();
        }else{
            return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
                message: "Something went wrong on our end, It's not your fault"
            });
        }
    } catch (error) {
        console.log(error);
        
        return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({
            message: "Invalid Token Provided"
        })
    }
}

const LogoutAuthController = async (req: Request, res: Response) => {
    try {
        configDotenv();
        
    } catch (error) {
        console.log(error);
        
        return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({
            message: "Invalid Token Provided"
        })
    }
}
export { LoginAuthController, VerifyToken, LogoutAuthController };