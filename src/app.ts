import dotenv from "dotenv";
import BuySimplyServer from "./server";

// initialize enviromental variable configuration
dotenv.config();

// instanciate server class
const PORT = Number(process.env.PORT ?? "");
const server = new BuySimplyServer({ PORT });

// call the listen method in the server class
const serverFunction = server.listen();

// export the server class for serveless funtions
export default serverFunction;