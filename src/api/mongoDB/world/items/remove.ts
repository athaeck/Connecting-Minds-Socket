import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class RemoveItemEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "Items";
  
    constructor() {
      super("/world/items/del", ExpressRouteType.DELETE);
      this.dbName = "World";
    }
    
}


module.exports = RemoveItemEndpoint