import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class AddAItemEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "items";
  
    constructor() {
      super("/world/items/add", ExpressRouteType.POST);
      this.dbName = "world";
    }
    
}


module.exports = AddAItemEndpoint