import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class AddPathEndpoint extends BaseNoSQLExpressRouteExtension{
    dbName: string;
    private _collectionName: string = "Paths";
  
    constructor() {
      super("/world/paths/add", ExpressRouteType.POST);
      this.dbName = "World";
    }
    
}


module.exports = AddPathEndpoint