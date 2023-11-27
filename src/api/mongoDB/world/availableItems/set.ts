import { ExpressRouteType, makeResponse } from "../../../../../athaeck-express-nosql-extension/athaeck-express-base/base/express";
import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import express from "express";

class SetAvailableItemsEndpoint extends BaseNoSQLExpressRouteExtension {
    dbName: string;

    constructor() {
        super("/world/availableItems/set", ExpressRouteType.POST)
        this.dbName = "World"
    }

    handleRequest = (_req: express.Request, _res: express.Response, _next: express.NextFunction) => {
        console.log("Request", _req.body)
        makeResponse(_res, 200, "athaeck-api");
    }

}

module.exports = SetAvailableItemsEndpoint