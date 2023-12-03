import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class AddAvailableItemEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "AvailableItems";
  
    constructor() {
      super("/world/availableItems/add", ExpressRouteType.POST);
      this.dbName = "World";
    }
    
}


module.exports = AddAvailableItemEndpoint