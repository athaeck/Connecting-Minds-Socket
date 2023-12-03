import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class RemoveUnlockedPositionEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "UnlockedPositions";
  
    constructor() {
      super("/world/unlockedPaths/del", ExpressRouteType.DELETE);
      this.dbName = "World";
    }
    
}


module.exports = RemoveUnlockedPositionEndpoint