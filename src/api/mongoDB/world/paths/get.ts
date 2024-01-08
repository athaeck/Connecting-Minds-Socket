import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class GetPathsEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "paths";
  
    constructor() {
      super("/world/paths/get", ExpressRouteType.GET);
      this.dbName = "world";
    }
    
}


module.exports = GetPathsEndpoint