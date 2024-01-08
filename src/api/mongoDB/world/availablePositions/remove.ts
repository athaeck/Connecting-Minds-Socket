import { Request, Response, NextFunction } from "express";
import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType, makeResponse } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";
import { Db, Collection } from "mongodb";

class RemoveAvailablePositionEndpoint extends BaseNoSQLExpressRouteExtension {
  dbName: string;
  private _collectionName: string = "availablePositions";

  constructor() {
    super("/world/availablePositions/del", ExpressRouteType.DELETE);
    this.dbName = "world";
  }

  handleRequest = async (
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) => {
    let status: number = 200;
    const positionDataId: string = _req.body;
    let newDocuments:any[] = []

    try {
      if (this.db) {
        const db: Db = <Db>this.db;

        const collection: Collection = db.collection(this._collectionName);

        await collection.deleteOne({
          _id: positionDataId,
        });

        newDocuments = await collection.find({}).toArray()
      }else{
        status = 500
      }
    } catch (error: any) {
      status = 500
    }

    makeResponse(_res,status,newDocuments)
  };
}

module.exports = RemoveAvailablePositionEndpoint;
