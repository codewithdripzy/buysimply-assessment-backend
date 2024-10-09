import * as jwt from "jsonwebtoken";
import Staff from "../model/staffs";
import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import { HTTP_RESPONSE_CODE } from "../core/values";
import Loans from "../model/loans";

const GetLoanController = async (req: Request, res: Response) => {
    try {
        configDotenv();
        const staffData = req.query.staffData;

        const loans = new Loans();
        const loanData = await loans.findAll();

        // if(staffData.loa)
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