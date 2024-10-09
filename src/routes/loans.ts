import { Router } from "express";
import { GetLoanController } from "../controllers/loans";

const loanRouter = Router();

loanRouter.route("/").get(GetLoanController)

export default loanRouter;