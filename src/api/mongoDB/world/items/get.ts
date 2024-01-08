import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class GetItemsEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "items";
  
    constructor() {
      super("/world/items/get", ExpressRouteType.GET);
      this.dbName = "world";
    }
    
}


module.exports = GetItemsEndpoint