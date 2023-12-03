import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class RemoveAvailablePositionEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "AvailablePositions";
  
    constructor() {
      super("/world/availablePositions/del", ExpressRouteType.DELETE);
      this.dbName = "World";
    }
    
}


module.exports = RemoveAvailablePositionEndpoint