import {
    ExpressRouteType,
    makeResponse,
} from "../../../../../athaeck-express-nosql-extension/athaeck-express-base/base/express";
import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import express from "express";
import { Db, Collection } from "mongodb";
import {
    GetGUID,
} from "../../../../../athaeck-websocket-express-base/base/helper";

class SetAvailableItemsEndpoint extends BaseNoSQLExpressRouteExtension {
    dbName: string;
    private _collectionName: string = "AvailableItems";

    constructor() {
        super("/world/availableItems/get", ExpressRouteType.GET);
        this.dbName = "World";
    }

    handleRequest = async (
        _req: express.Request,
        _res: express.Response,
        _next: express.NextFunction
    ) => {
        let status: number;
        let documents: any[] = [];

        console.log("1")

        console.log(this.db)

        if (this.db) {

            const db: Db = <Db>this.db;

            const collection: Collection = db.collection(this._collectionName);


            console.log(2)
            documents = await collection.find({}).toArray()
            console.log(3)
            console.log("received documents: ", documents)

            status = 200;
        } else {
            status = 500;
        }

        makeResponse(_res, status, documents);
    };

}

module.exports = SetAvailableItemsEndpoint;
