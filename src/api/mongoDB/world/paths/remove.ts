import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class RemoovePathEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "paths";
  
    constructor() {
      super("/world/paths/del", ExpressRouteType.DELETE);
      this.dbName = "world";
    }
    
}


module.exports = RemoovePathEndpoint