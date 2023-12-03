import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class SetUnlockedPathsEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "UnlockedPaths";
  
    constructor() {
      super("/world/unlockedPaths/set", ExpressRouteType.POST);
      this.dbName = "World";
    }
    
}


module.exports = SetUnlockedPathsEndpoint