import { AccessLevel } from "../core/enums"
import { StaffStruct } from "../core/struct";
import { StaffQueryStruct } from "../core/query";
import DataProvider from "../providers/provider";

class Staff{
    public id: number | null;
    public name: string | null;
    public email: string | null;
    public role: AccessLevel | null;
    private password: string | null;

    constructor(){
        this.id = null;
        this.name = null;
        this.email = null;
        this.role = null;
        this.password = null;
    }
    
    public async findOne({ id } : StaffQueryStruct) : Promise<boolean>{
        try {
            const staffProvider = new DataProvider();
            const data : StaffStruct[] = await staffProvider.get("/data/staffs.json");

            // filter
            const staffData = data.filter((staff) => staff.id == id);

            if(staffData.length > 0) return true;
            return false;
        } catch (error) {
            return false
        }
    }

    public async findOneByEmail({ email } : StaffQueryStruct) : Promise<StaffStruct | null>{
        try {
            const staffProvider = new DataProvider();
            const data : StaffStruct[] = await staffProvider.get("/data/staffs.json");

            // filter staff by email address
            const staffData : StaffStruct[] = data.filter((staff) => staff.email == email);
            return staffData[0];
        } catch (error) {
            return null
        }
    }
}

export default Staff;