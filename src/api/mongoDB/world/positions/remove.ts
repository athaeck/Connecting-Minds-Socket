import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class RemovePositionEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "Positions";
  
    constructor() {
      super("/world/positions/del", ExpressRouteType.DELETE);
      this.dbName = "World";
    }
    
}


module.exports = RemovePositionEndpoint