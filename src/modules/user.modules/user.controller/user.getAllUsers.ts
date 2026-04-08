import { Request, Response } from "express";

class UserGetAllUser {
    async handle(req: Request, res: Response) {
            res.status(200).json({ Data: "Congrats", ip: req.ip })
    }
}

export const userGetAllUsers = new UserGetAllUser();
