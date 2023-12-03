import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType, makeResponse } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";
import express from "express"
import { GetGUID } from "../../../../../athaeck-websocket-express-base/base/helper";
import { Db, Collection } from "mongodb";

class SetAvailablePositionsEndpoint extends BaseNoSQLExpressRouteExtension {
    dbName: string;
    private _collectionName: string = "AvailablePositions";
  
    constructor() {
      super("/world/availablePositions/set", ExpressRouteType.POST);
      this.dbName = "World";
    }
  
    handleRequest = async (
      _req: express.Request,
      _res: express.Response,
      _next: express.NextFunction
    ) => {
  
      let response: any;
      let status: number;
      const documents: any[] = [];
  
      for (const e of _req.body) {
        documents.push({
          _id: GetGUID(),
          ...e,
        });
      }
  
      console.log("documents to index: ",documents);
  
      if (this.db) {
  
        const db: Db = <Db>this.db;
  
        const collection: Collection = db.collection(this._collectionName);
  
        await collection.deleteMany({});
  
        await collection.insertMany(documents);
  
        response = "completed";
        status = 200;
      } else {
        response = "this.db ist undefined";
        status = 500;
      }
  
      makeResponse(_res, status, response);
    };
  
  }
  
  module.exports = SetAvailablePositionsEndpoint;
  