import { Request, Response } from "express";

class UserLogin{
    async handle(req: Request,res: Response){
         res.status(200).json({
                sucess: "Congrats you are logged in",
                token: req.access_token,
                refresh_token: req.refresh_token,
            });
    }
}

export const userLogin = new UserLogin()