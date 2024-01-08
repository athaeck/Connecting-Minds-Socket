import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class AddAvailableItemEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "availableItems";
  
    constructor() {
      super("/world/availableItems/add", ExpressRouteType.POST);
      this.dbName = "world";
    }
    
}


module.exports = AddAvailableItemEndpoint