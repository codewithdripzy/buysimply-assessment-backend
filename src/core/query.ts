import { AccessLevel, LoanStatus } from "./enums"

interface StaffQueryStruct{
    id?: number,
    name?: string,
    email?: string,
    role?: AccessLevel,
}

interface LoanQueryStruct{
    id?: string,
    amount?: string,
    maturityDate: string,
    status?: LoanStatus,
    applicant?: {
        name?: string,
        emai?: string,
        telephone?: string,
        totalLoan?: string
    },
    createdAt?: string
}

export { StaffQueryStruct, LoanQueryStruct }