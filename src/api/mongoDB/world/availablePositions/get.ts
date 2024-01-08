import {
    ExpressRouteType,
    makeResponse,
} from "../../../../../athaeck-express-nosql-extension/athaeck-express-base/base/express";
import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import express from "express";
import { Db, Collection } from "mongodb";

class SetAvailableItemsEndpoint extends BaseNoSQLExpressRouteExtension {
    dbName: string;
    private _collectionName: string = "availablePositions";

    constructor() {
        super("/world/availablePositions/get", ExpressRouteType.GET);
        this.dbName = "world";
    }

    handleRequest = async (
        _req: express.Request,
        _res: express.Response,
        _next: express.NextFunction
    ) => {
        let status: number;
        let documents: any[] = [];

        if (this.db) {

            const db: Db = <Db>this.db;

            const collection: Collection = db.collection(this._collectionName);

            documents = await collection.find({}).toArray()

            console.log("received documents: ", documents)

            status = 200;
        } else {
            status = 500;
        }

        makeResponse(_res, status, documents);
    };

}

module.exports = SetAvailableItemsEndpoint;
