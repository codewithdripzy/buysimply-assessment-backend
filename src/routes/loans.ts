import { Router } from "express";
import { GetLoanController, GetUserLoanController, DeleteUserLoanController } from "../controllers/loans";

const loanRouter = Router();

loanRouter.route("/:loanState?").get(GetLoanController);
loanRouter.route("/:email/get").get(GetUserLoanController);
loanRouter.route("/:loanId/delete").delete(DeleteUserLoanController);

export default loanRouter;