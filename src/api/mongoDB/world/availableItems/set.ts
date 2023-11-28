import {
  ExpressRouteType,
  makeResponse,
} from "../../../../../athaeck-express-nosql-extension/athaeck-express-base/base/express";
import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import express from "express";
import mongodb, { Db, Collection } from "mongodb";
import { GetGUID } from "../../../../../athaeck-websocket-express-base/base/helper";

class SetAvailableItemsEndpoint extends BaseNoSQLExpressRouteExtension {
  dbName: string;
  private _collectionName: string = "AvailableItems";

  constructor() {
    super("/world/availableItems/set", ExpressRouteType.POST);
    this.dbName = "World";
  }

  handleRequest = async (
    _req: express.Request,
    _res: express.Response,
    _next: express.NextFunction
  ) => {
    let response:any;

    const documents:any[] = []

    for(const e of _req.body){
        documents.push({
            id: GetGUID(),
            ...e
        })
    }

    console.log(this.db)

    if (this.db) {
      const db: Db = <Db>this.db;

      const collection: Collection = db.collection(this._collectionName);

      await collection.deleteMany({})

      await collection.insertMany(documents)

      response = "Dokumente eingefügt"

      // if(this.db){
      //     const collection:mongodb.Collection = this.db
      // }
    }else{
        response = "this.db was undefined"
    }

    makeResponse(_res, 200, response);
  };
}

module.exports = SetAvailableItemsEndpoint;
