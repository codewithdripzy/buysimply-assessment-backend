import { Router } from "express";
import { GetLoanController } from "../controllers/loans";

const loanRouter = Router();

loanRouter.route("/").get(GetLoanController);
loanRouter.route("/:email/get").get(GetUserLoanController);

export default loanRouter;