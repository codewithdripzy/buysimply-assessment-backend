// import http from "http";
import cors from "cors";
import path from "path";
import express from "express";
// import { v4 } from "uuidv4";
import loanRouter from "./routes/loans";
import { VerifyToken } from "./controllers/auth";
import { verifyAPI, defaulFallback, noRouteFound } from "./controllers/default";
import { BuySimplyServerStruct } from "./core/interfaces";
import authRouter from "./routes/auth";
// import authRouter from "./routes/auth";
// import Database from "./config/database";
// import assistantRouter from "./routes/assistants";
// import phoneNumberRouter from "./routes/phone";
// import phoneCallRouter from "./routes/call";
// import uploadRouter from "./routes/uploads";
// import analyticsRouter from "./routes/analytics";
// import pricingRouter from "./routes/pricing";
// import campaignRouter from "./routes/campaign";
// import paymentRouter from "./routes/pay";
// import swaggerUi from "swagger-ui-express";
// import swaggerFile from "./swagger.json";
// import { AmiraServerStruct } from "./core/struct";
// import { defaulFallback, noRouteFound, verifyAPI } from "./controllers/default";
// import { deepLinkRouter } from "./routes/deeplink";



class BuySimplyServer{
    app : express.Application;
    port : number;

    constructor({ PORT } : BuySimplyServerStruct){
        this.port = PORT;
        this.app = express();

        this.setup();
        this.connect();
        this.route();
    }

    setup(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true, limit : '10mb' }));
        this.app.use('/data', express.static(path.join(__dirname, '../src/data')));

    }

    async connect(){
        // const database = new Database();
        // this.db = await database.getConnection();
        // this.io.on("connection", (socket) => {
        //     console.log("User connected to Assitant");

        //     socket.on("transcript", async (message) => {
        //         console.log(message);
        //         const response = await ChatProcessingController(message);
                
        //         if(response) return socket.emit("amira-transcript", response);
        //     });

        //     socket.on("disconnect", () => {
        //         console.log("User disconnected");
        //     });
        // });
    }

    route(){
        this.app.use("/api/v:version", verifyAPI);
        this.app.use("/api/v:version/test", defaulFallback);
        this.app.use("/api/v:version/auth", authRouter)
        this.app.use("/api/v:version/loans", VerifyToken, loanRouter);
        this.app.use("/api/v:version", noRouteFound);
    }

    listen(){
        this.app.listen(this.port, () => console.log(`Server running on port ${this.port}`));
        return this.app;
    }
}

export default BuySimplyServer;