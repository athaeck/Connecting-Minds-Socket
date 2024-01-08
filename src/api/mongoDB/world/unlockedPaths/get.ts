import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType, makeResponse } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";
import {Request,Response,NextFunction} from "express"
import { Db, Collection } from "mongodb";

class GetUnlockedPositionsEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "unlockedPositions";
  
    constructor() {
      super("/world/unlockedPaths/get", ExpressRouteType.GET);
      this.dbName = "world";
    }
    handleRequest = async (
      _req: Request,
      _res: Response,
      _next: NextFunction
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


module.exports = GetUnlockedPositionsEndpoint