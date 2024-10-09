// import http from "http";
import cors from "cors";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import loanRouter from "./routes/loans";
import session from "express-session";
import { VerifyToken } from "./controllers/auth";
import { verifyAPI, defaulFallback, noRouteFound } from "./controllers/default";
import { BuySimplyServerStruct } from "./core/interfaces";

class BuySimplyServer{
    app : express.Application;
    port : number;

    constructor({ PORT } : BuySimplyServerStruct){
        this.port = PORT;
        this.app = express();

        this.setup();
        this.route();
    }

    setup(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(session({
            secret: process.env.BUYSIMPLY_SESSION_SECRET ?? '',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true }
        }));
        this.app.use(express.urlencoded({ extended: true, limit : '10mb' }));
        this.app.use('/data', express.static(path.join(__dirname, '../src/data')));
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