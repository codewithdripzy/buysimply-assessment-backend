import * as jwt from "jsonwebtoken";
import Staff from "../model/staffs";
import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import { HTTP_RESPONSE_CODE } from "../core/values";
import Loans from "../model/loans";
import { BuySimplyTokenStruct, LoanStruct } from "../core/struct";
import { AccessLevel, LoanStatus } from "../core/enums";

const GetLoanController = async (req: Request, res: Response) => {
    try {
        configDotenv();
        const { status } = req.query;
        
        const staff = new Staff();
        const secret = process.env.BUYSIMPLY_JWT_SECRET;
        const token = req.headers.authorization?.split(" ")[1];

        if(!token) return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({
            error: "No Api Token Provided"
        });

        if(!secret) return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
            error: " Something went wrong, Try again"
        });

        const loans = new Loans();
        let loanData : LoanStruct[] | null = await loans.findAll();

        if(!loanData) return res.status(HTTP_RESPONSE_CODE.OK).json({
            data: []
        });

        const verifyToken : BuySimplyTokenStruct = jwt.verify(token, secret) as unknown as BuySimplyTokenStruct;
        const userExists = await staff.findOne({
            id: verifyToken.id,
            email: verifyToken.email,
            role: verifyToken.role as AccessLevel,
        });
       
        if(!userExists) return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({
            error: "Account not Found, you are unable to perform this action"
        });

        
        if(verifyToken.role == AccessLevel.STAFF){
            loanData = loanData?.map((loan) => ({
                id: loan.id,
                amount: loan.amount,
                maturityDate: loan.maturityDate,
                status: loan.status,
                applicant: {
                    name: loan.applicant.name,
                    email: loan.applicant.email,
                    telephone: loan.applicant.telephone,
                },
                createdAt: loan.createdAt,
            }));
        }

        if(status == LoanStatus.ACTIVE || status == LoanStatus.PENDING){
            loanData = loanData.filter((loan) => loan.status == status);
        }else{
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
                error: `No status of Type<${status}> found`
            })
        }

        return res.status(HTTP_RESPONSE_CODE.OK).json(loanData)
        // }else{
        //     return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
        //         message: "Something went wrong on our end, It's not your fault"
        //     });
        // }
    } catch (error) {
        return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
            message: "An error ocurred, Try again"
        });
    }
}

export { GetLoanController }