import { Router } from "express";
const route = Router();

import { Authenticate } from "../infra/Middleware/AuthenticationMiddleware/AuthenticateMiddleware";
import { limitingRequestsByHour } from "../infra/Middleware/RateLimitingMiddleware/RateLimit";
import { Authorization } from "../infra/Middleware/AuthorizationMiddleware/AuthorizationMiddleware";
import {
    CreateTenantToken,
    CreateToken,
} from "../infra/CreateToken/CreateToken";

import { userLogin } from "../modules/user.modules/user.controller/user.login";
import { userGetAllUsers } from "../modules/user.modules/user.controller/user.getAllUsers";
import { userCreate } from "../modules/user.modules/user.controller/user.create";
import { teamCreate } from "../modules/team.modules/team.controller/team.create";

import { RefreshMiddleware } from "@/infra/Middleware/AuthRefreshMiddleware/RefreshTokenMiddleware";
import { createTenant } from "@/modules/tenant.modules/tenant.controller/tenant.create";

route.get("/api/hello", Authorization, (req, res) => {
    const cookies = req.cookies.Session_id;

    res.send("Hello World\n" + cookies);
});

route.get("/random_jwt", (req, res) => {
    const token = new CreateTenantToken({
        tenant_id: "a867afb0-10fb-4340-8872-60f9564e9dfa",
        tenant_name: "empresa_a",
    }).CreateTenantToken();

    res.status(200).json({ token });
});

// ------------------------------

route.post("/tenant", createTenant.handle);

route.post(
    "/api/CreateUser",
    userCreate.handle,
);

route.post(
    "/api/login",
    userLogin.handle,
);

route.post(
    "/api/users",
    Authenticate,
    Authorization,
    limitingRequestsByHour,
    userGetAllUsers.handle,
);

route.post(
    "/api/team/join",
    Authenticate,
    limitingRequestsByHour,
    teamCreate.handle,
);

route.post(
    "/api/team/:id/invite",
    Authenticate,
    Authorization,
    limitingRequestsByHour,
    (req, res) => {
        res.status(200).json({ message: "Boa" });
    },
);

route.get("/api/refresh", RefreshMiddleware, (req, res) => {
    res.json({ message: "Congrats!", data: req.access_token });
});

export { route };
