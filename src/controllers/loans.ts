import fs from "fs";
import path from "path";
import Loans from "../model/loans";
import Staff from "../model/staffs";
import * as jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import { validateEmail } from "../utils/functions";
import { HTTP_RESPONSE_CODE } from "../core/values";
import { AccessLevel, LoanStatus } from "../core/enums";
import { BuySimplyTokenStruct, LoanStruct } from "../core/struct";

const GetLoanController = async (req: Request, res: Response) => {
    try {
        configDotenv();

        const { status } = req.query;
        const { loanState } = req.params;
        const { id, email, role } = res.locals.staffData;
        
        const staff = new Staff();
        const loans = new Loans();
        let loanData : LoanStruct[] | null = await loans.findAll();

        if(!loanData) return res.status(HTTP_RESPONSE_CODE.OK).json({
            data: []
        });

        const userExists = await staff.findOne({
            id,
            email,
            role: role as AccessLevel,
        });
       
        if(!userExists) return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({
            error: "Account not Found, you are unable to perform this action"
        });

        
        if(role == AccessLevel.STAFF){
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

        if(loanState && loanState == "expired"){
            loanData = loanData.filter((loan) => {
                const today = new Date();
                const maturityDate = new Date(loan.maturityDate);

                return today > maturityDate;
            })
        }

        return res.status(HTTP_RESPONSE_CODE.OK).json(loanData)
    } catch (error) {
        return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
            message: "An error ocurred, Try again"
        });
    }
}

const GetUserLoanController = async (req: Request, res: Response) => {
    try {
        configDotenv();
        const { status } = req.query;
        const { email } = req.params;
        const { id, staffEmail, role} = res.locals.staffData;
        
        const staff = new Staff();
        const loans = new Loans();
        let loanData : LoanStruct[] | null = await loans.findAll();

        if(!loanData) return res.status(HTTP_RESPONSE_CODE.OK).json({
            data: []
        });

        const userExists = await staff.findOne({
            id,
            email: staffEmail,
            role: role as AccessLevel,
        });
       
        if(!userExists) return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({
            error: "Account not Found, you are unable to perform this action"
        });

        
        if(role == AccessLevel.STAFF){
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
        
        if(email){
            if(!validateEmail(email)) return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
                error: "Invalid email provided"
            });
            loanData = loanData.filter((loan) => loan.applicant.email == email);
        }

        return res.status(HTTP_RESPONSE_CODE.OK).json(loanData)
    } catch (error) {
        return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
            message: "An error ocurred, Try again"
        });
    }
}

const DeleteUserLoanController = async (req: Request, res: Response) => {
    try {
        configDotenv();
        const { loanId } = req.params;
        
        const staff = new Staff();
        const secret = process.env.BUYSIMPLY_JWT_SECRET;
        const token = req.headers.authorization?.split(" ")[1];

        if(!loanId) return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
            error: "Provide ID for loan to be deleted"
        });

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

        
        if(verifyToken.role == AccessLevel.SUPER_ADMINSITRATOR){
            const loanExists = loanData.filter((loan) => loan.id == loanId);
            const newLoanData = loanData.filter((loan) => loan.id !== loanId);
            
            if(loanExists.length < 1) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({
                error: "Loan Not Found"
            })

            // write new loan data to file
            const filePath = path.join(__dirname, '../data', 'loans.json');
            fs.writeFileSync(filePath, JSON.stringify(newLoanData, null, 2), 'utf8');

            return res.status(HTTP_RESPONSE_CODE.OK).json({
                message: "Loan deleted successfully",
            });
        }else{
            return res.status(HTTP_RESPONSE_CODE.FORBIDDEN).json({
                error: "Only Super Admin are allowed to perfom this action"
            });
        }
    } catch (error) {
        console.log(error);
        
        return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong, Try again"
        })
    }
}
export {  GetLoanController, GetUserLoanController, DeleteUserLoanController }