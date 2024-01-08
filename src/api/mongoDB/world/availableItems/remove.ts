import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class RemoveAvailableItemEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "availableItems";
  
    constructor() {
      super("/world/availableItems/del", ExpressRouteType.DELETE);
      this.dbName = "world";
    }
}

module.exports = RemoveAvailableItemEndpoint