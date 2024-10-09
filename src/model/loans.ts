import { LoanQueryStruct } from "../core/query";
import { LoanStruct } from "../core/struct";
import DataProvider from "../providers/provider";

class Loans{
    constructor(){
        
    }

    async findAll(){
        try {
            const staffProvider = new DataProvider();
            const data : LoanStruct[] = await staffProvider.get("/data/loans.json");

            return data;
        } catch (error) {
            return null
        }
    }

    async findOne({} : LoanQueryStruct){
        try {
            const staffProvider = new DataProvider();
            const data : LoanStruct[] = await staffProvider.get("/data/staff.json");

            // const filteredData = 
            return data;
        } catch (error) {
            return null
        }
    }
}

export default Loans;