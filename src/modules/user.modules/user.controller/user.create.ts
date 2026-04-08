import { Request, Response } from "express";

class UserCreate {
    async handle(req: Request, res: Response) {
            console.log(req.access_token);
            res.status(201).json({
                message: "User create sucessfuly",
                data: req.access_token,
            });
       
    }
}

export const userCreate = new UserCreate();
