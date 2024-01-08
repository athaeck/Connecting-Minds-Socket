import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class GetUsedPositionsEndpoint extends BaseNoSQLExpressRouteExtension {
  dbName: string;
  private _collectionName: string = "usedPositions";

  constructor() {
    super("/world/usedPositions/get", ExpressRouteType.GET);
    this.dbName = "world";
  }

}


module.exports = GetUsedPositionsEndpoint