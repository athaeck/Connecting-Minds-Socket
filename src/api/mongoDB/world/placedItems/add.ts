import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType, makeResponse } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";
import { Request, Response, NextFunction } from "express"
import { Db, Collection, ObjectId } from "mongodb";

class AddPlaceItemEndpoint extends BaseNoSQLExpressRouteExtension {
  dbName: string;
  private _collectionName: string = "placedItems";

  constructor() {
    super("/world/placedItems/add", ExpressRouteType.POST);
    this.dbName = "world";
  }
  handleRequest = async (
    _req: Request,
    _res: Response,
    _next: NextFunction
  ) => {
    let status: number = 200;
    const positionDataId: string = _req.body;
    let response: any;

    try {
      if (this.db) {
        const db: Db = <Db>this.db;

        const collection: Collection = db.collection(this._collectionName);

        await collection.insertOne({ _id: new ObjectId(positionDataId) })

        response = "completed";
      } else {
        response = "this.db is not defined"
        status = 500
      }
    } catch (error: any) {
      response = error.toString()
      status = 500
    }

    makeResponse(_res, status, response)
  };
}


module.exports = AddPlaceItemEndpoint