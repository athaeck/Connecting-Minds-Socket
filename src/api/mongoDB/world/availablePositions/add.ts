import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class AddAvailablePositionEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "availablePositions";
  
    constructor() {
      super("/world/availablePositions/add", ExpressRouteType.POST);
      this.dbName = "world";
    }
    
}


module.exports = AddAvailablePositionEndpoint