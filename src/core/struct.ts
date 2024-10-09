import { LoanStatus, AccessLevel } from "./enums";

interface BuySimplyTokenStruct{
    id: number;
    email: string;
    role: AccessLevel
}

interface StaffStruct{
    id: number,
    name: string,
    email: string,
    role: AccessLevel,
    password: string
}

interface LoanStruct{
    id: string,
    amount: string,
    maturityDate: string,
    status: LoanStatus,
    applicant: {
        name: string,
        email: string,
        telephone: string,
        totalLoan?: string
    },
    createdAt: string
}

export { BuySimplyTokenStruct, StaffStruct, LoanStruct};