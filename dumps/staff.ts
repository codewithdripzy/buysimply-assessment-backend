import dotenv from "dotenv";

class StaffProvider {
    private baseUrl: string;

    constructor(){
        dotenv.config();
        
        this.baseUrl = process.env.BUYSIMPLY_DATA_BASEURL ?? "";
    }

    async get(){
        try {
            if(!this.baseUrl) throw new Error("Unable to fetch data at the moment");

            const req = await fetch(`${this.baseUrl}/data/staffs.json`);
            const resData = await req.json();

            return resData;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}

export default StaffProvider