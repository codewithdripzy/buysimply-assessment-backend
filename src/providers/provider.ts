import dotenv from "dotenv";

class DataProvider {
    private baseUrl: string;

    constructor(){
        dotenv.config();
        
        this.baseUrl = process.env.BUYSIMPLY_DATA_BASEURL ?? "";
    }

    async get(path: string){
        try {
            if(!this.baseUrl) throw new Error("Unable to fetch data at the moment");

            const req = await fetch(`${this.baseUrl}${path}`);
            const resData = await req.json();

            return resData;
        } catch (error) {
            console.log(error);
            throw new Error(`${error}`);
        }
    }
}

export default DataProvider