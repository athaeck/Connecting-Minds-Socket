import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class AddPathEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "paths";
  
    constructor() {
      super("/world/paths/add", ExpressRouteType.POST);
      this.dbName = "world";
    }
    
}


module.exports = AddPathEndpoint