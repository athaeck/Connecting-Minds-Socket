import { ConnectingMindsMongoDBRouteFactory } from ".";
import { AddRoute, BaseExpressRoute } from "../../athaeck-express-nosql-extension/athaeck-express-base/base/express";
import { BaseNoSQLExpressRouterExtension } from "../../athaeck-express-nosql-extension/base";

import { ConnectingMindsNoSQLFactory } from "../db";


class MongoDBRouter extends BaseNoSQLExpressRouterExtension {
    noSQLName: string
    path: string
    adapter: string

    constructor() {
        super()
        this.path = "/api/mongoDB"
        this.adapter = "mongoDbRouter"
        this.routeFactory = new ConnectingMindsMongoDBRouteFactory("./mongoDB/")
        this.routeFactory.ConnectRoutes(this)
        this.Log()
    }

    protected async Init(): Promise<void> {
        this.noSQLName = "mongoDB"
        this.noSQLFactory = new ConnectingMindsNoSQLFactory("/noSQL/")
        super.Init()
    }


    AddRoute(route: BaseExpressRoute): void {
        this.app = AddRoute(this.app, route)
    }


}

module.exports = MongoDBRouter